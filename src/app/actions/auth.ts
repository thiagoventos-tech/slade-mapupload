"use server";

import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  const user = formData.get("username");
  const pass = formData.get("password");

  if (
    user === process.env.APP_USERNAME &&
    pass === process.env.APP_PASSWORD
  ) {
    await createSession("admin");
    redirect("/");
  }

  return { error: "Credenciales inválidas." };
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
