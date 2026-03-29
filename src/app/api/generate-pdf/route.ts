import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Project } from '@/models/Project';
import { buildProjectContract } from '@/utils/pdf';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const root = process.cwd();
  console.log(">>> [PDF API] REQUEST RECEIVED (CWD: " + root + ")");
  
  try {
    const { projectId } = await req.json();
    console.log(">>> [PDF API] Project ID:", projectId);

    if (!projectId) {
      return NextResponse.json({ success: false, message: 'Project ID is required' }, { status: 400 });
    }

    let project: any = null;

    // 1. Search File System for "PRJ-" Projects
    if (typeof projectId === 'string' && projectId.startsWith('PRJ-')) {
      const dataPaths = [
        path.join(root, 'src', 'data', 'projects.json'),
        path.join(root, 'data', 'projects.json'),
        path.join(process.env.NEXT_RUNTIME === 'nodejs' ? root : '', 'src/data/projects.json')
      ];

      for (const p of dataPaths) {
        console.log(">>> [PDF API] checking path: " + p);
        if (require('fs').existsSync(p)) {
          console.log(">>> [PDF API] FOUND DATA AT: " + p);
          const data = JSON.parse(await fs.readFile(p, 'utf8'));
          project = data.find((x: any) => x.id === projectId || x._id === projectId);
          break;
        }
      }
    }

    // 2. Search MongoDB if not found or not a "PRJ-" ID
    if (!project) {
      console.log(">>> [PDF API] DB Look-up starting...");
      try {
        await connectDB();
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(projectId);
        if (isValidObjectId) {
          project = await Project.findById(projectId);
        }
      } catch (dbErr: any) {
        console.error(">>> [PDF API] DB Look-up Fail: " + dbErr.message);
      }
    }

    if (!project) {
      return NextResponse.json({ success: false, message: 'Record ' + projectId + ' not found in any source' }, { status: 404 });
    }

    // Map common fields
    if (!project.companyName) project.companyName = project.client;
    if (!project.projectType) project.projectType = project.title;

    // 3. Generate PDF
    console.log(">>> [PDF API] Starting compiler...");
    const pdfBuffer = await buildProjectContract(project);
    console.log(">>> [PDF API] Compiler success.");

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="DG_Agreement_PRJ_${projectId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('>>> [PDF API] CRITICAL FAILURE:', error.message);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Compiler process failed',
      stack: error.stack
    }, { status: 500 });
  }
}
