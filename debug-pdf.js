const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

async function testPdfGeneration() {
  const project = {
    id: "PRJ-2024-100",
    title: "Warehouse Development Phase I",
    client: "srs Enterprises",
    status: "Pending Approval",
    budget: "₹1.24 Cr",
    location: "Gujarat, India",
    startDate: "2024-02-25",
    progress: "0%",
    summary: "Comprehensive warehouse development for srs Enterprises."
  };

  const AMBER = '#F59E0B';
  const DARK = '#050A14';
  const SLATE = '#334155';
  const LIGHT = '#64748B';
  const WHITE = '#FFFFFF';
  const LINE = '#E2E8F0';
  const GREEN = '#10B981';
  const BLUE = '#3B82F6';
  const M = 50;
  const PW = 595.28 - M * 2;

  console.log("Starting PDF generation...");
  
  try {
    const doc = new PDFDocument({ size: 'A4', margin: M });
    const output = fs.createWriteStream('test-output.pdf');
    doc.pipe(output);

    // Header
    doc.rect(0, 0, 595.28, 6).fill(AMBER);
    doc.fontSize(16).fillColor(DARK).text('DYNAMICS GLOBAL', M, 18);
    
    // Page label
    doc.rect(M, 55, 160, 18).fill(AMBER);
    doc.fontSize(8).fillColor(DARK).text('PAGE 1 - CLIENT INFORMATION', M + 6, 59);

    // Body
    doc.fontSize(22).fillColor(DARK).text('PROJECT AGREEMENT', M, 96, { align: 'center' });
    
    doc.end();
    
    output.on('finish', () => {
      console.log("PDF generated successfully: test-output.pdf");
      process.exit(0);
    });
  } catch (err) {
    console.error("PDF Generation FAILED:", err);
    process.exit(1);
  }
}

testPdfGeneration();
