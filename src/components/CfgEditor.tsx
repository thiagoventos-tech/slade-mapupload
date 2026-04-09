"use client";

import { useState, useEffect } from "react";
import { fetchTextFileContent, submitTextFileSave } from "@/app/actions/cfg";
import styles from "./CfgEditor.module.css";
import { Save, RefreshCw } from "lucide-react";

interface CfgEditorProps {
  fileKey: string;
  fileName: string;
}

export default function CfgEditor({ fileKey, fileName }: CfgEditorProps) {
  const [content, setContent] = useState<string>("");
  const [originalContent, setOriginalContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadContent = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await fetchTextFileContent(fileKey);
      setContent(data);
      setOriginalContent(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [fileKey]);

  const handleSave = async () => {
    if (!window.confirm(`¿Estás seguro de guardar los cambios en ${fileName}?`)) return;

    setSaving(true);
    setError("");
    setSuccess("");
    const result = await submitTextFileSave(fileKey, content);
    
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Archivo guardado correctamente.");
      setOriginalContent(content);
      setTimeout(() => setSuccess(""), 3000);
    }
    setSaving(false);
  };

  const hasChanges = content !== originalContent;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Editor de {fileName}</h2>
        <div className={styles.actions}>
          <button className={styles.iconBtn} onClick={loadContent} disabled={loading || saving}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Recargar
          </button>
          <button 
            className={styles.saveBtn} 
            onClick={handleSave} 
            disabled={saving || !hasChanges}
          >
            <Save size={16} /> {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {loading ? (
        <div className={styles.loading}>Cargando archivo...</div>
      ) : (
        <textarea
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
          disabled={saving}
        />
      )}
    </div>
  );
}
