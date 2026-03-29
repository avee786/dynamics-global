import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

// Brand colours
const AMBER  = '#F59E0B';
const DARK   = '#050A14';
const SLATE  = '#334155';
const LIGHT  = '#64748B';
const WHITE  = '#FFFFFF';
const LINE   = '#E2E8F0';
const GREEN  = '#10B981';
const BLUE   = '#3B82F6';

const M       = 50;                   // margin
const PW      = 595.28 - M * 2;      // printable width
function drawPageHeader(doc: PDFKit.PDFDocument, pageLabel: string, docRef: string) {
  const logoPath = path.join(process.cwd(), 'public', 'logo.png');

  // Top amber bar
  doc.rect(0, 0, 595.28, 6).fill(AMBER);

  // Logo (top-right) with extreme safety
  let logoPlaced = false;
  try {
     if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 595.28 - M - 120, 18, { width: 120, height: 36 });
        logoPlaced = true;
     }
  } catch (e) {
     console.warn(">>> [PDF GEN] Logo placement failed:", e);
  }

  if (!logoPlaced) {
    // Fallback text logo
    doc.fontSize(18).font('Helvetica-Bold').fillColor(AMBER).text('DG', 595.28 - M - 50, 18);
    doc.fontSize(11).font('Helvetica-Bold').fillColor(DARK).text('DYNAMICS GLOBAL', 595.28 - M - 130, 20);
  }

  // Company info (top-left)
  doc.fontSize(16).font('Helvetica-Bold').fillColor(DARK).text('DYNAMICS GLOBAL', M, 18);
  doc.fontSize(8).font('Helvetica').fillColor(LIGHT)
     .text('Industrial Logistics Interface  •  Rajasthan HQ, India', M, 38);

  // Page label pill
  doc.rect(M, 55, 160, 18).fill(AMBER);
  doc.fontSize(8).font('Helvetica-Bold').fillColor(DARK)
     .text(pageLabel.toUpperCase(), M + 6, 59, { width: 148 });

  // Doc ref right-aligned
  doc.fontSize(7.5).font('Helvetica').fillColor(LIGHT)
     .text(`Ref: ${docRef}`, M, 59, { width: PW, align: 'right' });

  // Divider
  doc.moveTo(M, 80).lineTo(M + PW, 80).lineWidth(0.5).strokeColor(LINE).stroke();
}

function drawPageFooter(doc: PDFKit.PDFDocument, page: number, total: number) {
  const y = 841.89 - 36;
  doc.moveTo(M, y).lineTo(M + PW, y).lineWidth(0.5).strokeColor(LINE).stroke();
  doc.fontSize(7.5).font('Helvetica').fillColor(LIGHT)
     .text('CONFIDENTIAL — Dynamics Global Operations Group © 2026', M, y + 6, { width: PW / 2 });
  doc.fontSize(7.5).font('Helvetica').fillColor(LIGHT)
     .text(`Page ${page} of ${total}`, M, y + 6, { width: PW, align: 'right' });
}

function sectionTitle(doc: PDFKit.PDFDocument, title: string, y: number) {
  doc.rect(M, y, PW, 22).fill('#F8FAFC');
  doc.rect(M, y, 4, 22).fill(AMBER);
  doc.fontSize(10).font('Helvetica-Bold').fillColor(SLATE)
     .text(title.toUpperCase(), M + 12, y + 6, { width: PW - 20 });
  return y + 30;
}

function labelValue(doc: PDFKit.PDFDocument, label: string, value: string, x: number, y: number, valColor = DARK) {
  doc.fontSize(8).font('Helvetica-Bold').fillColor(LIGHT).text(label, x, y);
  doc.fontSize(9.5).font('Helvetica-Bold').fillColor(valColor).text(value || 'N/A', x, y + 12, { width: 200 });
}

function infoGrid(doc: PDFKit.PDFDocument, items: { label: string; value: string; color?: string }[], startY: number) {
  const cols = 2;
  const colW = PW / cols;
  let row = 0, col = 0;
  items.forEach((item) => {
    const x = M + col * colW;
    const y = startY + row * 48;
    labelValue(doc, item.label, item.value, x, y, item.color);
    col++;
    if (col >= cols) { col = 0; row++; }
  });
  return startY + Math.ceil(items.length / cols) * 48;
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export async function buildProjectContract(project: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: M,
        bufferPages: true,    // lets us write footers after the fact
        info: {
          Title: 'Project Agreement — Dynamics Global',
          Author: 'Dynamics Global Operations',
        }
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (error) => reject(error));

      // Convenience fields
      const pType    = (project.projectType  || project.industry   || 'General Operations').toUpperCase();
      const budget   = project.budget || project.budgetRange || 'TBD';
      const location = project.location || project.siteLocation   || 'Rajasthan, India';
      const status   = project.status   || 'Pending';
      const company  = project.companyName   || project.company     || 'N/A';
      const contact  = project.clientName    || project.primaryContact || 'N/A';
      const email    = project.email         || project.corporateEmail || 'N/A';
      const phone    = project.phone         || 'N/A';
      const desc     = project.summary       || project.description    || 'Full-scope industrial engagement as per the agreed service brief.';
      const docRef   = `DG-${String(project._id || 'DRAFT').slice(-8).toUpperCase()}-2026`;
      const today    = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
      const statusColor = status === 'Completed' ? GREEN : status === 'Ongoing' ? AMBER : BLUE;

      /* ══════════════════════════════════════
         PAGE 1 — CLIENT & PROJECT INFORMATION
      ══════════════════════════════════════ */
      drawPageHeader(doc, 'Page 1 — Client & Project Information', docRef);

      // Document title block
      doc.fontSize(22).font('Helvetica-Bold').fillColor(DARK)
         .text('PROJECT AGREEMENT', M, 96, { width: PW, align: 'center' });
      doc.fontSize(9).font('Helvetica').fillColor(LIGHT)
         .text(`Issued: ${today}  •  Status: ${status}`, M, 122, { width: PW, align: 'center' });

      // Status badge
      const badgeW = 100, badgeX = (595.28 - badgeW) / 2;
      doc.rect(badgeX, 136, badgeW, 16).fill(statusColor);
      doc.fontSize(7.5).font('Helvetica-Bold').fillColor(WHITE)
         .text(status.toUpperCase(), badgeX, 140, { width: badgeW, align: 'center' });

      // Thin divider
      doc.moveTo(M, 162).lineTo(M + PW, 162).lineWidth(1).strokeColor(AMBER).stroke();

      let y = 174;

      // ── CLIENT INFORMATION ──
      y = sectionTitle(doc, '01  Client Information', y);

      y = infoGrid(doc, [
        { label: 'Company / Entity Name', value: company },
        { label: 'Primary Representative', value: contact },
        { label: 'Email Address', value: email },
        { label: 'Phone Number', value: phone },
        { label: 'Registered Location', value: location },
        { label: 'Document Reference', value: docRef },
      ], y);

      y += 8;
      y = sectionTitle(doc, '02  Project Scope & Details', y);

      y = infoGrid(doc, [
        { label: 'Service / Project Type', value: pType },
        { label: 'Operational Hub', value: location },
        { label: 'Contract Budget (LTSC)', value: budget },
        { label: 'Current Status', value: status, color: statusColor },
      ], y);

      // Description block
      doc.rect(M, y, PW, 1).fill(LINE);
      y += 8;
      doc.fontSize(8).font('Helvetica-Bold').fillColor(LIGHT).text('PROJECT DESCRIPTION', M, y);
      y += 14;
      doc.fontSize(9.5).font('Helvetica').fillColor(SLATE)
         .text(desc, M, y, { width: PW, lineGap: 3 });
      y = doc.y + 16;

      // ── Dynamics Global Party Info ──
      y = sectionTitle(doc, '03  Service Provider Details', y);
      y = infoGrid(doc, [
        { label: 'Organisation', value: 'Dynamics Global Operations Group' },
        { label: 'Headquarters', value: 'Rajasthan, India' },
        { label: 'Contact Email', value: 'info@dynamicsglobal.in' },
        { label: 'Certification', value: 'ISO 9001:2015 — Grade-A Safety Standards' },
      ], y);

      drawPageFooter(doc, 1, 3);

      /* ══════════════════════════════════════
         PAGE 2 — AGREEMENT & TERMS
      ══════════════════════════════════════ */
      doc.addPage();
      drawPageHeader(doc, 'Page 2 — Agreement & Terms and Conditions', docRef);

      y = 94;
      doc.fontSize(18).font('Helvetica-Bold').fillColor(DARK)
         .text('TERMS AND CONDITIONS OF ENGAGEMENT', M, y, { width: PW, align: 'center' });
      doc.moveTo(M, y + 28).lineTo(M + PW, y + 28).lineWidth(1).strokeColor(AMBER).stroke();
      y += 42;

      const terms = [
        {
          title: '1. Scope of Engagement',
          body: 'This agreement defines the operational scope between the Client Entity and Dynamics Global Operations Group. All deliverables, timelines, and financial commitments are bound by this document unless a written addendum is issued by Dynamics Global HQ.'
        },
        {
          title: '2. Financial Terms & Budget Authority',
          body: `The agreed contract value of ${budget} is fixed for the initial engagement phase. Any scope changes that impact cost must be approved in writing by both parties. Payments are due within 15 business days of each milestone invoice.`
        },
        {
          title: '3. Confidentiality & Data Protection',
          body: 'All project data, client information, site locations, and financial details shared between parties are strictly confidential. Transmission of sensitive data is encrypted under AES-256 protocol. Neither party may disclose project details to third parties without written consent.'
        },
        {
          title: '4. Operational Protocols & Safety Standards',
          body: 'All field operations are conducted per Dynamics Global Central Safety Protocols (ISO 9001:2015) and applicable Indian/international industrial regulations. On-site supervisors hold Grade-A operational certification.'
        },
        {
          title: '5. Force Majeure',
          body: 'Neither party shall be held liable for delays or non-performance caused by circumstances beyond reasonable control including natural disasters, government orders, pandemics, or civil unrest. Notice must be provided within 72 hours of such event.'
        },
        {
          title: '6. Dispute Resolution',
          body: 'Any disputes arising from this agreement shall first be resolved through mutual negotiation. If unresolved within 30 days, disputes shall be referred to arbitration under the Arbitration and Conciliation Act, 1996, with jurisdiction in Rajasthan, India.'
        },
        {
          title: '7. Intellectual Property',
          body: 'All methodologies, designs, reports, and technical documents produced by Dynamics Global remain the intellectual property of Dynamics Global unless explicitly transferred in writing to the Client.'
        },
        {
          title: '8. Governing Law',
          body: 'This agreement shall be governed by and construed in accordance with the laws of India. Any legal proceedings shall be subject to the exclusive jurisdiction of courts in Rajasthan, India.'
        },
        {
          title: '9. Amendments',
          body: 'No amendment or modification of this agreement shall be valid unless made in writing and signed by authorised representatives of both parties.'
        },
        {
          title: '10. Entire Agreement',
          body: 'This document constitutes the entire agreement between the parties with respect to its subject matter and supersedes all prior negotiations, representations, or agreements, whether written or oral.'
        },
      ];

      terms.forEach((t) => {
        if (y > 750) {
          drawPageFooter(doc, 2, 3);
          doc.addPage();
          drawPageHeader(doc, 'Page 2 (continued) — Terms and Conditions', docRef);
          y = 94;
        }
        doc.fontSize(9.5).font('Helvetica-Bold').fillColor(DARK).text(t.title, M, y, { width: PW });
        y = doc.y + 3;
        doc.fontSize(9).font('Helvetica').fillColor(SLATE).text(t.body, M, y, { width: PW, lineGap: 2 });
        y = doc.y + 12;
      });

      drawPageFooter(doc, 2, 3);

      /* ══════════════════════════════════════
         PAGE 3 — PAYMENT & SIGNATURES
      ══════════════════════════════════════ */
      doc.addPage();
      drawPageHeader(doc, 'Page 3 — Payment Details & Authorisation', docRef);

      y = 94;
      doc.fontSize(18).font('Helvetica-Bold').fillColor(DARK)
         .text('PAYMENT DETAILS & AUTHORISATION', M, y, { width: PW, align: 'center' });
      doc.moveTo(M, y + 28).lineTo(M + PW, y + 28).lineWidth(1).strokeColor(AMBER).stroke();
      y += 44;

      // ── Payment Schedule ──
      y = sectionTitle(doc, '01  Contract Financial Summary', y);

      // Table header
      const tableX = M, colWs = [PW * 0.45, PW * 0.25, PW * 0.30];
      doc.rect(tableX, y, PW, 22).fill(DARK);
      ['Milestone / Description', 'Amount', 'Status'].forEach((h, i) => {
        doc.fontSize(8.5).font('Helvetica-Bold').fillColor(WHITE)
           .text(h, tableX + colWs.slice(0, i).reduce((a, b) => a + b, 0) + 6, y + 6, { width: colWs[i] - 8 });
      });
      y += 22;

      const milestones = (project.milestones && Array.isArray(project.milestones))
        ? project.milestones
        : [
          { desc: 'Project Initiation & Mobilisation (30%)', pct: '30%', status: 'Due on Signing' },
          { desc: 'Mid-Phase Completion (40%)',               pct: '40%', status: 'Due at Milestone' },
          { desc: 'Final Delivery & Handover (30%)',          pct: '30%', status: 'Due on Completion' },
        ];

      const totalAmt = budget;
      milestones.forEach((m: any, idx: number) => {
        const rowBg = idx % 2 === 0 ? WHITE : '#F8FAFC';
        doc.rect(tableX, y, PW, 24).fill(rowBg).stroke(LINE);
        doc.fontSize(9).font('Helvetica').fillColor(SLATE)
           .text(m.desc, tableX + 6, y + 7, { width: colWs[0] - 8 });
        doc.text(m.pct, tableX + colWs[0] + 6, y + 7, { width: colWs[1] - 8 });
        doc.fillColor(BLUE).text(m.status, tableX + colWs[0] + colWs[1] + 6, y + 7, { width: colWs[2] - 8 });
        y += 24;
      });

      // Total row
      doc.rect(tableX, y, PW, 26).fill('#FEF3C7').stroke(AMBER);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(DARK)
         .text('TOTAL CONTRACT VALUE', tableX + 6, y + 7, { width: colWs[0] - 8 });
      doc.fillColor(AMBER).text(totalAmt, tableX + colWs[0] + 6, y + 7, { width: colWs[1] - 8 });
      doc.fillColor(statusColor).text(status, tableX + colWs[0] + colWs[1] + 6, y + 7, { width: colWs[2] - 8 });
      y += 36;

      // ── Payment Instructions ──
      y = sectionTitle(doc, '02  Payment Instructions', y);
      const payDetails = [
        { label: 'Bank Name', value: 'HDFC Bank Ltd' },
        { label: 'Account Name', value: 'Dynamics Global Operations Group' },
        { label: 'Account Type', value: 'Current Account' },
        { label: 'IFSC Code', value: 'HDFC0001234' },
        { label: 'Currency', value: 'INR (Indian Rupee) / USD (International)' },
        { label: 'Payment Reference', value: docRef },
      ];
      y = infoGrid(doc, payDetails, y);
      y += 4;

      doc.rect(M, y, PW, 28).fill('#ECFDF5').stroke('#10B981');
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(GREEN)
         .text('IMPORTANT:', M + 10, y + 8);
      doc.fontSize(8.5).font('Helvetica').fillColor(SLATE)
         .text('Always quote your Document Reference ('+docRef+') when making payments. TDS deductions apply as per applicable statutory rates.', M + 74, y + 8, { width: PW - 84 });
      y += 38;

      // ── Terms Acknowledgement ──
      y = sectionTitle(doc, '03  Declaration & Acknowledgement', y);
      doc.fontSize(9).font('Helvetica').fillColor(SLATE)
         .text(
           'The undersigned parties hereby acknowledge that they have read, understood, and agree to be bound by all the terms and conditions set forth in this Project Agreement. This document is legally binding upon execution by both authorised representatives.',
           M, y, { width: PW, lineGap: 2 }
         );
      y = doc.y + 20;

      // ── Signature Block ──
      y = sectionTitle(doc, '04  Authorised Signatures', y);
      y += 6;

      const sigColW = PW / 2 - 16;

      // Left sig block — DG
      doc.rect(M, y, sigColW, 100).stroke(LINE);
      doc.fontSize(8).font('Helvetica-Bold').fillColor(LIGHT).text('SERVICE PROVIDER', M + 10, y + 10);
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(DARK).text('DYNAMICS GLOBAL', M + 10, y + 24);
      doc.fontSize(8.5).font('Helvetica').fillColor(SLATE).text('Piyush Khatri — Founder & CEO', M + 10, y + 38);
      doc.moveTo(M + 10, y + 72).lineTo(M + sigColW - 10, y + 72).lineWidth(0.5).strokeColor(SLATE).stroke();
      doc.fontSize(7.5).fillColor(LIGHT).text('Signature & Stamp', M + 10, y + 76);
      doc.fontSize(7.5).fillColor(LIGHT).text(`Date: ${today}`, M + 10, y + 87);

      // Right sig block — Client
      const sigRX = M + sigColW + 32;
      doc.rect(sigRX, y, sigColW, 100).stroke(LINE);
      doc.fontSize(8).font('Helvetica-Bold').fillColor(LIGHT).text('CLIENT REPRESENTATIVE', sigRX + 10, y + 10);
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(DARK).text(company, sigRX + 10, y + 24, { width: sigColW - 20 });
      doc.fontSize(8.5).font('Helvetica').fillColor(SLATE).text(contact, sigRX + 10, y + 38);
      doc.moveTo(sigRX + 10, y + 72).lineTo(sigRX + sigColW - 10, y + 72).lineWidth(0.5).strokeColor(SLATE).stroke();
      doc.fontSize(7.5).fillColor(LIGHT).text('Signature & Stamp', sigRX + 10, y + 76);
      doc.fontSize(7.5).fillColor(LIGHT).text('Date: ____________________', sigRX + 10, y + 87);

      y += 114;

      // Seal notice
      doc.rect(M, y, PW, 22).fill('#F8FAFC').stroke(LINE);
      doc.fontSize(8).font('Helvetica-Bold').fillColor(AMBER)
         .text('⚠  This document requires company seal/stamp on both signature blocks to be legally valid.', M + 8, y + 6, { width: PW - 16 });

      drawPageFooter(doc, 3, 3);

      // Flush
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/* ─────────────────────────────────────────────
   SERVER-SIDE PDF GENERATION EXPORT
───────────────────────────────────────────── */
export async function generateProjectPDF(project: any): Promise<Buffer> {
  try {
    // PDFKit's font resolution can fail in standalone Next.js builds
    // Use buildProjectContract which already handles font setup
    const pdfBuffer = await buildProjectContract(project);
    return pdfBuffer;
  } catch (error) {
    console.error('>>> [PDF EXPORT] Error generating PDF:', error);
    // Provide more detailed error info
    if (error instanceof Error) {
      console.error('>>> [PDF EXPORT] Error details:', error.message);
      if (error.message.includes('Helvetica')) {
        console.error('>>> [PDF EXPORT] Font file not found - checking paths:');
        console.error('>>> [PDF EXPORT] CWD:', process.cwd());
        console.error('>>> [PDF EXPORT] node_modules path would be:', path.join(process.cwd(), 'node_modules'));
      }
    }
    throw error;
  }
}
