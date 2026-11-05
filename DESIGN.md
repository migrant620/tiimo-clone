---
version: alpha
name: Tiimo Android Visual Planner
description: Soft off-white planning surfaces, a serif date headline, tinted time-of-day pills and a lavender focus ring whose purple arc grows as a task runs. Covers the first batch (Today plan, action menu, edit sheet, focus timer, delete dialog).
colors:
  surface: "#FCFCFC"
  sheet: "#F6F5F4"
  card: "#FFFFFF"
  ink: "#111717"
  muted: "#A7A7A7"
  primary: "#9F85FF"
  morningPill: "#FFF2ED"
  afternoonPill: "#F0F3FF"
  eveningPill: "#EFE8FF"
  dash: "#F2F1F0"
  aura: "#F4F1FD"
  discBlue: "#95C8DB"
  discDefault: "#FAEFE0"
  cancelFill: "#E5E0DA"
  dangerFill: "#7C5157"
  danger: "#A03E40"
typography:
  dateTitle:
    fontFamily: Fraunces
    fontSize: 26.5px
    fontWeight: 400
    lineHeight: 36px
  section:
    fontFamily: Roboto
    fontSize: 12.3px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0.89px
  placeholder:
    fontFamily: Roboto
    fontSize: 13.15px
    fontWeight: 400
    lineHeight: 16px
  taskTitle:
    fontFamily: Roboto
    fontSize: 14.3px
    fontWeight: 500
    lineHeight: 17px
  body:
    fontFamily: Roboto
    fontSize: 16px
    fontWeight: 400
    lineHeight: 20px
  button:
    fontFamily: Roboto
    fontSize: 14.5px
    fontWeight: 500
    lineHeight: 20px
  timerDigits:
    fontFamily: Fraunces
    fontSize: 45px
    fontWeight: 400
    lineHeight: 52px
spacing:
  page: 16px
  pillToCard: 8px
  sectionGap: 20px
  cardHeight: 48.8px
  pillHeight: 36px
rounded:
  pill: 18px
  card: 14px
  field: 14px
  groupCard: 25.4px
  menuSheet: 34px
  editSheet: 37.6px
  dialog: 24px
---

## Overview

Based on Tiimo Android 1.9.2, English, light theme, default font scale, on a 393 dp wide phone frame. This document covers the first release batch only — the Today plan (empty, with a task, DONE expanded), the task action menu, the Update-task sheet, the focus timer (running, paused, empty) and the delete confirmation. It is not a complete system for every Tiimo screen.

## Colors

Pages sit on `surface`; sheets and menus on `sheet`; raised controls (GET PRO, header circles, the navigation bar, form buttons) are `card` white lifted by a soft shadow rather than an outline. Time-of-day pills carry their own tint (ANYTIME and DONE use `sheet`). Text is `ink`; placeholder copy and inactive affordances use `muted`. `primary` is the single accent: selected weekday, save button, marker chips and the focus progress arc. Destructive actions use `danger` text and a `dangerFill` button.

## Typography

Sans text is Roboto throughout — the Android system face the app renders with. The app's serif (date headline, focus title, day numbers, timer digits, the task-name field) is Recoleta, a commercial face; this prototype substitutes the open Fraunces, with different glyph shapes and font metrics. Uppercase labels are small (12.3) and tracked out rather than set large. Weights are regular except task titles, sheet headings and buttons (medium).

## Layout

Everything is laid out on a 393 dp frame with 16 dp side margins. The Today page: a 40 dp header row (GET PRO centred, settings and add circles right), the serif date with the month right-aligned, a seven-day strip, then time-of-day sections — a 36 dp pill, 8 dp to a 48.8 dp card, 20 dp to the next section. The navigation bar floats 16.9 dp above the bottom with the avatar control to its right; lower rows scroll under it.

## Elevation & Depth

White controls float on a ~4 dp soft shadow. The action menu dims the page with a flat 30% black scrim and no blur. The delete dialog blurs the page lightly (2px) and dims it about 5%. The Update-task sheet fills the frame, showing the dimmed page only at its rounded top corners.

## Shapes

Pills are fully rounded; cards 14 dp; form fields 14 dp with a 1 dp `#EDEBE9` border and a label sitting on the top border; group cards 25.4 dp; the action menu sheet 34 dp and the edit sheet 37.6 dp at the top corners; the dialog 24 dp. Empty-section cards use a 1.5 dp dashed `dash` border.

## Components

Today sections collapse and expand; an empty section shows its own prompt ("Anytime today works") and an add disc; a populated section adds a round add control to its pill row. Task cards carry a marker chip, title, duration and a completion ring; completed tasks move to DONE with undo. The action menu lists Make a copy, Move to list, Reschedule task, Reschedule for tomorrow, Suggest breakdown, Start task, Edit task and Delete task. The Update-task sheet holds Task name (serif) with its marker, Time of day, Date and Duration (m), Repeat, one card for Sub-tasks and Sub-task timers, notes, and delete / start / Move to list. The focus timer shows the task title and start → end times, a lavender ring around a disc in the task colour, and the countdown in serif digits; a purple arc grows clockwise from the top as time passes, one full turn per task duration, with a white arrow at its head. Icons use the same open icon families the app ships (Material Design Icons, Feather, Ant Design, Font Awesome 4).

## Local interaction state

Today and To-do keep their section-collapse choices across navigation. Reminder switches retain local selections without requesting notification permission. The sample onboarding flow keeps its answers, per-part routine choices and marketing selection when going back; browser Back and Escape step through that flow. Completing or closing the flow returns to the surrounding prototype.

A focus session retains its initial duration while task defaults are edited. The countdown stops at zero; an exhausted session cannot resume. Task completion remains a separate Today action. Numeric duration validation rejects values that cannot form a safe, representable deadline. All these values are page-session state, cleared on reload.

## Responsive Behavior

Mobile-first at 393 dp, with a centred phone frame on wider screens. The day strip shares the available width and long forms scroll. The date picker's fixed internal layout retains limitations on narrow viewports.

## Known Gaps

- Task markers: the app assigns an emoji from the task's name automatically; this prototype always uses 📝.
- Serif: Fraunces stands in for Recoleta; glyph shapes and font metrics differ.
- A few vector icons (To-do and Focus navigation icons, time-of-day pill icons, the breakdown icon) are drawn approximations.
- Timer expiry is local prototype behavior; original native expiry, alarms, notification scheduling and automatic task completion are not established.
- To-do currently shows empty priority groups. Sub-task editing, moving tasks to lists and breakdown suggestions are unavailable.
- Profile and settings are prototype surfaces. The account flow does not authenticate, save health information to a service, subscribe to marketing or sync tasks.
- Complete App coverage, all-browser compatibility and native Android/iOS acceptance are not established.
