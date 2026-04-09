"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchFtpFiles } from "@/app/actions/ftp";
import styles from "./FileModule.module.css";
import { Upload, RefreshCw, File as FileIcon, Folder, Search, ArrowUp, ArrowDown } from "lucide-react";

type RemoteFile = {
  name: string;
  type: string;
  size: number;
  modifyTime: number;
};

type SortKey = "name" | "size" | "modifyTime";
type SortDir = "asc" | "desc";

export default function FtpModule() {
  const [files, setFiles] = useState<RemoteFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const loadFiles = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchFtpFiles();
      setFiles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".bz2")) {
      setError("Solo se permiten archivos .bz2 en el FastDL (FTP).");
      return;
    }

    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload/ftp", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (!response.ok || result.error) {
      setError(result.error || "Error desconocido");
    } else {
      await loadFiles();
    }
    setUploading(false);
    e.target.value = "";
  };



  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return null;
    return sortDir === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  const displayFiles = useMemo(() => {
    let result = [...files];

    // Filter
    if (filter.trim()) {
      const q = filter.toLowerCase();
      result = result.filter((f) => f.name.toLowerCase().includes(q));
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        cmp = a.name.localeCompare(b.name);
      } else if (sortKey === "size") {
        cmp = a.size - b.size;
      } else if (sortKey === "modifyTime") {
        cmp = a.modifyTime - b.modifyTime;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [files, filter, sortKey, sortDir]);

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>FastDL (FTP)</h2>
        <div className={styles.actions}>
          <button className={styles.iconBtn} onClick={loadFiles} disabled={loading || uploading}>
            <RefreshCw size={16} className={loading && !uploading ? "animate-spin" : ""} /> Refrescar
          </button>
          <label className={styles.uploadLabel}>
            <Upload size={16} /> {uploading ? "Subiendo..." : "Subir .bz2"}
            <input
              type="file"
              accept=".bz2"
              className={styles.uploadInput}
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div className={styles.filterBar}>
        <Search size={16} className={styles.filterIcon} />
        <input
          type="text"
          className={styles.filterInput}
          placeholder="Buscar por nombre..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        {filter && (
          <span className={styles.filterCount}>
            {displayFiles.length} de {files.length}
          </span>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>Cargando archivos...</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.sortableHeader} onClick={() => handleSort("name")}>
                Nombre <SortIcon column="name" />
              </th>
              <th className={styles.sortableHeader} onClick={() => handleSort("size")}>
                Tamaño <SortIcon column="size" />
              </th>
              <th className={styles.sortableHeader} onClick={() => handleSort("modifyTime")}>
                Fecha Modificación <SortIcon column="modifyTime" />
              </th>

            </tr>
          </thead>
          <tbody>
            {displayFiles.length === 0 ? (
              <tr>
                <td colSpan={3} className={styles.emptyState}>
                  {filter ? "No se encontraron archivos con ese filtro" : "No hay archivos en el FastDL"}
                </td>
              </tr>
            ) : (
              displayFiles.map((file) => (
                <tr key={file.name}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {file.type === "d" ? <Folder size={16} color="#fbbf24" /> : <FileIcon size={16} color="#94a3b8" />}
                      {file.name}
                    </div>
                  </td>
                  <td>{file.type === "d" ? "-" : formatSize(file.size)}</td>
                  <td>{file.modifyTime ? new Date(file.modifyTime).toLocaleString() : "-"}</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
