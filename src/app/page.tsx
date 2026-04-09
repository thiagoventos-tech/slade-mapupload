import { logout } from "@/app/actions/auth";
import DashboardWrapper from "@/components/DashboardWrapper";
import GuidePanel from "@/components/GuidePanel";
import styles from "./page.module.css";
import { LogOut } from "lucide-react";

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h2>Admin Panel</h2>
        </div>
        <form action={logout}>
          <button type="submit" className={styles.logoutBtn}>
            <LogOut size={18} /> Salir
          </button>
        </form>
      </header>

      <section className={styles.content}>
        <div className={styles.layout}>
          <div className={styles.mainPanel}>
            <DashboardWrapper />
          </div>
          <aside className={styles.sidePanel}>
            <GuidePanel />
          </aside>
        </div>
      </section>
    </main>
  );
}
