# Campaign Pulse

**Supporting project · working offline prototype**

## Problem
A drop in bookings may reflect fewer sends, fewer replies or weaker conversion at a later stage.

## Try it
Open [the demo](../index.html) and choose Campaign Pulse in the sidebar.

Enter earlier and later counts from equal windows of the same cohort → compare.

## Example
500 sends / 60 replies / 18 interested / 8 booked versus 320 / 24 / 6 / 2 → count changes of −180 / −36 / −12 / −6.

## Implemented
Input validation, nested funnel checks, count deltas and stage-specific diagnostic prompts.

## Scope and limitations
No attribution of cause, no CRM connection and no prediction. Bookings from previous cohorts do not belong in these inputs.

## Next contribution
Add cohort-age checks and campaign notes.
