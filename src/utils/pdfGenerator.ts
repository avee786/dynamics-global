import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Type augmentation for jsPDF with autoTable
interface UserOptions {
  startY?: number;
  head?: string[][];
  body?: any[][];
  theme?: 'striped' | 'grid' | 'plain';
  headStyles?: any;
  styles?: any;
}

const loadLogoImage = async (): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = '/logo.png';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load logo'));
  });
};

export const generateProfessionalContract = async (project: any) => {
  let logoImg: HTMLImageElement | null = null;
  try {
    logoImg = await loadLogoImage();
  } catch(e) {
    console.warn("Logo failed to load for PDF:", e);
  }

  const doc = new jsPDF() as any; // Cast as any to avoid lastAutoTable issues
  const primaryColor: [number, number, number] = [5, 7, 10]; // #05070a
  const accentColor: [number, number, number] = [245, 158, 11]; // #f59e0b
  const greyColor: [number, number, number] = [100, 116, 139]; // #64748b

  // Helpers
  const addHeader = () => {
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    if (logoImg) {
      doc.addImage(logoImg, 'PNG', 20, 10, 50, 14); // Scaled based on standard navbar aspect
    } else {
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text('DYNAMICS GLOBAL', 20, 25);
    }
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('INDUSTRIAL INFRASTRUCTURE & LOGISTICS PROTOCOL', 20, 32);
    doc.text(`REF: ${project.id} | ${new Date().toLocaleDateString()}`, 190, 25, { align: 'right' });
  };

  const addFooter = (page: number, total: number) => {
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 280, 190, 280);
    doc.setFontSize(8);
    doc.setTextColor(greyColor[0], greyColor[1], greyColor[2]);
    doc.text('© 2026 DYNAMICS GLOBAL INDUSTRIAL OPERATIONS. ALL RIGHTS RESERVED.', 20, 287);
    doc.text(`PAGE ${page} OF ${total}`, 190, 287, { align: 'right' });
  };

  // --- PAGE 1: EXECUTIVE IDENTITY ---
  addHeader();
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(28);
  doc.text('MASTER SERVICE', 20, 70);
  doc.text('AGREEMENT', 20, 85);
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setLineWidth(2);
  doc.line(20, 95, 60, 95);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const intro = `This Master Service Agreement ("Agreement") is entered into by and between DYNAMICS GLOBAL INDUSTRIAL INFRASTRUCTURE ("Provider") and ${project.client || project.companyName || 'N/A'} ("Client") regarding the deployment of specialized operational units.`;
  doc.text(doc.splitTextToSize(intro, 170), 20, 115);

  autoTable(doc, {
    startY: 140,
    head: [['ENTITY CLASSIFICATION', 'DETAILS']],
    body: [
      ['Provider', 'Dynamics Global Industrial'],
      ['Client Entity', project.client || project.companyName || 'N/A'],
      ['Project Title', project.title || 'Tender Evaluation'],
      ['Deployment Hub', project.location || 'Global Hub'],
      ['LTSC Valuation', project.budget || 'Pending Analysis'],
      ['Authorized By', 'CEO - Piyush Khatri']
    ],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: accentColor },
    styles: { fontSize: 10, cellPadding: 5 }
  });

  doc.setFontSize(10);
  doc.text('This document serves as the binding operational protocol for the aforementioned project scale.', 20, doc.lastAutoTable.finalY + 20);
  addFooter(1, 3);

  // --- PAGE 2: OPERATIONAL SCOPE ---
  doc.addPage();
  addHeader();
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(16);
  doc.text('SECTION 02: OPERATIONAL SCOPE', 20, 60);

  doc.setFontSize(10);
  doc.text('MISSION DESCRIPTION:', 20, 75);
  doc.setTextColor(greyColor[0], greyColor[1], greyColor[2]);
  const description = project.summary || project.workDescription || "Scope of work is currently under technical review. Master protocol includes heavy machinery deployment, workforce allocation, and strategic logistical coordination.";
  doc.text(doc.splitTextToSize(description, 170), 20, 85);

  autoTable(doc, {
    startY: 120,
    head: [['MILESTONE PHASE', 'EXPECTED DURATION', 'STATUS']],
    body: [
      ['01. Site Analysis & Feasibility', '4-6 Weeks', 'Verified'],
      ['02. Machinery Deployment (M1)', '8-12 Weeks', 'In Queue'],
      ['03. Operational Commencement', 'Current LTSC', project.status || 'Pending'],
      ['04. Final Handover & Audit', 'Project Completion', 'Planned']
    ],
    theme: 'striped',
    headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255] }
  });

  addFooter(2, 3);

  // --- PAGE 3: COMMERCIALS & LEGAL ---
  doc.addPage();
  addHeader();
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(16);
  doc.text('SECTION 03: COMMERCIALS & TERMS', 20, 60);

  autoTable(doc, {
    startY: 75,
    head: [['COMMERCIAL TERM', 'VALUATION / TYPE']],
    body: [
      ['Total Project Valuation', project.budget || 'LTSC'],
      ['Operational Timeline', project.duration || project.timeline || 'TBD'],
      ['Settlement Structure', project.paymentTerms || 'Milestone Based'],
      ['Currency Protocol', 'INR - Indian Rupee (₹)'],
      ['Security Deposit', '10% of LTSC Valuation']
    ],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: accentColor }
  });

  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('LEGAL INDEMNITY & GOVERNANCE:', 20, doc.lastAutoTable.finalY + 20);
  doc.setFontSize(8);
  doc.setTextColor(greyColor[0], greyColor[1], greyColor[2]);
  const terms = [
    '1. FORCE MAJEURE: Dynamics Global is not liable for delays caused by environmental disasters or geo-political events.',
    '2. TERMINATION: A 90-day corporate notice is required for project halt. 30% exit valuation penalty applies.',
    '3. COMPLIANCE: All operations adhere to ISO 9001:2015 and Safety Grade-A standards.',
    '4. ARBITRATION: Any disputes shall be settled under International Chamber of Commerce (ICC) arbitration rules.'
  ];
  terms.forEach((t, i) => doc.text(t, 20, doc.lastAutoTable.finalY + 35 + (i * 8), { maxWidth: 170 }));

  // Signatures
  doc.line(20, 240, 80, 240);
  doc.text('On behalf of DYNAMICS GLOBAL', 20, 245);
  doc.line(120, 240, 180, 240);
  doc.text(`Authorized Client Representative (${project.client || project.companyName || 'N/A'})`, 120, 245);

  addFooter(3, 3);

  doc.save(`Contract_${project.id || 'OFFICIAL'}.pdf`);
};
