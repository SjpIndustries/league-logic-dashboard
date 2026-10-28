# LeagueLogic timing contract reconciliation

Decision for Mobile API 1.1.0, 28 October 2026: distinguish search/data collection
from report execution. This is a proposed contract correction for review, not
verification of a deployed API. Neither Streamlit validator is changed here.

## Intended rules

Let Δ = (kickoff timestamp − authoritative server timestamp) / 60 seconds,
with full precision. AEST is Australia/Brisbane (UTC+10). Include date and offset
in timestamps; do not use time-of-day alone. Never round or truncate Δ for gating.

| Stage | Permitted Δ (minutes before kickoff) | Meaning |
| --- | --- | --- |
| Search / pre-match data collection | 30 ≤ Δ ≤ 240 | Opens T-240; final accepted update at exact T-30 |
| Execution timing validation | 30 ≤ Δ ≤ 90 | Opens T-90; final eligible execution at exact T-30 |
| Preferred execution | Δ = 33 | Optimal, optional; no exception to readiness checks |
| Frozen | Δ < 30 | No new pre-match input or execution, including kickoff and afterwards |

The validator may be queried outside these windows to explain disqualification.
Reading fixtures, archived reports, and post-match audit operations is not
pre-match data collection and is not prohibited by this timing rule.

For a 20:00 AEST kickoff, search opens 16:00, execution opens 18:30,
optimal timing is 19:27, and the inclusive cutoff is 19:30. At 19:30:00.001,
both pre-match collection and execution are closed. T-90.01 is too early to
execute even though searching is permitted; T-29.99 is too late.

Execution requires both timing eligibility and a ready LIVE DATA feed. The
server must re-check both immediately before execution; an earlier VALID
snapshot grants no reservation. T-33 does not bypass any prerequisite.

## Evidence and reconciliation

Read-only checks performed 28 October 2026:

- [Predictions-V4 workbook](https://docs.google.com/spreadsheets/d/1rBXIYDSHA6d7TAV7p5vmPgNlHrNJ6yKEbxzNmiPsUR0/edit),
  `2025 Fixtures!G1:H3`: headers explicitly say `Search Window Opens (T-240)`
  and `Search Window Closes (T-30)`. The 20 June 2025 20:00 fixture has
  16:00 / 19:30 search bounds. These are search labels, not proof of execution policy.
- [T-minus validator](https://github.com/SjpIndustries/league-logic-tminus-validator/blob/main/league_logic_tminus_validator.py)
  file blob SHA `b4554c951591f8a87b4a8c6b4295a9ebe23e75b5`, uses 30 ≤ T-minus ≤ 90.
- [GODMODE validator](https://github.com/SjpIndustries/leaguelogic-validator/blob/main/LeagueLogic_GODMODE_Validator/app.py),
  file blob SHA `deaa6121c65ad227123bcd578fff6ca61b0cc99f`,
  uses the same execution range and labels T-33 optimal.
- Dashboard base commit `08b37cf0c8a19074df2fca9bfcdef48512d554b6`:
  `openapi.yaml` conflated T-240 with execution and described execution rules
  with maximum 240 and a zero-minimum example. `WEBSITE_SPEC.md` §§4.4 and 6
  require compliance/freeze at T-30 but did not define the opening boundaries.
- [Original API PR #2](https://github.com/SjpIndustries/league-logic-dashboard/pull/2)
  was merged on 1 September 2025; its merge does not establish deployed behavior.

Historical project discussions contain both the earlier T-90/T-33 policy and
later broader T-240-to-T-30 execution wording. They do not establish a single
unchanged historical policy. This correction follows the current reconciliation
request: T-240 is search opening; T-90-to-T-30 is execution eligibility; T-33 is
preferred. It explicitly replaces the conflated wording for this contract.

## Contract changes and compatibility

- Keep existing paths, `VALID` / `DISQUALIFIED` state names, and `rules` field.
  `rules` now unambiguously describes execution: min 30, max 90, optimal 33.
  Separate `search_rules` describes min 30, max 240.
- Validator 200 remains a timing snapshot that can report either state. A 409
  timing rejection must report DISQUALIFIED; it cannot describe an in-window
  timestamp as a timing rejection. Feed readiness failure uses the execution
  endpoint's existing generic 409 error response.
- `optimal` is required in validator snapshots/rejections and true only at exact
  T-33. It is timing metadata, not execution approval.
- `t_minus_minutes` becomes a JSON number so fractional-minute boundary results
  are representable. Execution success requires this field in [30, 90] and
  `status: VALID`. Validator timing and rule fields are now required; schemas
  enforce state/optimal consistency using OpenAPI 3.1 JSON Schema conditionals.
- Parse/update operations document the search window and a generic 409 outside
  it. No new search endpoint or runtime scheduler is introduced.

These are behavioral and schema-tightening changes despite the unchanged `/v1`
path. API 1.1.0 denotes this proposed revision; it is not a claim of backwards
compatibility. Clients expecting integer-only minutes, optional timing fields,
or execution as early as T-240 need migration. Coordinate server and client
rollout and verify a deployed implementation before declaring conformance.

## Validation and scope

```sh
python -m pip install -r requirements-contract.txt
python validate_openapi.py
python -m unittest discover -s tests -v
```

CI runs the same checks on PRs and main pushes. Boundary tests validate the
actual response schemas with independent expected outcomes, including fractional
minutes around T-90, T-33 and T-30, T-240, kickoff, and post-kickoff. They reject
contradictory VALID/optimal payloads and execution successes outside the window.
They also check fixed search/execution metadata and endpoint schema references.

These tests prove contract constraints, not runtime clock arithmetic, deployed
HTTP status codes, data freshness, or execution locking. Repairs to validator
imports, timezone handling, fixture dates, rounding, and duplicate UI logic
remain separate work. The workbook, validators, dashboard runtime, report engine,
and deployment are unchanged.
