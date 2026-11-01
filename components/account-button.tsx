"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export function AccountButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setLoggedIn(!!user);
      setLoading(false);
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <Link
      href={loggedIn ? "/nalog" : "/nalog/prijava"}
      aria-label={loggedIn ? "Moj nalog" : "Prijava"}
      title={loggedIn ? "Moj nalog" : "Prijava"}
     className={`inline-flex items-center justify-center rounded-xl border border-[#d6b878]/35 bg-gradient-to-b from-[#30231b] to-[#211812] text-[#ead4a0] shadow-[inset_0_1px_0_rgba(234,212,160,0.06)] transition hover:border-[#d6b878]/70 hover:bg-[#4b3621] hover:text-white active:scale-95 ${
  loggedIn ? "h-11 w-11" : "min-w-[90px] px-4 py-2.5"
}`}
    >
      {loggedIn ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M5 21a7 7 0 0 1 14 0" />
        </svg>
      ) : (
        "Prijava"
      )}
    </Link>
  );
}