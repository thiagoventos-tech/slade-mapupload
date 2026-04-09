"use server";

import { readCfgFile, writeCfgFile } from "@/lib/sftp";
import { revalidatePath } from "next/cache";

export async function fetchCfgContent() {
  try {
    return await readCfgFile();
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener el archivo CFG");
  }
}

export async function submitCfgSave(content: string) {
  try {
    await writeCfgFile(content);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Error al guardar el archivo CFG" };
  }
}
