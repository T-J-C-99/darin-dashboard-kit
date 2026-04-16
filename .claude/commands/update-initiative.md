# /update-initiative -- Update Initiative Progress

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Steps

Ask: "Which initiative?" List active ones:
```sql
SELECT id, name, progress, pace, confidence, status FROM initiatives WHERE status = 'active' ORDER BY name;
```

Then ask: "What changed?" Prompt for any combination of:
- Progress % (0-100)
- Confidence (high/medium/low)
- Next step (free text)
- Status (active/paused/done/killed)

Update the initiative:
```sql
UPDATE initiatives
SET progress = [val], confidence = [val], next_step = [val], status = [val],
    updated_at = NOW()
WHERE id = [id];
```

Only SET the fields the user provided. Don't overwrite fields they didn't mention.

Also insert a pace_history row with the new progress and expected pace:
```sql
INSERT INTO pace_history (initiative_id, week_offset, progress, expected, recorded_at)
VALUES ([id], [week_offset], [new_progress], [current_pace], NOW());
```

Calculate week_offset from the initiative's existing pace_history (max week_offset + 1), or 0 if none exists.

Confirm: "[Initiative name] updated. Progress: [X]%, confidence: [Y]. Next step: [Z]."
