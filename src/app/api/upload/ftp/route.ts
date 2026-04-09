import { NextRequest, NextResponse } from "next/server";
import { uploadFtpFile } from "@/lib/ftp";
import { revalidatePath } from "next/cache";

export const maxDuration = 60; // Configuración correcta para Route Handlers en Vercel

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No se encontró el archivo" }, { status: 400 });
    }

    if (!file.name.endsWith(".bz2")) {
      return NextResponse.json({ error: "Solo se permiten archivos .bz2" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadFtpFile(file.name, buffer);

    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error en upload FTP:", error);
    return NextResponse.json({ error: error.message || "Error al subir archivo" }, { status: 500 });
  }
}
