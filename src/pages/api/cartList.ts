import path from 'path';
import fs from 'fs/promises';
import { buildItemDataPath } from './itemList';
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
    const filePath = await buildItemDataPath();
    const cartFilePath = await buildCartListPath();
    const data = await extractData(filePath);
    let cartData = await extractData(cartFilePath);

    const { menuDetailId, quantity } = req.body.params;

    let foundItem = data.data.find((item: any) => item.id === 1).details.find((item: any) => item.id === menuDetailId);
    foundItem.quantity = quantity;
    cartData.data = cartData.data.filter((item: any) => item.id !== foundItem.id);
    cartData.data.push(foundItem);

    await fs.writeFile(cartFilePath, JSON.stringify(cartData));
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
