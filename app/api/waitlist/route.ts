import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, company, role, robotType, useCase, fleetSize, message, updates } = body;

    if (!firstName || !email || !role || !robotType || !useCase) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Add contact to Resend Audience (if RESEND_AUDIENCE_ID is set)
    if (process.env.RESEND_AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        firstName,
        lastName,
        unsubscribed: !updates,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });
    }

    // 2. Send confirmation email to the user
    await resend.emails.send({
      from: "Artemis <waitlist@art3mis.app>",
      to: email,
      subject: "You're on the Artemis waitlist 🤖",
      html: `
        <div style="background:#000;color:#fff;font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:40px 32px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
            <div style="height:24px;width:24px;background:#22d3ee;border-radius:4px;"></div>
            <span style="font-size:18px;font-weight:600;">Artemis</span>
          </div>
          <h1 style="font-size:28px;font-weight:400;margin:0 0 12px;">You're on the list, ${firstName}.</h1>
          <p style="color:#71717a;font-size:15px;line-height:1.6;margin:0 0 32px;">
            Thanks for applying for early access. We're onboarding teams in waves and will reach out as soon as your spot opens up — usually within 3–5 days.
          </p>
          <div style="border:1px solid #27272a;border-radius:10px;padding:24px;margin-bottom:32px;">
            <p style="color:#a1a1aa;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 16px;">Your application</p>
            <table style="width:100%;border-collapse:collapse;">
              ${([
                ["Role", role],
                ["Robot type", robotType],
                ["Use case", useCase],
                ...(company ? [["Company", company]] : []),
                ...(fleetSize ? [["Fleet size", fleetSize]] : []),
              ] as [string, string][]).map(([label, value]) => `
                <tr>
                  <td style="color:#71717a;font-size:13px;padding:6px 0;width:120px;">${label}</td>
                  <td style="color:#fff;font-size:13px;padding:6px 0;">${value}</td>
                </tr>`).join("")}
            </table>
          </div>
          <p style="color:#52525b;font-size:13px;line-height:1.6;margin:0 0 8px;">
            In the meantime, explore our <a href="https://art3mis.app/docs" style="color:#22d3ee;text-decoration:none;">documentation</a> to get familiar with the platform.
          </p>
          <p style="color:#3f3f46;font-size:12px;margin:32px 0 0;">
            You're receiving this because you signed up at art3mis.app.
          </p>
        </div>
      `,
    });

    // 3. Send notification email to yourself with the signup details
    if (process.env.NOTIFY_EMAIL) {
      const { error: sendError } = await resend.emails.send({
        from: "Artemis Waitlist <waitlist@art3mis.app>",
        to: process.env.NOTIFY_EMAIL,
        subject: `New waitlist signup: ${firstName} ${lastName} — ${company || role}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:500px;padding:24px;">
            <h2 style="margin:0 0 16px;">New waitlist signup</h2>
            <table style="border-collapse:collapse;width:100%;">
              ${[
                ["Name", `${firstName} ${lastName}`],
                ["Email", email],
                ["Company", company || "—"],
                ["Role", role],
                ["Robot type", robotType],
                ["Use case", useCase],
                ["Fleet size", fleetSize || "—"],
                ["Message", message || "—"],
                ["Updates opt-in", updates ? "Yes" : "No"],
              ]
                .map(
                  ([label, value]) => `
                <tr>
                  <td style="padding:8px;border:1px solid #e4e4e7;color:#71717a;font-size:13px;white-space:nowrap;">${label}</td>
                  <td style="padding:8px;border:1px solid #e4e4e7;font-size:13px;">${value}</td>
                </tr>`
                )
                .join("")}
            </table>
          </div>
        `,
      });
      if (sendError) console.error("Resend notification error:", sendError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
