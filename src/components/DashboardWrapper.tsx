"use client";

import { useState } from "react";
import SftpModule from "./SftpModule";
import FtpModule from "./FtpModule";
import CfgEditor from "./CfgEditor";
import styles from "./DashboardWrapper.module.css";
import { Server, Database, FileText, List } from "lucide-react";

export default function DashboardWrapper() {
  const [activeTab, setActiveTab] = useState<"sftp" | "ftp" | "mapcycle" | "maplist">("sftp");

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
          className={`${styles.tabBtn} ${activeTab === "mapcycle" ? styles.active : ""}`}
          onClick={() => setActiveTab("mapcycle")}
        >
          <FileText size={18} /> mapcycle.txt
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "maplist" ? styles.active : ""}`}
          onClick={() => setActiveTab("maplist")}
        >
          <List size={18} /> maplist.txt
        </button>
      </div>

      <div className={styles.moduleContainer}>
        {activeTab === "sftp" && <SftpModule />}
        {activeTab === "ftp" && <FtpModule />}
        {activeTab === "mapcycle" && <CfgEditor fileKey="mapcycle" fileName="mapcycle.txt" />}
        {activeTab === "maplist" && <CfgEditor fileKey="maplist" fileName="maplist.txt" />}
      </div>
    </div>
  );
}
