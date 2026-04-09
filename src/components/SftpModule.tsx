"use client";

import { useState, useEffect } from "react";
import { fetchSftpFiles, submitSftpUpload, submitSftpDelete } from "@/app/actions/sftp";
import styles from "./FileModule.module.css";
import { Upload, RefreshCw, Trash2, File as FileIcon, Folder } from "lucide-react";

type RemoteFile = {
  name: string;
  type: string;
  size: number;
  modifyTime: number;
};

export default function SftpModule() {
  const [files, setFiles] = useState<RemoteFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const loadFiles = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchSftpFiles();
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

    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    const result = await submitSftpUpload(formData);
    if (result.error) {
      setError(result.error);
    } else {
      await loadFiles();
    }
    setUploading(false);
    e.target.value = ""; // reset input
  };

  const handleDelete = async (fileName: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar ${fileName}?`)) return;

    setError("");
    const result = await submitSftpDelete(fileName);
    if (result.error) {
      setError(result.error);
    } else {
      await loadFiles();
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>Mapas del Servidor (SFTP)</h2>
        <div className={styles.actions}>
          <button className={styles.iconBtn} onClick={loadFiles} disabled={loading || uploading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refrescar
          </button>
          <label className={styles.uploadLabel}>
            <Upload size={16} /> {uploading ? "Subiendo..." : "Subir Archivo"}
            <input
              type="file"
              className={styles.uploadInput}
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>Cargando archivos...</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tamaño</th>
              <th>Fecha Modificación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.emptyState}>No hay archivos en esta carpeta</td>
              </tr>
            ) : (
              files.map((file) => (
                <tr key={file.name}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {file.type === "d" ? <Folder size={16} color="#fbbf24" /> : <FileIcon size={16} color="#94a3b8" />}
                      {file.name}
                    </div>
                  </td>
                  <td>{file.type === "d" ? "-" : formatSize(file.size)}</td>
                  <td>{new Date(file.modifyTime).toLocaleString()}</td>
                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(file.name)}
                      title="Eliminar archivo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
