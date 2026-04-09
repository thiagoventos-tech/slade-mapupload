import styles from "./GuidePanel.module.css";
import { BookOpen, Download, Zap } from "lucide-react";

export default function GuidePanel() {
  const downloadUrl = "https://drive.usercontent.google.com/download?id=1Q9Ak_jcKARnJho10dEm-MgBCVkJyrenW&export=download&authuser=1&confirm=t&uuid=3d1e06dd-c937-49f8-b571-ddc525a8b3a0&at=ALBwUgm8G1TOeWm4lEyeD-SHpHpR:1775700758334";

  return (
    <div className={styles.guide}>
      <div className={styles.header}>
        <BookOpen size={20} />
        <h3>Guía de Uso</h3>
      </div>

      <div className={styles.steps}>
        <div className={styles.step}>
          <span className={styles.stepNumber}>1</span>
          <div className={styles.stepContent}>
            <strong>Subir .bsp y .nav al Servidor</strong>
            <p>
              Ir a la pestaña <em>Mapas Juego (SFTP)</em> y subir ambos
              archivos del mapa.
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <span className={styles.stepNumber}>2</span>
          <div className={styles.stepContent}>
            <strong>Subir .bz2 al FastDL</strong>
            <p>
              Ir a la pestaña <em>FastDL (FTP)</em> y subir los archivos
              comprimidos en formato <code>.bz2</code> (tanto .bsp.bz2 como
              .nav.bz2).
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <span className={styles.stepNumber}>3</span>
          <div className={styles.stepContent}>
            <strong>Agregar al mapcycle y maplist</strong>
            <p>
              Ir a las pestañas <em>mapcycle.txt</em> y <em>maplist.txt</em> y
              agregar el nombre del mapa <strong>sin la extensión</strong>.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.compressionBox}>
        <div className={styles.compressionHeader}>
          <Zap size={16} />
          <span>Herramienta de Compresión</span>
        </div>
        <p className={styles.compressionDesc}>
          Descargá esta herramienta para comprimir tus archivos a .bz2 fácilmente.
        </p>
        <a 
          href={downloadUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.downloadBtn}
        >
          <Download size={16} /> Descargar Compresor
        </a>
        <div className={styles.instruction}>
          <strong>Uso:</strong> Arrastrá tus archivos a la herramienta y se comprimirán solos.
        </div>
        <div className={styles.warning}>
          ⚠️ <strong>Nota:</strong> Hacelo después del Paso 1, ya que la herramienta transforma los archivos originales.
        </div>
      </div>

      <div className={styles.example}>
        <div className={styles.exampleTitle}>Ejemplo</div>
        <p>
          Si el archivo se llama:<br />
          <code>2000_slade.bsp</code>
        </p>
        <p>
          En los .txt escribir:<br />
          <code>2000_slade</code>
        </p>
      </div>
    </div>
  );
}
