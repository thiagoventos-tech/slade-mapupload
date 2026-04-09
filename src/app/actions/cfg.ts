"use server";

import { readTextFile, writeTextFile } from "@/lib/sftp";
import { revalidatePath } from "next/cache";

export async function fetchTextFileContent(fileKey: string) {
  try {
    return await readTextFile(fileKey);
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener el archivo");
  }
}

export async function submitTextFileSave(fileKey: string, content: string) {
  try {
    await writeTextFile(fileKey, content);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Error al guardar el archivo" };
  }
}
