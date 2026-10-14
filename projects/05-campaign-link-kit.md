# Campaign Link Kit

**Supporting project · working offline prototype**

## Problem
Inconsistent campaign tags make later reporting harder to interpret.

## Try it
Open [the demo](../index.html) and choose Campaign Link Kit in the sidebar.

Enter a destination, source, medium and campaign → generate a normalized tagged link.

## Example
Source LinkedIn and campaign GTM Lab Launch become linkedin and gtm_lab_launch.

## Implemented
URL validation, UTM normalization, preservation of existing query parameters and anchors.

## Scope and limitations
No click tracking or analytics installation. Never put private identifiers in campaign tags.

## Next contribution
Add naming presets and a deduplication check for campaign names.
