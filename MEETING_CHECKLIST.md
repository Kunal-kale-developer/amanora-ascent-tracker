# Ascent Avenue — Inspection Meeting Checklist (Engineer Meeting)

## 1. Questions to ask the engineer
- Why did the previous contractor leave? (get this in writing if possible — it's your leverage for premium/emergency rates)
- Floor-by-floor: which floors are fully done, which are half-done, which are untouched?
- Is there an existing work order / scope document from the previous contractor? Ask for a copy.
- What material is already on-site (delivered but maybe not installed)? Get an inventory if one exists.
- What's the expected timeline / MahaRERA deadline pressure on this?
- Who signs off on RA (running account) bills, and what's the billing cycle they'll accept?
- Who is the point of contact for day-to-day updates — this engineer, or someone above them?
- Is there a written quotation/BOQ (Bill of Quantities) from the earlier vendor you can benchmark against?

## 2. What to physically inspect, floor by floor (B1 to 7th)
For each floor, note:
- [ ] Sprinkler heads: how many installed vs how many pending
- [ ] Pipe routing: complete / partial / not started
- [ ] Valves and hose reels: installed or missing
- [ ] Fire panel / pump room connections (if applicable to that floor)
- [ ] Any damaged or incorrect prior work that needs redoing
- [ ] Rough completion % (your own estimate, floor by floor)

## 3. Material to check
- [ ] What's lying on-site unused (pipes, sprinkler heads, valves) — count it
- [ ] What's missing and needs fresh procurement
- [ ] Any material that looks substandard/wrong-spec from the previous vendor

## 4. Photo & video — do this systematically, not randomly
- One photo per floor showing overall state (wide shot)
- Close-up photos of: any damaged work, any completed sprinkler zone, pump room, panel
- Short video walkthrough per floor (30-60 sec) — useful both as your own record and later as "before" proof for the pitch
- Label file names by floor as you go (e.g. `B1_before_2026-09-21.jpg`) — makes it easy to feed into the tracker later

## 5. What to lock in before you leave
- [ ] A written (even WhatsApp-confirmed) work order — scope, floors covered, rate, billing cycle
- [ ] Confirmation on the 15-day billing clause if you're pushing for it
- [ ] Rough quotation timeline — when will you send the formal quote back?

## How this feeds the tracker
- Floor-by-floor completion % you note tomorrow → seeds the `floors` table (`installed_sprinklers`, `tested_sprinklers`, `status`)
- Material counts → seeds `material_logs`
- Photos → later attached against `hydro_tests.photo_url` once you start testing
- The work order scope/rate stays in your own records — not in the tracker (keep client commercial terms separate from the technical dashboard)
