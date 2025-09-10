LeagueLogic — Website Spec v1.0

Owner: Steven J. Parks • Timezone: Australia/Brisbane (AEST) • Effective: 31 Aug 2025

Goal: Public‑facing and partner‑grade site that showcases LeagueLogic V4.3‑TCR‑EAS/TCRX.CORE with live dashboards, demos, report library, licensing, and investor pages. Enterprise‑ready. Mobile‑first.

⸻

1) Success Criteria
•Clear value proof: accuracy, transparency, integrity.
•Lead generation: qualified license inquiries and enterprise demos.
•Operational trust: live T‑minus compliance signals and immutable hashes.
•Speed: <1.5s LCP on 4G, >90 Lighthouse across PWA, SEO, A11y.

⸻

2) Core Audiences
•Enterprise sportsbooks, media, and analytics partners.
•Investors and licensees.
•Fans seeking transparent pre‑match forecasts.

⸻

3) Information Architecture (Sitemap)
1.Home
2.Live Dashboard (∞VMAX)
3.Prime Intelligence Reports
4.T‑minus Validator
5.Methodology (Engine + Modules)
6.Accuracy & Audits
7.Demos & Sandboxes
8.Licensing (Enterprise)
9.Pricing (Tiered)
10.Case Studies
11.Newsroom
12.About (Team, Ethics)
13.Support (Docs, Status, Contact)
14.Investor Portal
15.Admin CMS (secure)
16.Legal (ToS, Privacy, Compliance)

⸻

4) Page Requirements

4.1 Home
•Hero: live Edge Meter, Confidence Gauge, and T‑minus ticker for next match.
•Short value pillars: Honesty, Determinism, Auditability.
•3‑card carousel of recent verified reports with SHA‑3 badges.
•CTA: “View Live Dashboard” and “Request Enterprise Demo”.

4.2 Live Dashboard (∞VMAX)
•Next Fixture Panel: kickoff time, venue, T‑minus, freeze status, hash.
•Forecast Strip: predicted margin, probability bands, edge vs market.
•Module Telemetry: compact bars for PD, ASTROCORE, VCO, BRS/PCFH status.
•Venue Clamp Widget with per‑venue range.
•Market Sanity vs book lines.
•Ledger Feed: real‑time execution IDs and timestamps.
•Round Switcher and Team Filter.
•Mobile card mode with swipe.

4.3 Prime Intelligence Reports
•Searchable library.
•Each report page uses the locked template visual with: header, signature, modules summary, downloadable PDF, and on‑page HTML view.
•Badge for WIN/LOSS outcome, confidence calibration chart, and immutable hash.

4.4 T‑minus Validator (Web App)
•Input: kickoff datetime, venue.
•Reads freeze and shows “Compliant by T‑30 / Non‑compliant”.
•Visual: circular timer and timeline ruler.
•Upload/report check: verify a report’s embedded timestamp and hash.

4.5 Methodology
•Interactive module map: hover to reveal inputs/outputs and placement order.
•Micro‑explainer for SYNMOD‑ASTROCORE slot.
•VCO table preview with example venues.

4.6 Accuracy & Audits
•Round‑level hit rate, Brier score, calibration curve.
•Misfire dossiers with cause category and fix log.
•Filters by season, team, venue.

4.7 Demos & Sandboxes
•Guided Demo: scripted run with mocked pre‑kickoff feed.
•Interactive Sandbox: sliders for market line, weather deltas, lineup toggles; shows effect on forecast while clearly watermarked as DEMO.
•Video Walkthroughs and Dataset Samplers.

4.8 Licensing
•Territory map and license tiers.
•Compliance checklist and data intake policy.
•CTA: NDAs and enterprise demo booking.
•Secure doc room for approved prospects.

4.9 Pricing
•Public tiers: Observer, Pro, Enterprise (contact).
•Feature matrix: dashboards, report quotas, API credits, SLA.
•Stripe‑based checkout and invoicing hooks.

4.10 Case Studies
•Narrative with metrics and before/after charts.
•Quotes and third‑party references.

4.11 Newsroom
•Press kit, brand assets, logo usages, media contact.
•Release notes and notable wins.

4.12 About
•Team bios, governance, ethics pledges.
•“Why deterministic locking matters.”

4.13 Support
•Docs, FAQs, email contact, system status.
•Embedded ticket form.
•SLA details for enterprise.

4.14 Investor Portal
•Auth‑gated.
•KPI dashboard, runway metrics, investor updates, report archive.

4.15 Admin CMS
•Roles: Owner, Admin, Editor, Analyst, Read‑only.
•Approvals for public publishing with 4‑eye rule.
•Audit log for content changes.

4.16 Legal
•ToS, Privacy, Cookies, Data processing terms, Licenses.

⸻

5) Innovation Visuals and Interactions
•Edge Meter: radial gauge that animates on new forecast.
•Confidence Bands: shaded distribution over expected margin.
•T‑minus Ribbon: color states for >T‑60, T‑60→T‑30, <T‑30 (locked).
•Hash Badges: copy‑to‑clipboard with verify call.
•Module Flow Map: WebGL or SVG path with animated packets.
•Venue Clamp Lens: scrub through venues to see clamp changes.
•Micro‑interactions with haptic‑like feedback on mobile.

⸻

6) Live Updating Stats
•Refresh Cadence:
•Pre‑match inputs every 10 min until T‑30, then freeze.
•Post‑match audit window T+60 to T+24h.
•Data Banners: UI indicates frozen state and source provenance.
•Cache Strategy: stale‑while‑revalidate with signed server revalidation events.
•Rate Limits: throttle public views, unlimited for authorized partners.

⸻

7) Dashboards

7.1 Public Live Dashboard
•Next fixture hero with forecast.
•Round grid with match cards.
•Accuracy YTD, recent streaks.
•Team pages with per‑team splits.

7.2 Partner Dashboard
•Deeper telemetry, APIs, export CSV.
•Bulk report downloads, webhook settings.
•Alert rules: edge threshold, line movement, model drift.

7.3 Investor Dashboard
•MAU, conversion, accuracy trend, cash runway, burn.
•Board update PDFs.

⸻

8) Demos
•Narrated demo with state‑stepped UI.
•Sandbox with guardrails.
•Report Composer Demo that renders a sample and shows hash creation.

⸻

9) Tech Stack
•Frontend: Next.js, React, TypeScript, Tailwind, shadcn/ui, Framer Motion, Recharts, Mapbox.
•Server: Next.js App Router, Edge functions for cache invalidation.
•Data: Scrape pipeline for NRL.com + ZeroTackle. Signed ingestion.
•Auth: JWT + short‑lived tokens. SSO (SAML/OIDC) for enterprise.
•Payments: Stripe.
•Storage: Object storage for PDFs and assets.
•Search: Algolia or Typesense for reports.
•CDN: Global edge with image optimization.
•Analytics: GA4 + privacy‑respecting alt (Plausible).
•Email: Transactional service for confirmations.
•Observability: OpenTelemetry, Sentry, uptime and synthetic checks.

⸻

10) Data Architecture
•Immutable Ledger: stores execution ID, hash, timestamps, freeze state.
•Public API: GET read‑only endpoints for forecasts and reports, rate‑limited.
•Partner API: authenticated endpoints, webhooks.
•Admin Ops: CRUD for report metadata, clamp tables, and case studies.
•RBAC: role‑based access across portal and APIs.

⸻

11) Performance & A11y Budgets
•LCP ≤ 1.5s, TTI ≤ 2.5s, TBT ≤ 150ms.
•CLS ≤ 0.1, FID ≤ 100ms.
•A11y: WCAG 2.2 AA. Keyboard paths for all key flows.
•Motion‑reduce path for animations.

⸻

12) Security & Compliance
•TLS 1.3, HSTS, CSP strict, Subresource Integrity.
•Secrets in KMS.
•Signed URLs for downloads.
•DPA and regional data residency options.
•Comprehensive audit logging.
•Regular pen‑tests.

⸻

13) SEO & Content
•Structured data: Organization, Article, Dataset.
•OpenGraph/Twitter cards on reports.
•Canonicals and hreflang for AU/EN and future locales.
•Editorial workflow with review gates.

⸻

14) Admin CMS Workflows
•Draft → Review → Legal → Publish.
•Scheduled releases and embargo.
•Diff view for changes with rollback.
•CSV bulk import for historical reports.

⸻

15) Monitoring & SLAs
•Uptime target 99.9% public, 99.95% partner.
•Alerting: forecast feed stale, hash mismatch, high error rate.
•Status page with components and incident RCA posts.

⸻

16) Roadmap Upgrades & Enhancements
1.Phase X Mobile UX for T‑minus Validator.
2.Sheet Sync AI: auto‑ingest grey row to dashboard.
3.Report Auto‑Renderer from LIVE DATA FEED payload.
4.Calibration Lab: interactive reliability diagrams over rolling windows.
5.Predictive Explainability: SHAP‑style visuals per module.
6.Licensee Workspace: co‑branded dashboard with export templates.
7.Edge Alerts via push/email/webhooks.
8.Multilingual starting with en‑AU, en‑NZ.
9.App‑like PWA with offline report viewing.
10.Partner SSO with SCIM provisioning.
11.Hash Verifier Browser Extension.
12.Live Press Mode for broadcasters.
13.Kiosk Mode for venues and corporate suites.

⸻

17) Content Inventory (MVP)
•10 public reports, 2 case studies, 1 explainer video, 1 narrated demo, accuracy page, pricing, licensing brief, newsroom kit.

⸻

18) Visual System
•Dark + light themes.
•Brand colors aligned to report template.
•Components: Cards (2xl radius), soft shadows, ample padding.
•Iconography for modules and states.
•Motion cues: subtle, physics‑based, with reduce‑motion support.

⸻

19) Acceptance Checklist
•Pages and nav match sitemap.
•Live Dashboard wired to scrape pipeline with freeze logic.
•T‑minus Validator functional and accurate.
•Report library searchable with hashes.
•Admin CMS with RBAC and audit log.
•Payments and licensing flows.
•SEO and performance budgets met.
•Observability, alerts, and status page.

⸻

End of Spec v1.0

⸻

Component: Interactive 2025 NRL Fixtures (React)

```tsx
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
```

⸻

Notes
•Keep this unified doc as the single source for website IA plus the reference fixtures component.
•For preview in a React canvas, paste the component into a code/react file or import into your Next.js route.
•Wire to Sheet Sync and scraper, then set EST_TOTAL_MINUTES per policy.
