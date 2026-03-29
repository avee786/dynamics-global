import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Project } from '@/models/Project';
import { buildProjectContract } from '@/utils/pdf';

export async function POST(req: Request) {
  try {
    // 1. Database Connection
    await connectDB();

    // 2. Parse Body for Project ID
    const { projectId } = await req.json();
    if (!projectId) {
      return NextResponse.json({ success: false, message: 'Project ID is required' }, { status: 400 });
    }

    // 3. Security (Simulated JWT check, since JWT plan was not fully implemented yet)
    // Note: In a complete JWT setup, you would verify req.headers.get('Authorization') here.

    // 4. Fetch the specific project from MongoDB
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ success: false, message: 'Project record not found in database' }, { status: 404 });
    }

    // 5. Build the PDF Binary Buffer using our utility
    const pdfBuffer = await buildProjectContract(project);

    // 6. Return standard application/pdf stream with standard downloading headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="DG_Agreement_PRJ_${project._id}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error compiling PDF stream' }, { status: 500 });
  }
}
