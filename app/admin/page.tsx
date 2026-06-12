import { Users, UserPlus, CalendarCheck, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SOURCE_LABELS, type Lead, type LeadSource, type TrialBooking } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const supabase = createClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const [leadsRes, bookingsRes] = await Promise.all([
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("trial_bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const leads = (leadsRes.data as Lead[]) ?? [];
  const bookings = (bookingsRes.data as TrialBooking[]) ?? [];

  const totalLeads = leads.length;
  const newLeads7d = leads.filter((l) => l.created_at >= sevenDaysAgo).length;
  const trialCount = leads.filter((l) => l.source === "trial_booking").length;
  const converted = leads.filter((l) => l.status === "converted").length;
  const conversionRate = totalLeads ? Math.round((converted / totalLeads) * 100) : 0;

  const sourceCounts = new Map<LeadSource, number>();
  for (const lead of leads) {
    sourceCounts.set(lead.source, (sourceCounts.get(lead.source) ?? 0) + 1);
  }
  const sources = Array.from(sourceCounts.entries()).sort((a, b) => b[1] - a[1]);

  const recentSignups = leads.filter((l) => l.source === "signup").slice(0, 8);

  const stats = [
    { icon: Users, label: "Total Leads", value: totalLeads },
    { icon: UserPlus, label: "New Leads (7 days)", value: newLeads7d },
    { icon: CalendarCheck, label: "Trial Bookings", value: trialCount },
    { icon: TrendingUp, label: "Conversion Rate", value: `${conversionRate}%` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/15">
                <stat.icon className="h-5 w-5 text-primary" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
                <p className="font-display text-2xl font-extrabold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sources.length === 0 && (
              <p className="text-sm text-muted-foreground">No leads yet.</p>
            )}
            {sources.map(([source, count]) => (
              <div key={source} className="flex items-center justify-between gap-3">
                <span className="text-sm">{SOURCE_LABELS[source]}</span>
                <div className="flex flex-1 items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.round((count / totalLeads) * 100)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-semibold">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSignups.length === 0 && (
              <p className="text-sm text-muted-foreground">No signups yet.</p>
            )}
            {recentSignups.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(lead.created_at)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Trial Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bookings.length === 0 && (
              <p className="text-sm text-muted-foreground">No bookings yet.</p>
            )}
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{booking.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {booking.location} &middot; {booking.phone}
                  </p>
                </div>
                <Badge variant={booking.status === "pending" ? "warning" : "success"}>
                  {booking.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
