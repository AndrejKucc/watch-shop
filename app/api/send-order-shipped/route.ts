import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = body.orderId;

    if (!orderId) {
      return NextResponse.json(
        { error: "Nedostaje ID porudžbine." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
        id,
        customer_name,
        email,
        address,
        settlement,
        city,
        postal_code,
        total
      `
      )
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("Greška pri čitanju porudžbine:", orderError);

      return NextResponse.json(
        { error: "Porudžbina nije pronađena." },
        { status: 404 }
      );
    }

    if (!order.email) {
      return NextResponse.json(
        { error: "Porudžbina nema email adresu kupca." },
        { status: 400 }
      );
    }

    const addressLine = [
      order.address,
      order.settlement,
      order.city,
      order.postal_code,
    ]
      .filter(Boolean)
      .join(", ");

    const html = `
      <div style="margin:0;padding:40px 20px;background:#f5f5f5;font-family:Arial,sans-serif;color:#111;">
        <div style="max-width:650px;margin:0 auto;background:#ffffff;padding:40px;border-radius:20px;">

          <div style="margin-bottom:32px;">
            <div style="font-size:24px;font-weight:700;letter-spacing:3px;">
              WATCH SHOP
            </div>
            <div style="margin-top:6px;color:#777;font-size:13px;">
              Premium satovi
            </div>
          </div>

          <h1 style="font-size:26px;margin:0 0 12px;">
            Vaša porudžbina je poslata
          </h1>

          <p style="font-size:15px;line-height:1.6;color:#555;">
            Zdravo ${order.customer_name}, obaveštavamo vas da je vaša
            porudžbina poslata.
          </p>

          <div style="margin:30px 0;padding:20px;background:#f7f7f7;border-radius:14px;">
            <div style="font-size:13px;color:#777;margin-bottom:6px;">
              Broj porudžbine
            </div>

            <div style="font-size:16px;font-weight:700;">
              ${order.id}
            </div>
          </div>

          <div style="margin:30px 0;padding:24px;background:#111;color:#fff;border-radius:16px;text-align:center;">
            <div style="font-size:13px;color:#aaa;">
              STATUS PORUDŽBINE
            </div>

            <div style="font-size:22px;font-weight:700;margin-top:8px;">
              POSLATA
            </div>
          </div>

          <h2 style="font-size:18px;margin:35px 0 12px;">
            Dostava
          </h2>

          <p style="font-size:14px;line-height:1.7;color:#555;">
            ${addressLine}
          </p>

          <p style="font-size:14px;line-height:1.7;color:#555;">
            Ukupan iznos: <strong>${Number(order.total).toFixed(2)} €</strong>
          </p>

          <p style="font-size:14px;line-height:1.7;color:#555;">
            Način plaćanja: Plaćanje pouzećem
          </p>

          <div style="margin-top:35px;padding-top:25px;border-top:1px solid #e5e5e5;">
            <p style="font-size:13px;color:#888;line-height:1.6;margin:0;">
              Hvala vam na poverenju i kupovini u WATCH SHOP-u.
            </p>
          </div>

        </div>
      </div>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [order.email],
        subject: `WATCH SHOP — porudžbina ${order.id} je poslata`,
        html,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend greška:", resendData);

      return NextResponse.json(
        { error: "Email nije uspešno poslat." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailId: resendData.id,
    });
  } catch (error) {
    console.error("Greška pri slanju emaila:", error);

    return NextResponse.json(
      { error: "Došlo je do greške pri slanju emaila." },
      { status: 500 }
    );
  }
}