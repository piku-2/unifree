"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      // ★ これで URL の code → session が確定する
      const { data, error } = await supabase.auth.getSession();

      console.log("AUTH_CALLBACK_SESSION:", data.session, error);

      router.replace("/");
    };

    run();
  }, [router]);

  return null;
}
