import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, Calendar, MapPin, Gauge, Hash } from "lucide-react";

/**
 * LeagueLogic — Interactive 2025 NRL Fixtures Page
 * AEST native. Fully interactive. AI-ready hooks.
 *
 * Key features implemented:
 * - Full-season fixtures list with round filter and team search.
 * - Auto-updating status per game based on kickoff time.
 * - Estimated finish time = kickoff + BASE_MATCH_MINUTES + HALFTIME_MINUTES + PADDING_MINUTES.
 * - Live progress meter from kickoff to estimated finish.
 * - Timezone locked to Australia/Brisbane by default.
 * - Hooks for AI insights and LeagueLogic engine telemetry (stubs provided).
 * - Clean, mobile-first UI with Tailwind and subtle motion.
 *
 * Integration notes:
 * - Replace getFixtures() with live data from Sheet Sync AI or scraper.
 * - Populate result fields post-match to flip status to "Final".
 * - Wire AI hooks to LeagueLogic V4.3‑TCR‑EAS/TCRX.CORE for module telemetry.
 */

// --- Config: timing model (can be tuned per competition policy) ---
const BASE_MATCH_MINUTES = 80;       // Clocked play time
const HALFTIME_MINUTES = 10;         // Typical interval
const PADDING_MINUTES = 20;          // Stoppages, reviews, set rests, presentations
const EST_TOTAL_MINUTES = BASE_MATCH_MINUTES + HALFTIME_MINUTES + PADDING_MINUTES; // 110 min default

// Estimated finish time from kickoff
function estimateFinish(koISO: string) {
  const ko = new Date(koISO);
  return new Date(ko.getTime() + EST_TOTAL_MINUTES * 60 * 1000);
}

function fmtTime(d: Date) {
  return d.toLocaleString("en-AU", { timeZone: "Australia/Brisbane", hour: "2-digit", minute: "2-digit" });
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-AU", { timeZone: "Australia/Brisbane", weekday: "short", day: "2-digit", month: "short", year: "numeric" });
}

function diffHuman(a: Date, b: Date) {
  const ms = a.getTime() - b.getTime();
  const sign = ms < 0 ? -1 : 1;
  const abs = Math.abs(ms);
  const m = Math.floor(abs / 60000);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  const s = sign < 0 ? "ago" : "from now";
  if (h > 0) return `${h}h ${mm}m ${s}`;
  return `${mm}m ${s}`;
}

// Status computation
function computeStatus(koISO: string, hasFinal: boolean) {
  const now = new Date();
  const ko = new Date(koISO);
  const estEnd = estimateFinish(koISO);
  if (hasFinal || now >= estEnd) return { state: hasFinal ? "Final" : "Awaiting final", progress: 100 } as const;
  if (now < ko) {
    return { state: "Upcoming", progress: 0, tminus: diffHuman(ko, now) } as const;
  }
  // live
  const total = estEnd.getTime() - ko.getTime();
  const elapsed = Math.max(0, Math.min(total, now.getTime() - ko.getTime()));
  const progress = Math.round((elapsed / total) * 100);
  return { state: "Live", progress, estFinish: estEnd } as const;
}

// --- AI hooks (stubs) ---
async function getAIMatchInsight(_match: Fixture): Promise<string> {
  // Wire to LeagueLogic engine for a one-line, pre-kickoff insight. Keep deterministic, no late data inside T-30.
  return Promise.resolve("Insight pending: connect LeagueLogic engine endpoint.");
}

// --- Data types ---
interface Fixture {
  id: string;
  round: number;
  kickoffAEST: string; // ISO with timezone offset
  venue: string;
  home: string;
  away: string;
  // Optional fields for results once final
  homeScore?: number;
  awayScore?: number;
  final?: boolean;
  hashId?: string; // execution or report hash prefix
}

// Demo data: replace with live feed or Sheet Sync ingestion
function getFixtures(): Fixture[] {
  return [
    { id: "R01-001", round: 1, kickoffAEST: "2025-03-06T19:50:00+10:00", venue: "Suncorp Stadium", home: "Broncos", away: "Cowboys" },
    { id: "R01-002", round: 1, kickoffAEST: "2025-03-07T18:00:00+10:00", venue: "Accor Stadium", home: "Rabbitohs", away: "Roosters" },
    { id: "R22-006", round: 22, kickoffAEST: "2025-08-31T19:35:00+10:00", venue: "Allianz Stadium", home: "Roosters", away: "Sharks" },
    // ... populate the full season
  ];
}

export default function Fixtures2025() {
  const [query, setQuery] = useState("");
  const [round, setRound] = useState<number | "all">("all");
  const [now, setNow] = useState(new Date());
  const [aiNotes, setAiNotes] = useState<Record<string, string>>({});

  // Tick every 30s for smooth progress updates
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const fixtures = useMemo(() => getFixtures(), []);

  // Filter
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fixtures.filter(f => {
      const byRound = round === "all" || f.round === round;
      const hay = `${f.home} ${f.away} ${f.venue}`.toLowerCase();
      const byTeam = !q || hay.includes(q);
      return byRound && byTeam;
    }).sort((a,b) => new Date(a.kickoffAEST).getTime() - new Date(b.kickoffAEST).getTime());
  }, [fixtures, query, round]);

  // Load AI one-liners lazily for upcoming matches
  useEffect(() => {
    (async () => {
      const next = visible.slice(0, 10); // limit calls
      const updates: Record<string, string> = {};
      for (const m of next) {
        if (!aiNotes[m.id]) updates[m.id] = await getAIMatchInsight(m);
      }
      if (Object.keys(updates).length) setAiNotes(prev => ({ ...prev, ...updates }));
    })();
  }, [visible]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">2025 NRL Season Fixtures</h1>
          <p className="text-sm text-muted-foreground">AEST • Auto-updating statuses • Estimated finish from kickoff</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full rounded-2xl border px-9 py-2 text-sm shadow-sm focus:outline-none"
              placeholder="Search team or venue"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="rounded-2xl border px-3 py-2 text-sm shadow-sm"
            value={round}
            onChange={(e) => setRound(e.target.value === "all" ? "all" : Number(e.target.value))}
          >
            <option value="all">All Rounds</option>
            {Array.from({ length: 27 }).map((_, i) => (
              <option key={i+1} value={i+1}>Round {i+1}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" />Upcoming</div>
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" />Live</div>
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" />Awaiting Final</div>
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-zinc-500" />Final</div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {visible.map((m) => {
          const ko = new Date(m.kickoffAEST);
          const estEnd = estimateFinish(m.kickoffAEST);
          const hasFinal = Boolean(m.final && typeof m.homeScore === "number" && typeof m.awayScore === "number");
          const status = computeStatus(m.kickoffAEST, hasFinal);

          const badge = status.state === "Upcoming" ? "bg-blue-500" : status.state === "Live" ? "bg-green-500" : status.state === "Final" ? "bg-zinc-500" : "bg-amber-500";

          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${badge}`} />
                    <span className="text-xs font-medium uppercase tracking-wide">{status.state}</span>
                  </div>
                  <h2 className="text-lg font-semibold">{m.home} vs {m.away}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{fmtDate(ko)} {fmtTime(ko)} AEST</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{m.venue}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />Est. finish {fmtTime(estEnd)}</span>
                    {m.hashId && <span className="inline-flex items-center gap-1"><Hash className="h-4 w-4" />{m.hashId}</span>}
                  </div>
                </div>
                <div className="text-right">
                  {hasFinal ? (
                    <div className="text-2xl font-bold">{m.homeScore}-{m.awayScore}</div>
                  ) : status.state === "Upcoming" ? (
                    <div className="text-sm text-muted-foreground">KO {diffHuman(ko, new Date())}</div>
                  ) : status.state === "Live" ? (
                    <div className="text-sm text-muted-foreground">Est. {diffHuman(estEnd, new Date())}</div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Final pending</div>
                  )}
                </div>
              </div>

              {/* Progress */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-200">
                <div className="h-full bg-zinc-800" style={{ width: `${status.progress ?? 0}%` }} />
              </div>

              {/* AI one-liner */}
              <div className="mt-3 flex items-center gap-2 text-sm">
                <Gauge className="h-4 w-4" />
                <span className="text-muted-foreground">{aiNotes[m.id] ?? "Loading model note…"}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Estimated finish updates automatically from kickoff time using a 110‑minute default window. Adjust constants to tune.
      </p>
    </div>
  );
}
