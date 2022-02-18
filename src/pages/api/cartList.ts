import path from 'path';
import fs from 'fs/promises';

function buildCartListPath() {
  return path.join(process.cwd(), 'data', 'cartList.json');
}

async function extractData(filePath: any) {
  const fileData: any = await fs.readFile(filePath);
  const data = JSON.parse(fileData);
  return data;
}

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const filePath = buildCartListPath();
    const data = await extractData(filePath);
    res.status(200).json(data);
    return;
  }

  if (req.method === 'POST') {
    const filePath = buildCartListPath();
    let data = await extractData(filePath);
    const body = req.body;
    data = [...data.data, ...body.data];
    await fs.writeFile(filePath, JSON.stringify({ data }));

    res.status(200).send({ message: 'success' });
    return;
  }
}
