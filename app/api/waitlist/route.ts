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

    // 2. Send notification email to yourself with the signup details
    //    Using onboarding@resend.dev until a custom domain is verified
    if (process.env.NOTIFY_EMAIL) {
      const { error: sendError } = await resend.emails.send({
        from: "Artemis Waitlist <onboarding@resend.dev>",
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
