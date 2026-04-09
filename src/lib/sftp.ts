import Client from "ssh2-sftp-client";

function getSftpConfig() {
  return {
    host: process.env.SFTP_HOST,
    port: parseInt(process.env.SFTP_PORT || "22"),
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASSWORD,
  };
}

export async function listSftpFiles() {
  const sftp = new Client();
  try {
    await sftp.connect(getSftpConfig());
    const basePath = process.env.SFTP_BASE_PATH!;
    const fileList = await sftp.list(basePath);
    
    // Sort directories first, then files, alphabetically
    return fileList.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'd' ? -1 : 1;
      return a.name.localeCompare(b.name);
    }).map(f => ({
      name: f.name,
      type: f.type, // 'd' or '-'
      size: f.size,
      modifyTime: f.modifyTime,
    }));
  } finally {
    await sftp.end();
  }
}

export async function uploadSftpFile(fileName: string, buffer: Buffer) {
  const sftp = new Client();
  try {
    // Sanitize filename to prevent path traversal
    const safeName = fileName.replace(/[^a-zA-Z0-9_\-\.]/g, "");
    if (!safeName) throw new Error("Invalid filename");

    await sftp.connect(getSftpConfig());
    const remotePath = `${process.env.SFTP_BASE_PATH!}/${safeName}`;
    await sftp.put(buffer, remotePath);
    return true;
  } finally {
    await sftp.end();
  }
}

export async function deleteSftpFile(fileName: string) {
  const sftp = new Client();
  try {
    const safeName = fileName.replace(/[^a-zA-Z0-9_\-\.]/g, "");
    if (!safeName) throw new Error("Invalid filename");

    await sftp.connect(getSftpConfig());
    const remotePath = `${process.env.SFTP_BASE_PATH!}/${safeName}`;
    await sftp.delete(remotePath);
    return true;
  } finally {
    await sftp.end();
  }
}

export async function readCfgFile() {
  const sftp = new Client();
  try {
    await sftp.connect(getSftpConfig());
    const filePath = process.env.SFTP_TEXT_FILE_PATH!;
    const buffer = await sftp.get(filePath);
    return (buffer as Buffer).toString("utf-8");
  } finally {
    await sftp.end();
  }
}

export async function writeCfgFile(content: string) {
  const sftp = new Client();
  try {
    await sftp.connect(getSftpConfig());
    const filePath = process.env.SFTP_TEXT_FILE_PATH!;
    await sftp.put(Buffer.from(content, "utf-8"), filePath);
    return true;
  } finally {
    await sftp.end();
  }
}
