import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="section-eyebrow">Owner Area</span>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight">
            Admin Dashboard
          </h1>
        </div>
        <nav className="flex gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
          >
            <LayoutDashboard className="h-4 w-4" /> Overview
          </Link>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
          >
            <Users className="h-4 w-4" /> Leads
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
