"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import styles from "./login.module.css";
import { Lock } from "lucide-react";

const initialState = {
  error: "",
};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <Lock size={48} className={styles.icon} />
        </div>
        <h1 className={styles.title}>Panel Privado</h1>
        <form action={formAction} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              disabled={pending}
              className={styles.input}
              placeholder="Ingresar usuario..."
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              disabled={pending}
              className={styles.input}
              placeholder="Ingresar contraseña..."
            />
          </div>
          {state?.error && <p className={styles.error}>{state.error}</p>}
          <button type="submit" disabled={pending} className={styles.button}>
            {pending ? "Iniciando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
