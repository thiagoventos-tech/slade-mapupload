"use client";

import { useState } from "react";
import SftpModule from "./SftpModule";
import FtpModule from "./FtpModule";
import CfgEditor from "./CfgEditor";
import styles from "./DashboardWrapper.module.css";
import { Server, Database, FileText } from "lucide-react";

export default function DashboardWrapper() {
  const [activeTab, setActiveTab] = useState<"sftp" | "ftp" | "umi_mapcycle">("sftp");

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === "sftp" ? styles.active : ""}`}
          onClick={() => setActiveTab("sftp")}
        >
          <Server size={18} /> Mapas Juego (SFTP)
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "ftp" ? styles.active : ""}`}
          onClick={() => setActiveTab("ftp")}
        >
          <Database size={18} /> FastDL (FTP)
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "umi_mapcycle" ? styles.active : ""}`}
          onClick={() => setActiveTab("umi_mapcycle")}
        >
          <FileText size={18} /> umi_mapcycle.txt
        </button>
      </div>

      <div className={styles.moduleContainer}>
        {activeTab === "sftp" && <SftpModule />}
        {activeTab === "ftp" && <FtpModule />}
        {activeTab === "umi_mapcycle" && <CfgEditor fileKey="umi_mapcycle" fileName="umi_mapcycle.txt" />}
      </div>
    </div>
  );
}
