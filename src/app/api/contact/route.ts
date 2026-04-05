import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, company, phone, service, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Configure the transporter
    // Note: These env variables must be set in .env.local
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // This should be an App Password
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL_RECEIVER || 'globaldaynamics@gmail.com',
      replyTo: email,
      subject: `New Contact Form Submission from ${name} (${company || 'N/A'})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">New Message Received</h2>
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Area of Interest:</strong> ${service || 'General Inquiry'}</p>
          <div style="margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 5px;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 10px; color: #9ca3af; margin-top: 30px; text-align: center;">Authorized Transmission · Dynamics Global HQ</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('>>> [MAIL] Message sent: %s', info.messageId);

    return NextResponse.json({ success: true, message: 'Message transmitted successfully' });
  } catch (error: any) {
    console.error('>>> [MAIL] Error sending email:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
