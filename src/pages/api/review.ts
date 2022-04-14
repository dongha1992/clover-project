import path from 'path';
import fs from 'fs/promises';

export function buildItemDataPath() {
  return path.join(process.cwd(), 'data', 'review.json');
}

async function extractData(filePath: any) {
  const fileData: any = await fs.readFile(filePath);
  const { data } = JSON.parse(fileData);
  return data;
}

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const filePath = buildItemDataPath();
    const data = await extractData(filePath);
    res.status(200).json({ data });
    return;
  }
}
