import { redirect } from "next/navigation";
import { createItem } from "../actions/items";
import { supabaseServerClient } from "../../lib/supabase/server";
import { SellForm } from "@/components/SellForm";

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
    <main className="min-h-screen bg-background">
      <SellForm onSubmit={handleCreate} />
    </main>
  );
}
