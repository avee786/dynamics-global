import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), 'src/data');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const filePath = path.join(DATA_DIR, `${type}.json`);

  try {
    const data = await fs.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Data source not found' }, { status: 404 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const filePath = path.join(DATA_DIR, `${type}.json`);
  const body = await request.json();

  try {
    const existingData = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const updatedData = [body, ...existingData];
    await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2));
    return NextResponse.json({ success: true, entry: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const filePath = path.join(DATA_DIR, `${type}.json`);
  const { id, updates } = await request.json();

  try {
    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const index = data.findIndex((item: any) => item.id === id);
    if (index === -1) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    
    data[index] = { ...data[index], ...updates };
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
