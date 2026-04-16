# /log-checkin — Record a 1:1 Check-in

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Name lookup

If a name is given (e.g., `/log-checkin Mike`), look up the team member. If not, ask.

Support fuzzy name matching. If the exact name isn't found, try `SELECT id, name FROM team_members WHERE name ILIKE '%' || input || '%'`. If multiple matches, present a list.

If team_members table is empty, say: "You haven't added any team members yet. Run the wizard or say 'add a team member' first."

## Questions

Then ask:
1. How did it go? (notes -- free text)
2. Any new commitments? (from you to them, or them to you)
3. Quick morale read -- energy: high/med/low? confidence: high/med/low?
4. Blocker status -- still blocked? newly blocked? or clear?

## Energy/confidence mapping

Map energy/confidence synonyms: great/good/strong = 3 (high), okay/fine/decent = 2 (med), rough/low/tired/struggling = 1 (low). Reject anything that doesn't map.

## Duplicate check

Check for duplicate check-in same day: if a checkin exists for this member today, ask "You already logged a check-in with [name] today. Replace or add a second?"

## Writes

Insert into checkins, commitments, morale_history. Update team_members.blocker and blocker_type if changed. If blocker is null, set blocker_type to 'none'.

## Updating cadence (JSONB)

To update cadence: first SELECT cadence FROM team_members WHERE id = [id], then modify the JSON object in code (update 'last' to today, increment 'streak' if on time or reset to 0 if missed, update 'next' based on freq), then UPDATE team_members SET cadence = [new jsonb].

## Computing week_offset

Calculate week_offset as the number of weeks since the team member's tenure_start, or use 0 for the current week and increment from the last morale_history entry for that member.

Confirm: "Check-in with [name] logged. [summary of what changed]"
