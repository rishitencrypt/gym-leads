"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowUpDown, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SOURCE_LABELS, type Lead, type LeadStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { downloadCsv, toCsv } from "@/lib/csv";
import { updateLeadStatus } from "@/app/actions/admin";

type SortKey = "name" | "city" | "source" | "status" | "created_at" | "bmi";

const STATUSES: LeadStatus[] = ["new", "contacted", "trial", "converted", "lost"];

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortAsc, setSortAsc] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = leads.filter((lead) => {
      const matchesQuery =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.phone ?? "").toLowerCase().includes(q) ||
        (lead.city ?? "").toLowerCase().includes(q);
      const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      return matchesQuery && matchesSource && matchesStatus;
    });

    rows = [...rows].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (typeof av === "number" && typeof bv === "number") {
        return sortAsc ? av - bv : bv - av;
      }
      return sortAsc
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

    return rows;
  }, [leads, query, sourceFilter, statusFilter, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function exportCsv() {
    const csv = toCsv(
      filtered.map((l) => ({
        ...l,
        source: SOURCE_LABELS[l.source],
        created_at: formatDate(l.created_at),
      })),
      [
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        { key: "phone", header: "Phone" },
        { key: "city", header: "City" },
        { key: "goal", header: "Goal" },
        { key: "bmi", header: "BMI" },
        { key: "source", header: "Source" },
        { key: "status", header: "Status" },
        { key: "created_at", header: "Date" },
      ]
    );
    downloadCsv(`leads-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  }

  function SortableHead({ label, k }: { label: string; k: SortKey }) {
    return (
      <TableHead>
        <button
          className="inline-flex items-center gap-1 hover:text-foreground"
          onClick={() => toggleSort(k)}
        >
          {label} <ArrowUpDown className="h-3 w-3" />
        </button>
      </TableHead>
    );
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search name, email, phone or city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead label="Name" k="name" />
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <SortableHead label="City" k="city" />
              <TableHead>Goal</TableHead>
              <SortableHead label="BMI" k="bmi" />
              <SortableHead label="Source" k="source" />
              <SortableHead label="Status" k="status" />
              <SortableHead label="Date" k="created_at" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                  No leads match your filters.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                <TableCell className="text-muted-foreground">{lead.phone ?? "--"}</TableCell>
                <TableCell>{lead.city ?? "--"}</TableCell>
                <TableCell className="capitalize">
                  {lead.goal ? lead.goal.replace("_", " ") : "--"}
                </TableCell>
                <TableCell>{lead.bmi ?? "--"}</TableCell>
                <TableCell>{SOURCE_LABELS[lead.source]}</TableCell>
                <TableCell>
                  <Select
                    value={lead.status}
                    onValueChange={(value) =>
                      startTransition(() =>
                        updateLeadStatus(lead.id, value as LeadStatus).then(() => undefined)
                      )
                    }
                  >
                    <SelectTrigger className="h-8 w-32 capitalize" disabled={isPending}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(lead.created_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="mt-4 text-xs text-muted-foreground">
          Showing {filtered.length} of {leads.length} leads
        </p>
      </CardContent>
    </Card>
  );
}
