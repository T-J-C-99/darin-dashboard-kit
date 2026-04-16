# /wizard — Setup Wizard

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Overview

Run the full dashboard setup. Reads each step file in sequence and walks the user through configuration.

## Instructions

1. Check `app_config` for `setup_step` in the database to find where the user left off. This is more reliable than parsing ANSWERS.md.
2. If `DATABASE_URL` is not set yet, the resume check won't work. In that case, check `SETUP/ANSWERS.md` as fallback.
3. If resuming, skip completed steps. If fresh, start at `SETUP/00_welcome.md`.

Read each file in order:
- `SETUP/00_welcome.md`
- `SETUP/01_identity.md`
- `SETUP/02_aviate.md`
- `SETUP/03_navigate.md`
- `SETUP/04_communicate.md`
- `SETUP/05_data_sources.md`
- `SETUP/06_review_spec.md`
- `SETUP/07_build.md`
- `SETUP/08_next_steps.md`

Follow the instructions in each file exactly. Ask one question at a time. Save answers to `SETUP/ANSWERS.md` as you go. Generate `SETUP/SPEC.md` at step 6. Execute the build at step 7.

After completion, the user's dashboard should be running with their real data.
