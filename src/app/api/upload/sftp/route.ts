import { NextRequest, NextResponse } from "next/server";
import { uploadSftpFile } from "@/lib/sftp";
import { revalidatePath } from "next/cache";

export const maxDuration = 60; // Configuración correcta para Route Handlers en Vercel

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No se encontró el archivo" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadSftpFile(file.name, buffer);

    // No se puede usar revalidatePath directamente en Route Handlers de la misma forma que actions
    // pero igual intentamos notificar al sistema de cache
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error en upload SFTP:", error);
    return NextResponse.json({ error: error.message || "Error al subir archivo" }, { status: 500 });
  }
}
