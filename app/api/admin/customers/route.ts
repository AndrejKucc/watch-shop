import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Provera prijavljenog korisnika
    const supabase = await createServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Niste prijavljeni." },
        { status: 401 }
      );
    }

    // Provera administratorskih ovlašćenja
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError || !adminUser) {
      return NextResponse.json(
        { error: "Nemate administratorska ovlašćenja." },
        { status: 403 }
      );
    }

    // Admin klijent - ključ se koristi isključivo na serveru
    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Učitavanje svih registrovanih korisnika
    const users: {
      id: string;
      email: string;
    }[] = [];

    let page = 1;

    while (true) {
      const { data, error } =
        await supabaseAdmin.auth.admin.listUsers({
          page,
          perPage: 1000,
        });

      if (error) {
        throw error;
      }

      const batch = data.users.map((user) => ({
        id: user.id,
        email: user.email ?? "",
      }));

      users.push(...batch);

      if (data.users.length < 1000) {
        break;
      }

      page++;
    }

    // Učitavanje svih omiljenih proizvoda
    const wishlistItems: {
      user_id: string;
      product_id: string;
    }[] = [];

    let offset = 0;
    const pageSize = 1000;

    while (true) {
      const { data, error } = await supabaseAdmin
        .from("wishlist_items")
        .select("user_id, product_id")
        .range(offset, offset + pageSize - 1);

      if (error) {
        throw error;
      }

      wishlistItems.push(...(data ?? []));

      if (!data || data.length < pageSize) {
        break;
      }

      offset += pageSize;
    }

    // Učitavanje prijava za obaveštenje o dostupnosti
    const restockItems: {
      user_id: string;
      product_id: string;
      created_at: string;
    }[] = [];

    offset = 0;

    while (true) {
      const { data, error } = await supabaseAdmin
        .from("restock_notifications")
        .select("user_id, product_id, created_at")
        .range(offset, offset + pageSize - 1);

      if (error) {
        throw error;
      }

      restockItems.push(...(data ?? []));

      if (!data || data.length < pageSize) {
        break;
      }

      offset += pageSize;
    }

    // Svi ID-jevi proizvoda iz omiljenih i restock prijava
    const productIds = [
      ...new Set([
        ...wishlistItems.map((item) => item.product_id),
        ...restockItems.map((item) => item.product_id),
      ]),
    ];

    // Učitavanje naziva i brendova proizvoda
    const productMap = new Map<
      string,
      { name: string; brand: string | null }
    >();

    for (let i = 0; i < productIds.length; i += 500) {
      const batchIds = productIds.slice(i, i + 500);

      const { data, error } = await supabaseAdmin
        .from("products")
        .select("id, name, brand")
        .in("id", batchIds);

      if (error) {
        throw error;
      }

      for (const product of data ?? []) {
        productMap.set(product.id, {
          name: product.name,
          brand: product.brand,
        });
      }
    }

    // Povezivanje korisnika sa omiljenim proizvodima i prijavama
    const customers = users
      .filter((customer) => customer.email)
      .map((customer) => {
        const favorites = wishlistItems
          .filter((item) => item.user_id === customer.id)
          .map((item) => {
            const product = productMap.get(item.product_id);

            return product
              ? {
                  id: item.product_id,
                  name: product.name,
                  brand: product.brand,
                }
              : null;
          })
          .filter((product) => product !== null);

        const restockRequests = restockItems
          .filter((item) => item.user_id === customer.id)
          .map((item) => {
            const product = productMap.get(item.product_id);

            return product
              ? {
                  id: item.product_id,
                  name: product.name,
                  brand: product.brand,
                  createdAt: item.created_at,
                }
              : null;
          })
          .filter((product) => product !== null)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          );

        return {
          id: customer.id,
          email: customer.email,
          favorites,
          restockRequests,
        };
      })
      .sort((a, b) => a.email.localeCompare(b.email));

    return NextResponse.json({
      customers,
      totalUsers: customers.length,

      usersWithFavorites: customers.filter(
        (customer) => customer.favorites.length > 0
      ).length,

      usersWithRestockRequests: customers.filter(
        (customer) => customer.restockRequests.length > 0
      ).length,

      totalRestockRequests: restockItems.length,
    });
  } catch (error) {
    console.error("Greška pri učitavanju korisnika:", error);

    return NextResponse.json(
      { error: "Došlo je do greške pri učitavanju korisnika." },
      { status: 500 }
    );
  }
}