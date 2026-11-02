import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        loggedIn: false,
        subscribed: false,
      });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Nedostaje proizvod." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("restock_notifications")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({
      loggedIn: true,
      subscribed: Boolean(data),
    });
  } catch (error) {
    console.error("Greška pri proveri prijave:", error);

    return NextResponse.json(
      { error: "Greška pri proveri prijave." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Morate biti prijavljeni." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const productId = body.productId;

    if (
      typeof productId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId)
    ) {
      return NextResponse.json(
        { error: "Neispravan proizvod." },
        { status: 400 }
      );
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, stock")
      .eq("id", productId)
      .maybeSingle();

    if (productError) throw productError;

    if (!product) {
      return NextResponse.json(
        { error: "Proizvod nije pronađen." },
        { status: 404 }
      );
    }

    if (product.stock > 0) {
      return NextResponse.json(
        { error: "Proizvod je već dostupan." },
        { status: 409 }
      );
    }

    const { error } = await supabase
      .from("restock_notifications")
      .insert({
        user_id: user.id,
        product_id: productId,
      });

    if (error && error.code !== "23505") {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Uspešno ste prijavljeni za obaveštenje.",
    });
  } catch (error) {
    console.error("Greška pri prijavi za obaveštenje:", error);

    return NextResponse.json(
      { error: "Došlo je do greške. Pokušajte ponovo." },
      { status: 500 }
    );
  }
}