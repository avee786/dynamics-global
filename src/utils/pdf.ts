import PDFDocument from 'pdfkit';

export async function buildProjectContract(project: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // --- Header: Dynamics Global Logo (Programmatic) ---
      doc.fillColor('#F59E0B') // Amber/Gold color
         .fontSize(32)
         .font('Helvetica-Bold')
         .text('DG', { align: 'center' });

      doc.fillColor('#020617') // Very dark blue/black
         .fontSize(24)
         .font('Helvetica-Bold')
         .text('Dynamics Global', { align: 'center' });
      
      doc.fillColor('#64748B')
         .fontSize(10)
         .font('Helvetica')
         .text('INDUSTRIAL LOGISTICS INTERFACE • RAJASTHAN HQ', { align: 'center', characterSpacing: 2 });

      doc.moveDown(2);

      // --- Title ---
      doc.fillColor('#000000')
         .fontSize(20)
         .font('Helvetica-Bold')
         .text('PROJECT AGREEMENT', { align: 'center', underline: true });
      
      doc.moveDown(2);

      // --- Client Details Box ---
      const startX = 50;
      let currentY = doc.y;
      
      doc.rect(startX, currentY, 495, 100).stroke('#E2E8F0');
      
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#334155').text('PARTY A: AUTHORIZED CLIENT', startX + 15, currentY + 15);
      
      doc.fontSize(10)
         .font('Helvetica-Bold').fillColor('#000000').text('Client Entity: ', startX + 15, currentY + 40)
         .font('Helvetica').text(project.companyName || 'N/A', startX + 100, currentY + 40);
      
      doc.font('Helvetica-Bold').text('Representative: ', startX + 15, currentY + 55)
         .font('Helvetica').text(project.clientName || project.primaryContact || 'N/A', startX + 100, currentY + 55);
      
      doc.font('Helvetica-Bold').text('Contact Email: ', startX + 15, currentY + 70)
         .font('Helvetica').text(project.email || project.corporateEmail || 'N/A', startX + 100, currentY + 70);

      doc.moveDown(4);

      // --- Project Details ---
      currentY = doc.y;
      doc.rect(startX, currentY, 495, 120).stroke('#E2E8F0');

      doc.fontSize(12).font('Helvetica-Bold').fillColor('#334155').text('PROJECT ASSIGNMENT SCOPE', startX + 15, currentY + 15);
      
      const pType = project.projectType || project.industry || 'General Operations';
      const budgetLog = project.budget || project.budgetRange || 'TBD';
      const locationLog = project.location || project.siteLocation || 'GLOBAL HQ';
      const currStatus = project.status || 'Pending Verification';

      doc.fontSize(10)
         .font('Helvetica-Bold').fillColor('#000000').text('Operational Class: ', startX + 15, currentY + 40)
         .font('Helvetica').text(pType.toUpperCase(), startX + 120, currentY + 40);

      doc.font('Helvetica-Bold').text('Deployment Hub: ', startX + 15, currentY + 55)
         .font('Helvetica').text(locationLog.toUpperCase(), startX + 120, currentY + 55);

      doc.font('Helvetica-Bold').text('Financial LTSC: ', startX + 15, currentY + 70)
         .font('Helvetica').text(budgetLog, startX + 120, currentY + 70);

      doc.font('Helvetica-Bold').text('Current Status: ', startX + 15, currentY + 85)
         .font('Helvetica').fillColor(currStatus === 'Completed' ? '#10B981' : currStatus === 'Ongoing' ? '#F59E0B' : '#3B82F6').text(currStatus.toUpperCase(), startX + 120, currentY + 85);

      doc.moveDown(4);

      // --- Terms & Conditions ---
      doc.fillColor('#000000').fontSize(14).font('Helvetica-Bold').text('Terms and Conditions of Operation');
      doc.moveDown(0.5);
      doc.fontSize(9).font('Helvetica').fillColor('#475569')
         .text(
           '1. All operations are strictly governed by Dynamics Global Central Protocols.\n' +
           '2. This digital document constitutes a formal agreement between the Entity and Dynamics Global Headquarters.\n' +
           '3. LTSC budgets are binding and subject to quarterly assessments by the core finance division.\n' +
           '4. Data transmitted through this secure gateway is fully encrypted per AES-256 standard and logged.'
         );
      
      doc.moveDown(3);

      // --- Auth Signatures ---
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000');
      
      const sigY = doc.y;
      doc.text('_____________________________', 50, sigY);
      doc.text('AUTHORIZED BY (DYNAMICS HQ)', 50, sigY + 15);
      
      doc.text('_____________________________', 350, sigY);
      doc.text('ACCEPTED BY (CLIENT REP)', 350, sigY + 15);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
