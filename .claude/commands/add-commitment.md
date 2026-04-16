# /add-commitment — Add a Board/CEO Commitment

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Steps

Ask:
1. What did you promise? (label)
2. Target number or deliverable
3. Where are you now?
4. When is it due?
5. Who did you promise it to?
6. Higher is better, or lower? (direction)

Insert into commitments_to_board. Confirm with a summary including days-to-judgment.
