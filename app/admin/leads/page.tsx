import { createClient } from "@/lib/supabase/server";
import { LeadsTable } from "@/components/admin/leads-table";
import type { Lead } from "@/lib/types";

export default async function AdminLeadsPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="text-sm text-red-400">
        Could not load leads. Please refresh the page.
      </p>
    );
  }

  return <LeadsTable leads={(data as Lead[]) ?? []} />;
}
