import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { SellForm } from "@/components/SellForm";
import { createItem } from "@/actions/ia";
import { supabaseServerClient } from "../../lib/supabase/server";
export const runtime = "nodejs";

export default async function SellPage() {
  const supabase = supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  async function handleCreate(formData: FormData) {
    "use server";
    await createItem(formData);
    redirect("/");
  }

  return (
    <>
      <Header title="出品する" showBack />
      <SellForm onSubmit={handleCreate} />
    </>
  );
}
