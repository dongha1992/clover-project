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

  if (req.method === 'PUT') {
    const filePath = buildCartListPath();
    let data = await extractData(filePath);

    const { menuDetailId, quantity } = req.body.params;
    const newData = data.data.map((item: any) => {
      if (item.id === menuDetailId) {
        return { ...item, quantity };
      } else {
        return item;
      }
    });

    await fs.writeFile(filePath, JSON.stringify({ data: newData }));
    res.status(200).send({ message: 'success' });
    return;
  }

  if (req.method === 'DELETE') {
    const filePath = buildCartListPath();
    let data = await extractData(filePath);
    const selectedIds = req.body;
    const filteredData = data.data.filter((item: any) => !selectedIds.includes(item.id));
    await fs.writeFile(filePath, JSON.stringify({ data: filteredData }));
    res.status(200).send({ message: 'success' });
    return;
  }
}
