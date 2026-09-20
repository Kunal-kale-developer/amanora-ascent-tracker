# Amanora Ascent Avenue — Digital Fire Tracker (v1 MVP)

## What this is
- `/floors` (index.js) — corporate/engineer view. Read-only, color-coded floor cards (Red/Yellow/Green), auto-refreshes every 30s.
- `/update` — technician's mobile view. Update a floor's status, sprinkler counts, and notes.
- `/walk` — **use this one during the site walk.** Steps through floors one by one (B1 → 7th), tap-checklist (sprinklers/piping/valves/panel), a "damage found" flag, a camera button, and a quick note. Status (Red/Yellow/Green) is auto-derived from what you tick. Tap "Save & Next Floor" and it moves on — nothing to remember, nothing to type later.
- Backend: Spring Boot + PostgreSQL, 4 tables (`floors`, `hydro_tests`, `material_logs`, `floor_photos`).

## Run it — backend
1. Create a local Postgres DB: `createdb amanora_tracker`
2. Edit `backend/src/main/resources/application.properties` with your DB username/password.
3. From `backend/`: `./gradlew bootRun` (schema.sql auto-runs on startup and seeds the 9 floors).
4. API live at `http://localhost:8080/api/floors`

## Run it — frontend
1. From `frontend/`: `npm install`
2. `npm run dev`
3. Dashboard at `http://localhost:3000`, technician update form at `http://localhost:3000/update`

## Deploy fast (for tomorrow's demo)
- Backend: any free-tier Postgres (Railway/Neon) + deploy Spring Boot on Railway/Render.
- Frontend: `vercel deploy` from the `frontend/` folder — takes ~2 min. Set `NEXT_PUBLIC_API_BASE` env var to your deployed backend URL.
- Share the `/floors` link with the engineer — that's the "corporate view" link mentioned in the plan.

## What's NOT built yet (v2, once this is live)
- Photo upload for hydro-test pressure gauge readings (currently just a `photo_url` text field — wire to S3/Cloudinary later)
- PDF weekly progress export
- Login/auth (right now `/update` is open — fine for internal team use, lock it down before sharing broadly)
- QR-code asset auditor (Module A from your original plan) — separate, later phase once AMC stage starts

## Next edit points
- `backend/.../schema.sql` — update `total_sprinklers` per floor once you confirm counts on-site tomorrow
- `frontend/pages/index.js` — this is the file to customize colors/branding for the pitch
