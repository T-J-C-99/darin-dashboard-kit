# /update-metric — Update a KPI Value

## Error handling

If the database is unreachable, tell the user: "I can't reach the database right now. Check your internet connection. If it persists, say 'run /diagnostic' or text Tom."

If a query returns unexpected results, show the user what happened in plain English before proceeding.

## Steps

If arguments given (e.g., `/update-metric claims_sla 93.8`), use them. Otherwise ask:
1. Which metric?
2. New value?

## Metric key validation

Before inserting, verify the metric_key exists in metrics_config. If not, list enabled metrics and ask the user to pick one. Support fuzzy matching with ILIKE on the label.

## Numeric validation

Validate the value is numeric. If the user says 'ninety-three', tell them: "I need a number like 93.8."

## Duplicate check

Check if the same value was already logged in the last hour. If so: "You already logged [value] for [metric] [time ago]. Log again?"

## Insert

```sql
INSERT INTO metric_values (metric_key, value, source, updated_by)
VALUES ([key], [value], 'claude', 'claude');
```

Confirm: "[metric label] updated to [value]. Previous was [old value] ([time ago])."
