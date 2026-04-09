import { Client } from "basic-ftp";
import { Readable } from "stream";

function getFtpConfig() {
  return {
    host: process.env.FTP_HOST,
    port: parseInt(process.env.FTP_PORT || "21"),
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
  };
}

export async function listFtpFiles() {
  const client = new Client();
  try {
    await client.access(getFtpConfig());
    const basePath = process.env.FTP_BASE_PATH!;
    await client.cd(basePath);
    const fileList = await client.list();
    
    return fileList.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
      return a.name.localeCompare(b.name);
    }).map(f => ({
      name: f.name,
      type: f.isDirectory ? 'd' : '-',
      size: f.size,
      modifyTime: f.modifiedAt ? new Date(f.modifiedAt).getTime() : 0,
    }));
  } finally {
    client.close();
  }
}

export async function uploadFtpFile(fileName: string, buffer: Buffer) {
  const safeName = fileName.replace(/[^a-zA-Z0-9_\-\.]/g, "");
  if (!safeName) throw new Error("Filename is invalid.");
  if (!safeName.endsWith(".bz2")) {
    throw new Error("Invalid file extension. Only .bz2 allowed.");
  }

  const client = new Client();
  try {
    await client.access(getFtpConfig());
    const basePath = process.env.FTP_BASE_PATH!;
    await client.cd(basePath);

    const stream = Readable.from(buffer);
    await client.uploadFrom(stream, safeName);
    return true;
  } finally {
    client.close();
  }
}

export async function deleteFtpFile(fileName: string) {
  const safeName = fileName.replace(/[^a-zA-Z0-9_\-\.]/g, "");
  if (!safeName) throw new Error("Invalid filename");

  const client = new Client();
  try {
    await client.access(getFtpConfig());
    const basePath = process.env.FTP_BASE_PATH!;
    await client.cd(basePath);
    await client.remove(safeName);
    return true;
  } finally {
    client.close();
  }
}
