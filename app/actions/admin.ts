"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/app/actions/leads";
import type { LeadStatus } from "@/lib/types";

const VALID_STATUSES: LeadStatus[] = ["new", "contacted", "trial", "converted", "lost"];

export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus
): Promise<ActionResult> {
  if (!VALID_STATUSES.includes(status)) {
    return { success: false, error: "Invalid status." };
  }

  // RLS guarantees only admins can update leads
  const supabase = createClient();
  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", leadId);

  if (error) return { success: false, error: "Could not update lead." };

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  return { success: true };
}
