import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const { name, email, subject, message } = await req.json() as {
            name: string;
            email: string;
            subject: string;
            message: string;
        };

        if (!message?.trim() || !email?.trim()) {
            return NextResponse.json({ error: "Email and message are required." }, { status: 400 });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
        }

        // Save to Supabase
        const { error: dbError } = await supabase.from("contact_messages").insert({
            name,
            email,
            subject,
            message,
        });

        if (dbError) {
            console.error("Supabase insert error:", dbError);
            return NextResponse.json({ error: "Failed to save message." }, { status: 500 });
        }

        // Send email notification via Resend
        await resend.emails.send({
            from: "The Gazette <onboarding@resend.dev>",
            to: "itsyashparikh@gmail.com",
            subject: `New Letter: ${subject || "No subject"} — from ${name || "Anonymous"}`,
            html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f5f0e8; color: #1a1008;">
          <div style="border-top: 4px solid #0D0D0D; padding-top: 16px; margin-bottom: 24px;">
            <p style="font-family: monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #6b6b6b; margin: 0;">
              The Developer's Gazette — Letters to the Editor
            </p>
          </div>

          <h1 style="font-size: 28px; font-weight: 900; margin: 0 0 8px 0; line-height: 1.1;">
            New Letter Received
          </h1>
          <p style="font-style: italic; color: #3a3a3a; margin: 0 0 24px 0;">
            ${subject || "No subject"}
          </p>

          <div style="border-top: 1px solid #0D0D0D; border-bottom: 1px solid #0D0D0D; padding: 16px 0; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b6b6b; padding: 6px 0; width: 80px;">From</td>
                <td style="font-family: monospace; font-size: 11px; color: #0D0D0D; padding: 6px 0;">${name || "Anonymous"}</td>
              </tr>
              <tr>
                <td style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b6b6b; padding: 6px 0;">Email</td>
                <td style="font-family: monospace; font-size: 11px; color: #0D0D0D; padding: 6px 0;">${email}</td>
              </tr>
              <tr>
                <td style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b6b6b; padding: 6px 0;">Subject</td>
                <td style="font-family: monospace; font-size: 11px; color: #0D0D0D; padding: 6px 0;">${subject || "—"}</td>
              </tr>
            </table>
          </div>

          <div style="background: #e8e0cc; padding: 20px; border-left: 4px solid #0D0D0D; margin-bottom: 24px;">
            <p style="margin: 0; line-height: 1.8; color: #1a1a1a; font-size: 15px;">
              ${message.replace(/\n/g, "<br/>")}
            </p>
          </div>

          <div style="border-top: 1px solid #0D0D0D; padding-top: 16px;">
            <p style="font-family: monospace; font-size: 10px; color: #6b6b6b; margin: 0;">
              Reply directly to: ${email}
            </p>
            <p style="font-family: monospace; font-size: 10px; color: #6b6b6b; margin: 4px 0 0 0;">
              The Developer's Gazette · portfolio-d4qi.vercel.app
            </p>
          </div>
        </div>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Contact API error:", err);
        return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
    }
}