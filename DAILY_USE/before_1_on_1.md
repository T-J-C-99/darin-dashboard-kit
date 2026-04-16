# 1:1 Prep

Claude: when the user says "prep for 1:1 with [name]" or "prep [name]", pull up this person's record.

## What to show

Query from DB:
1. **Open commitments** — what Darin promised them, what they promised Darin, with due dates
2. **Initiative status** — for each initiative this person owns, current progress vs pace
3. **Morale trend** — last 4-6 weeks of energy + confidence
4. **Latest check-in notes** — what was discussed last time, what was committed
5. **Blockers** — anything currently flagged
6. **Growth edge** — one development topic to consider raising

## Format

Present it conversationally:

> **1:1 with [Name] — [their role]**
> Next scheduled: [date from cadence]
>
> **Open commitments:**
> - You → them: [commitment text] (due [date])
> - Them → you: [commitment text] (due [date])
>
> **Initiatives they own:**
> - [Initiative name]: [progress]% (pace: [pace]%) — [ahead/behind]
>
> **Morale (last 4 weeks):**
> Energy: [trend arrows] — currently [high/med/low]
> Confidence: [trend arrows] — currently [high/med/low]
>
> **Last check-in ([date]):**
> [notes]
>
> **Blockers:** [if any]
>
> **Dev topic to consider:** [growth edge]

## After the 1:1

Ask: "How'd it go? Want to log notes from this check-in?"

If yes:
- Ask for notes (free text)
- Ask for any new commitments (from either side)
- Insert into `checkins` table
- Insert any commitments into `commitments` table
- Update morale if needed
- Update blocker if resolved
