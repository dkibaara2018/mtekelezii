# API Contracts (v1)

## POST /api/ideas/create
Request
{
  "title": "string(3–120)",
  "raw_input": "string(≥10)"
}
Response
{ "ideaId": "uuid" }

## POST /api/agent/run
Request
{ "ideaId": "uuid" }
Response
{
  "ideaId": "uuid",
  "publicUrl": "/idea/{slug}",
  "icsUrl": "/api/ics/{uuid}.ics",
  "status": "PLANNING|ACTING|VERIFYING|DONE|FAILED"
}

## POST /api/pages/publish
Request
{ "ideaId": "uuid", "is_public": true }
Response
{ "publicUrl": "/idea/{slug}" }

## POST /api/tasks/update
Request
{ "taskId": "uuid", "status": "TODO|DOING|DONE" }
Response
{ "ok": true }

## GET /api/ics/{ideaId}.ics
- Returns `text/calendar` stream for the idea’s scheduled tasks.

