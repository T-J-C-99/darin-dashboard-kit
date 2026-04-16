# /add-risk — Add to Risk Register

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Steps

Ask:
1. What's the risk?
2. Who owns mitigation?
3. What's the mitigation plan?
4. Severity: high / med / low
5. Likelihood: high / med / low

Insert into risks table. Confirm.
