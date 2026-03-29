import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest) {
  console.log('>>> [PDF API] REQUEST RECEIVED (CWD:', process.cwd(), ')');
  
  try {
    const { projectId } = await request.json();
    console.log('>>> [PDF API] Project ID:', projectId);

    // Resolve the correct path to projects.json
    const projectsJsonPath = path.join(process.cwd(), 'src', 'data', 'projects.json');
    console.log('>>> [PDF API] checking path:', projectsJsonPath);

    // Check if file exists
    if (!fs.existsSync(projectsJsonPath)) {
      return NextResponse.json(
        { error: 'Projects data file not found' },
        { status: 404 }
      );
    }

    console.log('>>> [PDF API] FOUND DATA AT:', projectsJsonPath);

    // Read projects data
    const projectsData = JSON.parse(fs.readFileSync(projectsJsonPath, 'utf-8'));
    const project = projectsData.find((p: any) => p.id === projectId || p._id === projectId);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    console.log('>>> [PDF API] Starting compiler...');

    // Use server-side PDF generation
    const pdfBuffer = await generateServerSidePDF(project);

    // Return PDF as response
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="DG_Agreement_${projectId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('>>> [PDF API] CRITICAL FAILURE:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: String(error) },
      { status: 500 }
    );
  }
}

// Server-side PDF generation using PDFKit with proper initialization
async function generateServerSidePDF(project: any): Promise<Buffer> {
  const PDFDocument = require('pdfkit');
  const pdfkitPath = require.resolve('pdfkit');
  const fontDataPath = path.join(path.dirname(pdfkitPath), '..', 'js', 'data');
  
  console.log('>>> [PDF] Using font directory:', fontDataPath);
  
  return new Promise((resolve, reject) => {
    try {
      // Create document with explicit font settings
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true,
      });

      const buffers: Buffer[] = [];
      
      doc.on('data', (chunk: Buffer) => buffers.push(chunk));
      doc.on('end', () => {
        console.log('>>> [PDF] PDF generation completed successfully');
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', (error: any) => {
        console.error('>>> [PDF] PDF generation error:', error);
        reject(error);
      });

      // Generate simple PDF with project information
      generatePDFContent(doc, project);
      
      // Finalize the document
      doc.end();
    } catch (error) {
      console.error('>>> [PDF] Unexpected error during PDF generation:', error);
      reject(error);
    }
  });
}

// Helper function to generate PDF content
function generatePDFContent(doc: any, project: any) {
  const AMBER = '#F59E0B';
  const DARK = '#050A14';
  const LIGHT = '#64748B';
  const PW = 595.28 - 100; // page width with margins

  try {
    // Use system fonts that don't require AFM files
    doc.font('Helvetica');
    
    // Header
    doc.rect(0, 0, 595.28, 6).fill(AMBER);
    
    // Title
    doc.fontSize(24).fillColor(DARK).text('PROJECT AGREEMENT', 50, 40);
    doc.fontSize(10).fillColor(LIGHT).text('Dynamics Global Operations Group', 50, 70);
    
    // Divider
    doc.moveTo(50, 100).lineTo(50 + PW, 100).lineWidth(1).strokeColor(AMBER).stroke();
    
    let y = 120;
    
    // Project Information
    doc.fontSize(12).fillColor(DARK).text('PROJECT INFORMATION', 50, y);
    y += 20;
    
    doc.fontSize(10).fillColor(LIGHT).text('Project ID:', 50, y);
    doc.fontSize(10).fillColor(DARK).text(project.id || 'N/A', 150, y);
    y += 18;
    
    doc.fontSize(10).fillColor(LIGHT).text('Title:', 50, y);
    doc.fontSize(10).fillColor(DARK).text(project.title || 'N/A', 150, y);
    y += 18;
    
    doc.fontSize(10).fillColor(LIGHT).text('Client:', 50, y);
    doc.fontSize(10).fillColor(DARK).text(project.client || project.companyName || 'N/A', 150, y);
    y += 18;
    
    doc.fontSize(10).fillColor(LIGHT).text('Location:', 50, y);
    doc.fontSize(10).fillColor(DARK).text(project.location || 'N/A', 150, y);
    y += 18;
    
    doc.fontSize(10).fillColor(LIGHT).text('Budget:', 50, y);
    doc.fontSize(10).fillColor(DARK).text(project.budget || 'N/A', 150, y);
    y += 18;
    
    doc.fontSize(10).fillColor(LIGHT).text('Status:', 50, y);
    doc.fontSize(10).fillColor(DARK).text(project.status || 'N/A', 150, y);
    y += 30;
    
    // Description
    doc.fontSize(12).fillColor(DARK).text('DESCRIPTION', 50, y);
    y += 18;
    
    doc.fontSize(9.5).fillColor(LIGHT).text(project.summary || project.description || 'N/A',50, y, { width: PW, align: 'left' });
    
    // Footer
    const footerY = 750;
    doc.moveTo(50, footerY).lineTo(50 + PW, footerY).lineWidth(0.5).strokeColor(LIGHT).stroke();
    doc.fontSize(8).fillColor(LIGHT).text('CONFIDENTIAL © 2026 Dynamics Global Operations Group', 50, footerY + 10);
    doc.fontSize(8).text('Page 1', 50 + PW - 40, footerY + 10);
    
  } catch (error) {
    console.error('>>> [PDF] Error generating content:', error);
    throw error;
  }
}
