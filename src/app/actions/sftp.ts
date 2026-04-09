"use server";

import { listSftpFiles, uploadSftpFile, deleteSftpFile } from "@/lib/sftp";
import { revalidatePath } from "next/cache";

export async function fetchSftpFiles() {
  try {
    return await listSftpFiles();
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener archivos SFTP");
  }
}

export async function submitSftpUpload(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No se envió ningún archivo");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await uploadSftpFile(file.name, buffer);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Error al subir archivo SFTP" };
  }
}

export async function submitSftpDelete(fileName: string) {
  try {
    await deleteSftpFile(fileName);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Error al borrar archivo SFTP" };
  }
}
