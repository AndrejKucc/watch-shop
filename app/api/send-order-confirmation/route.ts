import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    console.log("CONFIRMATION: ruta pokrenuta");

    const body = await request.json();
    const orderId = body.orderId;

    console.log("CONFIRMATION: orderId postoji:", Boolean(orderId));

    if (!orderId) {
      return NextResponse.json(
        { error: "Nedostaje ID porudžbine." },
        { status: 400 }
      );
    }

    console.log("CONFIRMATION: SUPABASE_URL postoji:", Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL));
    console.log("CONFIRMATION: SUPABASE_SECRET_KEY postoji:", Boolean(process.env.SUPABASE_SECRET_KEY));
    console.log("CONFIRMATION: RESEND_API_KEY postoji:", Boolean(process.env.RESEND_API_KEY));

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    console.log("CONFIRMATION: čitam porudžbinu");

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
        id,
        customer_name,
        phone,
        email,
        address,
        settlement,
        city,
        postal_code,
        payment_method,
        status,
        total,
        created_at
      `
      )
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("CONFIRMATION: greška pri čitanju porudžbine:", orderError);

      return NextResponse.json(
        { error: "Porudžbina nije pronađena." },
        { status: 404 }
      );
    }

    console.log("CONFIRMATION: porudžbina pronađena");
    console.log("CONFIRMATION: email postoji:", Boolean(order.email));

    if (!order.email) {
      return NextResponse.json(
        { error: "Porudžbina nema email adresu kupca." },
        { status: 400 }
      );
    }

    console.log("CONFIRMATION: čitam stavke");

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select(
        `
        quantity,
        price,
        products (
          name,
          brand,
          model
        )
      `
      )
      .eq("order_id", orderId);

    if (itemsError) {
      console.error("CONFIRMATION: greška pri čitanju stavki:", itemsError);

      return NextResponse.json(
        { error: "Stavke porudžbine nisu pronađene." },
        { status: 500 }
      );
    }

    console.log("CONFIRMATION: stavke pronađene:", items?.length ?? 0);

    const itemsHtml = (items ?? [])
      .map((item) => {
        const product = Array.isArray(item.products)
          ? item.products[0]
          : item.products;

        const productName =
          product?.name ||
          [product?.brand, product?.model].filter(Boolean).join(" ") ||
          "Proizvod";

        const quantity = Number(item.quantity);
        const price = Number(item.price);
        const subtotal = quantity * price;

        return `
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #e5e5e5;">
              ${productName}
            </td>
            <td style="padding:12px 0;border-bottom:1px solid #e5e5e5;text-align:center;">
              ${quantity}
            </td>
            <td style="padding:12px 0;border-bottom:1px solid #e5e5e5;text-align:right;">
              ${subtotal.toFixed(2)} RSD
            </td>
          </tr>
        `;
      })
      .join("");

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
            Porudžbina je primljena
          </h1>

          <p style="font-size:15px;line-height:1.6;color:#555;">
            Zdravo ${order.customer_name}, hvala vam na porudžbini.
            Vaša porudžbina je uspešno primljena i biće obrađena u najkraćem roku.
          </p>

          <div style="margin:30px 0;padding:20px;background:#f7f7f7;border-radius:14px;">
            <div style="font-size:13px;color:#777;margin-bottom:6px;">
              Broj porudžbine
            </div>
            <div style="font-size:16px;font-weight:700;">
              ${order.id}
            </div>
          </div>

          <h2 style="font-size:18px;margin:30px 0 12px;">
            Proizvodi
          </h2>

          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr>
                <th style="padding:10px 0;text-align:left;border-bottom:2px solid #111;">
                  Proizvod
                </th>
                <th style="padding:10px 0;text-align:center;border-bottom:2px solid #111;">
                  Količina
                </th>
                <th style="padding:10px 0;text-align:right;border-bottom:2px solid #111;">
                  Iznos
                </th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="margin-top:24px;padding-top:20px;border-top:2px solid #111;text-align:right;">
            <div style="font-size:14px;color:#777;">
              Ukupno
            </div>
            <div style="font-size:24px;font-weight:700;margin-top:4px;">
              ${Number(order.total).toFixed(2)} RSD
            </div>
          </div>

          <h2 style="font-size:18px;margin:35px 0 12px;">
            Dostava
          </h2>

          <p style="font-size:14px;line-height:1.7;color:#555;">
            ${addressLine}
          </p>

          <p style="font-size:14px;line-height:1.7;color:#555;">
            Telefon: ${order.phone}
          </p>

          <p style="font-size:14px;line-height:1.7;color:#555;">
            Način plaćanja: Plaćanje pouzećem
          </p>

          <div style="margin-top:35px;padding-top:25px;border-top:1px solid #e5e5e5;">
            <p style="font-size:13px;color:#888;line-height:1.6;margin:0;">
              Ovo je automatska potvrda vaše porudžbine.
              Za sva pitanja možete kontaktirati WATCH SHOP.
            </p>
          </div>

        </div>
      </div>
    `;

    console.log("CONFIRMATION: šaljem zahtev Resend-u");

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [order.email],
        subject: `WATCH SHOP — potvrda porudžbine ${order.id}`,
        html,
      }),
    });

    console.log("CONFIRMATION: Resend status:", resendResponse.status);

    const resendData = await resendResponse.json();

    console.log("CONFIRMATION: Resend odgovor primljen");

    if (!resendResponse.ok) {
      console.error("CONFIRMATION: Resend greška:", resendData);

      return NextResponse.json(
        { error: "Email nije uspešno poslat." },
        { status: 500 }
      );
    }

    console.log("CONFIRMATION: email uspešno poslat");

    return NextResponse.json({
      success: true,
      emailId: resendData.id,
    });
  } catch (error) {
    console.error("CONFIRMATION: CAUGHT ERROR:", error);

    return NextResponse.json(
      { error: "Došlo je do greške pri slanju emaila." },
      { status: 500 }
    );
  }
}