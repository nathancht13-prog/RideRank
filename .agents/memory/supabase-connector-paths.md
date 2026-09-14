---
name: Supabase connector paths
description: Environment-specific path behavior for the Replit Supabase connector proxy.
---

When calling the connected Supabase data API through the Replit connector proxy in this Repl, use paths such as `/spots`, not `/rest/v1/spots`.

**Why:** Requests prefixed with `/rest/v1` returned `PGRST125 Invalid path specified`, while paths relative to the PostgREST root reached the expected tables.

**How to apply:** This only concerns connector-proxy calls. The browser application uses the official Supabase client and should continue using normal Supabase client methods.