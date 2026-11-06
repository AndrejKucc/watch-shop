import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const FROM_EMAIL = "WATCH STORE <info@watchstore.rs>";
const SELLER_EMAIL = "kucc.andrej@gmail.com";
const SHIPPING_COST = 480;

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("RESEND ERROR:", data);
    throw new Error("Resend nije uspeo da pošalje email.");
  }

  return data;
}

export async function POST(request: Request) {
  try {
    console.log("CONFIRMATION: ruta pokrenuta");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!supabaseUrl || !supabaseKey || !resendApiKey) {
      console.error("Nedostaju potrebne environment promenljive.");

      return NextResponse.json(
        { error: "Server nije pravilno konfigurisan." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const orderId = body.orderId;
    const emailToken = body.emailToken;

    if (
      typeof orderId !== "string" ||
      typeof emailToken !== "string"
    ) {
      return NextResponse.json(
        { error: "Nedostaje ID porudžbine ili email token." },
        { status: 400 }
      );
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(orderId) || !uuidRegex.test(emailToken)) {
      return NextResponse.json(
        { error: "Neispravan ID porudžbine ili token." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // PROVERA I JEDNOKRATNO TROŠENJE EMAIL TOKENA
    console.log("CONFIRMATION: proveravam email token");

    const { data: tokenData, error: tokenError } = await supabase
      .from("order_email_tokens")
      .update({
        used_at: new Date().toISOString(),
      })
      .eq("token", emailToken)
      .eq("order_id", orderId)
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .select("token")
      .maybeSingle();

    if (tokenError) {
      console.error("GREŠKA PRI PROVERI EMAIL TOKENA:", tokenError);

      return NextResponse.json(
        { error: "Greška pri proveri autorizacije emaila." },
        { status: 500 }
      );
    }

    if (!tokenData) {
      console.warn(
        "CONFIRMATION: nevažeći, istekao ili već iskorišćen token"
      );

      return NextResponse.json(
        {
          error:
            "Token nije važeći, istekao je ili je već iskorišćen.",
        },
        { status: 401 }
      );
    }

    console.log("CONFIRMATION: token prihvaćen");

    // ČITANJE PORUDŽBINE
    console.log("CONFIRMATION: čitam porudžbinu");

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
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
      `)
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

    const orderNumber = order.order_number || order.id;

    // ČITANJE STAVKI PORUDŽBINE
    console.log("CONFIRMATION: čitam stavke");

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        quantity,
        price,
        products (
          name,
          brand,
          model
        )
      `)
      .eq("order_id", orderId);

    if (itemsError) {
      console.error("Greška pri čitanju stavki:", itemsError);

      return NextResponse.json(
        { error: "Stavke porudžbine nisu pronađene." },
        { status: 500 }
      );
    }

    const itemsHtml = (items ?? [])
      .map((item) => {
        const product = Array.isArray(item.products)
          ? item.products[0]
          : item.products;

        const productName =
          product?.name ||
          [product?.brand, product?.model]
            .filter(Boolean)
            .join(" ") ||
          "Proizvod";

        const quantity = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        const subtotal = quantity * price;

        return `
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #e5e5e5;">
              ${escapeHtml(productName)}
            </td>
            <td style="padding:12px 0;text-align:center;border-bottom:1px solid #e5e5e5;">
              ${quantity}
            </td>
            <td style="padding:12px 0;text-align:right;border-bottom:1px solid #e5e5e5;">
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
      .map(escapeHtml)
      .join(", ");

    const customerName = escapeHtml(order.customer_name);
    const customerPhone = escapeHtml(order.phone);
    const customerEmail = escapeHtml(order.email);
    const safeOrderNumber = escapeHtml(orderNumber);

    const paymentMethod = escapeHtml(
      order.payment_method || "Plaćanje pouzećem"
    );

    const orderTotal = Number(order.total || 0);

    if (
      !Number.isFinite(orderTotal) ||
      orderTotal < SHIPPING_COST
    ) {
      throw new Error("Neispravan ukupan iznos porudžbine.");
    }

    const productTotal = orderTotal - SHIPPING_COST;
    const total = orderTotal.toFixed(2);

    const emailWrapper = (content: string) => `
      <div style="margin:0;padding:40px 20px;background:#f5f5f5;font-family:Arial,sans-serif;color:#111;">
        <div style="max-width:650px;margin:0 auto;background:#fff;padding:40px;border-radius:20px;">
          <div style="margin-bottom:32px;">
            <div style="font-size:24px;font-weight:700;letter-spacing:3px;">
              WATCH STORE
            </div>
            <div style="margin-top:6px;color:#777;font-size:13px;">
              Premium satovi
            </div>
          </div>

          ${content}

          <div style="margin-top:35px;padding-top:25px;border-top:1px solid #e5e5e5;">
            <p style="font-size:13px;color:#888;line-height:1.6;margin:0;">
              Ovo je automatski email prodavnice WATCH STORE.
              Za sva pitanja možete nas kontaktirati na info@watchstore.rs.
            </p>
          </div>
        </div>
      </div>
    `;

    const productsTable = `
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
          Iznos proizvoda nakon popusta
        </div>
        <div style="font-size:16px;margin-top:4px;">
          ${productTotal.toFixed(2)} RSD
        </div>

        <div style="font-size:14px;color:#777;margin-top:12px;">
          Dostava
        </div>
        <div style="font-size:16px;margin-top:4px;">
          ${SHIPPING_COST.toFixed(2)} RSD
        </div>

        <div style="font-size:14px;color:#777;margin-top:12px;">
          Ukupno za plaćanje
        </div>
        <div style="font-size:24px;font-weight:700;margin-top:4px;">
          ${total} RSD
        </div>
      </div>
    `;

    // EMAIL KUPCU
    const customerHtml = emailWrapper(`
      <h1 style="font-size:26px;margin:0 0 12px;">
        Porudžbina je primljena
      </h1>

      <p style="font-size:15px;line-height:1.6;color:#555;">
        Zdravo ${customerName}, hvala vam na porudžbini.
        Vaša porudžbina je uspešno primljena i biće obrađena u najkraćem roku.
      </p>

      <div style="margin:30px 0;padding:20px;background:#f7f7f7;border-radius:14px;">
        <div style="font-size:13px;color:#777;margin-bottom:6px;">
          Broj porudžbine
        </div>
        <div style="font-size:16px;font-weight:700;">
          ${safeOrderNumber}
        </div>
      </div>

      <h2 style="font-size:18px;margin:30px 0 12px;">Proizvodi</h2>

      ${productsTable}

      <h2 style="font-size:18px;margin:35px 0 12px;">Dostava</h2>

      <p style="font-size:14px;line-height:1.7;color:#555;">
        ${addressLine}
      </p>

      <p style="font-size:14px;line-height:1.7;color:#555;">
        Telefon: ${customerPhone}
      </p>

      <p style="font-size:14px;line-height:1.7;color:#555;">
        Način plaćanja: ${paymentMethod}
      </p>
    `);

    // EMAIL PRODAVCU
    const sellerHtml = emailWrapper(`
      <h1 style="font-size:26px;margin:0 0 20px;">
        Nova porudžbina!
      </h1>

      <div style="padding:20px;background:#f7f7f7;border-radius:14px;margin-bottom:25px;">
        <div style="font-size:13px;color:#777;margin-bottom:6px;">
          Broj porudžbine
        </div>
        <div style="font-size:16px;font-weight:700;">
          ${safeOrderNumber}
        </div>
      </div>

      <h2 style="font-size:18px;margin:25px 0 12px;">Kupac</h2>

      <p style="font-size:14px;line-height:1.8;color:#555;">
        <strong>Ime:</strong> ${customerName}<br>
        <strong>Telefon:</strong> ${customerPhone}<br>
        <strong>Email:</strong> ${customerEmail}
      </p>

      <h2 style="font-size:18px;margin:30px 0 12px;">Dostava</h2>

      <p style="font-size:14px;line-height:1.8;color:#555;">
        ${addressLine}
      </p>

      <h2 style="font-size:18px;margin:30px 0 12px;">Proizvodi</h2>

      ${productsTable}

      <div style="margin-top:30px;padding:18px;background:#f7f7f7;border-radius:14px;">
        <p style="font-size:14px;line-height:1.7;color:#555;margin:0;">
          Način plaćanja: <strong>${paymentMethod}</strong>
        </p>
      </div>
    `);

    // SLANJE EMAILA KUPCU
    console.log("CONFIRMATION: šaljem email kupcu");

    const customerData = await sendEmail(
      order.email,
      `WATCH STORE — potvrda porudžbine ${orderNumber}`,
      customerHtml
    );

    console.log("CONFIRMATION: email kupcu poslat");

    // SLANJE EMAILA PRODAVCU
    console.log("CONFIRMATION: šaljem email prodavcu");

    let sellerData;

    try {
      sellerData = await sendEmail(
        SELLER_EMAIL,
        `WATCH STORE — NOVA PORUDŽBINA ${orderNumber}`,
        sellerHtml
      );
    } catch (sellerError) {
      console.error(
        "Greška pri slanju emaila prodavcu:",
        sellerError
      );

      return NextResponse.json({
        success: true,
        customerEmailSent: true,
        sellerEmailSent: false,
        warning: "Email kupcu je poslat, ali email prodavcu nije.",
        customerEmailId: customerData.id,
      });
    }

    console.log("CONFIRMATION: oba emaila uspešno poslata");

    return NextResponse.json({
      success: true,
      customerEmailSent: true,
      sellerEmailSent: true,
      customerEmailId: customerData.id,
      sellerEmailId: sellerData.id,
    });

  } catch (error) {
    console.error("CONFIRMATION ERROR:", error);

    return NextResponse.json(
      { error: "Došlo je do greške pri slanju emaila." },
      { status: 500 }
    );
  }
}