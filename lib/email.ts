import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: process.env.AUTH_EMAIL_FROM || "DocUnsend <onboarding@resend.dev>",
      to,
      subject: "Welcome to DocUnsend — All Premium Features, Zero Cost 🚀",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 28px; font-weight: 700; color: #0f172a; margin-bottom: 24px;">
            Hey ${name || "there"}, welcome aboard! 👋
          </h1>
          <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 16px;">
            You just unlocked what others pay for. DocUnsend gives you <strong>every premium feature</strong> that DocSend charges for — scheduling, analytics, device locks, passcodes, custom domains — completely free.
          </p>
          <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
            No trials. No credit cards. No "upgrade to unlock" nonsense.
          </p>
          <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Start Sending →
          </a>
          <p style="font-size: 14px; color: #94a3b8; margin-top: 32px;">
            Made with spite for overpriced SaaS.<br/>
            — The DocUnsend Team
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

export async function sendTransferNotification(
  to: string,
  senderName: string,
  transferTitle: string,
  accessLink: string
) {
  try {
    await resend.emails.send({
      from: process.env.AUTH_EMAIL_FROM || "DocUnsend <onboarding@resend.dev>",
      to,
      subject: `${senderName} shared "${transferTitle}" with you`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">
            ${senderName} shared something with you
          </h1>
          <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p style="font-size: 18px; font-weight: 600; color: #1e293b; margin: 0 0 8px 0;">
              ${transferTitle}
            </p>
            <p style="font-size: 14px; color: #64748b; margin: 0;">
              Click below to view securely
            </p>
          </div>
          <a href="${accessLink}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px;">
            View Transfer →
          </a>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">
            Sent via DocUnsend — premium file sharing, actually free.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send transfer notification:", error);
  }
}
