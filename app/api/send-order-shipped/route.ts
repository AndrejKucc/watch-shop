import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const FROM_EMAIL = "WATCH STORE <info@watchstore.rs>";

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Podržava oba naziva Supabase secret ključa
    const supabaseSecretKey =
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const resendApiKey = process.env.RESEND_API_KEY;

    // PROVERA SERVERSKE KONFIGURACIJE
    const missingVariables = [
      !supabaseUrl && "NEXT_PUBLIC_SUPABASE_URL",
      !supabaseSecretKey &&
        "SUPABASE_SECRET_KEY ili SUPABASE_SERVICE_ROLE_KEY",
      !supabaseAnonKey && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      !resendApiKey && "RESEND_API_KEY",
    ].filter(Boolean);

    if (missingVariables.length > 0) {
      console.error(
        "NEDOSTAJU VERCEL PROMENLJIVE:",
        missingVariables
      );

      return NextResponse.json(
        {
          error: "Serverska konfiguracija nije ispravna.",
          missing: missingVariables,
        },
        { status: 500 }
      );
    }

    // PROVERA ADMINISTRATORSKE SESIJE
    const cookieStore = await cookies();

    const authSupabase = createServerClient(
      supabaseUrl!,
      supabaseAnonKey!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await authSupabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Morate biti prijavljeni." },
        { status: 401 }
      );
    }

    // PROVERA ADMINISTRATORA
    const { data: admin, error: adminError } = await authSupabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError || !admin) {
      console.error("ADMIN PROVERA:", adminError);

      return NextResponse.json(
        { error: "Nemate dozvolu za ovu akciju." },
        { status: 403 }
      );
    }

    // PROVERA ZAHTEVA
    let body: { orderId?: string };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Neispravan zahtev." },
        { status: 400 }
      );
    }

    const orderId = body.orderId;

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (
      typeof orderId !== "string" ||
      !uuidRegex.test(orderId)
    ) {
      return NextResponse.json(
        { error: "Neispravan ID porudžbine." },
        { status: 400 }
      );
    }

    // PRIVILEGOVANI SUPABASE KLIJENT
    const supabase = createClient(
      supabaseUrl!,
      supabaseSecretKey!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // ČITANJE PORUDŽBINE
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        customer_name,
        email,
        address,
        settlement,
        city,
        postal_code,
        payment_method,
        total,
        status
      `)
      .eq("id", orderId)
      .maybeSingle();

    if (orderError) {
      console.error(
        "GREŠKA PRI ČITANJU PORUDŽBINE:",
        orderError
      );

      return NextResponse.json(
        { error: "Greška pri čitanju porudžbine." },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: "Porudžbina nije pronađena." },
        { status: 404 }
      );
    }

    // PROVERA STATUSA
    if (order.status !== "shipped") {
      return NextResponse.json(
        {
          error:
            "Email se može poslati samo za poslatu porudžbinu.",
        },
        { status: 400 }
      );
    }

    // PROVERA EMAIL ADRESE
    if (
      !order.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email)
    ) {
      return NextResponse.json(
        {
          error:
            "Porudžbina nema validnu email adresu kupca.",
        },
        { status: 400 }
      );
    }

    // ZAŠTITA HTML SADRŽAJA
    const escapeHtml = (value: unknown): string => {
      return String(value ?? "").replace(/[&<>"']/g, (character) => {
        const entities: Record<string, string> = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };

        return entities[character];
      });
    };

    const customerName = escapeHtml(order.customer_name);

    const orderNumber = escapeHtml(
      order.order_number || order.id
    );

    const addressLine = [
      order.address,
      order.settlement,
      order.city,
      order.postal_code,
    ]
      .filter(Boolean)
      .map(escapeHtml)
      .join(", ");

    const total = Number(order.total);

    if (!Number.isFinite(total) || total < 0) {
      return NextResponse.json(
        { error: "Neispravan iznos porudžbine." },
        { status: 400 }
      );
    }

    const paymentMethod =
      order.payment_method === "cash_on_delivery"
        ? "Plaćanje pouzećem"
        : order.payment_method || "Plaćanje pouzećem";

    const safePaymentMethod = escapeHtml(paymentMethod);

    // SADRŽAJ EMAILA
    const html = `
      <div style="margin:0;padding:40px 20px;background:#f5f5f5;font-family:Arial,sans-serif;color:#111;">
        <div style="max-width:650px;margin:0 auto;background:#ffffff;padding:40px;border-radius:20px;">

          <div style="margin-bottom:32px;">
            <div style="font-size:24px;font-weight:700;letter-spacing:3px;">
              WATCH STORE
            </div>

            <div style="margin-top:6px;color:#777;font-size:13px;">
              Premium satovi
            </div>
          </div>

          <h1 style="font-size:26px;margin:0 0 12px;">
            Vaša porudžbina je poslata!
          </h1>

          <p style="font-size:15px;line-height:1.6;color:#555;">
            Zdravo ${customerName}, obaveštavamo vas da je vaša
            porudžbina uspešno poslata.
          </p>

          <div style="margin:30px 0;padding:20px;background:#f7f7f7;border-radius:14px;">
            <div style="font-size:13px;color:#777;margin-bottom:6px;">
              Broj porudžbine
            </div>

            <div style="font-size:16px;font-weight:700;">
              ${orderNumber}
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
            Adresa za dostavu
          </h2>

          <p style="font-size:14px;line-height:1.7;color:#555;">
            ${addressLine}
          </p>

          <div style="margin-top:24px;padding:20px;background:#f7f7f7;border-radius:14px;">

            <p style="font-size:14px;color:#555;margin:0 0 10px;">
              Način plaćanja:
              <strong>${safePaymentMethod}</strong>
            </p>

            <p style="font-size:14px;color:#555;margin:0;">
              Ukupan iznos:
              <strong>${total.toFixed(2)} RSD</strong>
            </p>

          </div>

          <div style="margin-top:35px;padding-top:25px;border-top:1px solid #e5e5e5;">
            <p style="font-size:13px;color:#888;line-height:1.6;margin:0;">
              Hvala vam na poverenju i kupovini u WATCH STORE-u.
              Za sva pitanja možete nas kontaktirati na
              info@watchstore.rs.
            </p>
          </div>

        </div>
      </div>
    `;

    // SLANJE PREKO RESEND-A
    console.log(
      "SHIPPED EMAIL: šaljem email na:",
      order.email
    );

    const resendResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [order.email],
          subject: `WATCH STORE — porudžbina ${
            order.order_number || order.id
          } je poslata`,
          html,
        }),
      }
    );

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error(
        "RESEND GREŠKA PRI SLANJU EMAILA:",
        resendData
      );

      return NextResponse.json(
        {
          error: "Resend nije uspeo da pošalje email.",
          details: resendData,
        },
        { status: 500 }
      );
    }

    console.log(
      "SHIPPED EMAIL: email uspešno prihvaćen od Resend-a:",
      resendData.id
    );

    return NextResponse.json({
      success: true,
      emailId: resendData.id,
      message: "Email o slanju porudžbine je uspešno poslat.",
    });

  } catch (error) {
    console.error(
      "GREŠKA PRI SLANJU EMAILA O SLANJU:",
      error
    );

    return NextResponse.json(
      { error: "Došlo je do greške pri slanju emaila." },
      { status: 500 }
    );
  }
}