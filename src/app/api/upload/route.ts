import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Security Validation
    const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF, Image, and DOCX allowed.' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size too large (Max: 10MB)' }, { status: 400 });
    }

    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      fileName: file.name,
      fileUrl: `/uploads/${fileName}` 
    });
  } catch (error) {
    console.error('File Upload Error:', error);
    return NextResponse.json({ error: 'File Upload Failed' }, { status: 500 });
  }
}
