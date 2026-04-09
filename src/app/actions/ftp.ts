"use server";

import { listFtpFiles, uploadFtpFile, deleteFtpFile } from "@/lib/ftp";
import { revalidatePath } from "next/cache";

export async function fetchFtpFiles() {
  try {
    return await listFtpFiles();
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener archivos FTP");
  }
}

export async function submitFtpUpload(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No se envió ningún archivo");
    
    if (!file.name.endsWith(".bz2")) {
      return { error: "Formato inválido. Solo se admiten archivos .bz2" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await uploadFtpFile(file.name, buffer);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Error al subir archivo FTP" };
  }
}

export async function submitFtpDelete(fileName: string) {
  try {
    await deleteFtpFile(fileName);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Error al borrar archivo FTP" };
  }
}
