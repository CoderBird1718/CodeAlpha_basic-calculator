#  Vrindavan Calculator · राधे राधे

> *कृष्णम् वन्दे जगद्गुरुम् — A devotional calculator draped in liquid gold.*

A fully functional calculator wrapped in a Radha Krishna–inspired aesthetic. Built with pure HTML, CSS, and vanilla JavaScript — featuring a liquid glass card, animated orbs, floating Sanskrit mantras, dual themes, and full keyboard support. Zero dependencies.

##  Live Preview 


## Features

###  Design & Theme
- **Liquid Glass Card** — deep backdrop blur, frosted borders, inner glow, gold shimmer sheen
- **Dual Theme** — *Yamuna Night* (dark indigo-gold) and *Vrindavan Sunrise* (warm honey-cream) with toggle effect
- **Animated Background** — four drifting colour orbs (gold, blue, rose, purple) with slow parallax movement
- **Floating Mantras** — "राधे राधे" petals drift continuously from top to bottom
- **Peacock Icon** — gently sways with a subtle gold glow
- **Cinzel + Crimson Pro + DM Mono** — three carefully paired typefaces for branding, labels, and numbers
- **Error shake animation** — the whole card shakes on division by zero
- **Result pop animation** — display pulses gold on equals

###  Calculator Logic
- Standard arithmetic — `+` `−` `×` `÷`
- **Chained operations** — calculates on the fly as operators are pressed
- **Live preview** — shows the pending result while typing the second operand
- **History line** — shows the previous expression above the main display
- **Backspace** — delete last digit with `Backspace` key
- **Toggle sign** `±` and **percent** `%`
- **AC / C** — label switches intelligently (AC when clean, C when mid-entry)
- **Adaptive font size** — display shrinks automatically for long numbers
- Floating point noise suppression via `toPrecision(12)`
- Division by zero caught and displayed gracefully

###  Keyboard Support

| Key | Action |
|-----|--------|
| `0–9` | Digit input |
| `+ - * /` | Operators |
| `Enter` or `=` | Evaluate |
| `Backspace` | Delete last digit |
| `Escape` / `Delete` | Clear |
| `.` or `,` | Decimal point |
| `%` | Percent |
| `x` | Multiply (alias) |

Pressed keys visually flash the matching on-screen button.

###  Micro-interactions
- **Ripple effect** on every button click
- **Button flash** feedback on keyboard presses
- **Active operator highlight** — current pending op glows with a gold ring
- **Theme button** rotates and scales on hover


##  File Structure

```
vrindavan-calculator/
│
├── index.html    # Markup — layout, buttons, background layers
├── style.css     # All styles — themes, glass card, animations, responsive
└── calc.js       # Calculator logic, keyboard handler, ripple, render
```

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | Semantic HTML5 |
| Styling | CSS3 — custom properties, backdrop-filter, keyframe animations, CSS Grid |
| Scripting | Vanilla JavaScript ES6+ — no frameworks, no dependencies |
| Fonts | Google Fonts — Cinzel · Crimson Pro · DM Mono |

##  Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| `≥ 1200px` | Larger card (420px), 70px buttons |
| `≤ 768px` | Tablet — compact spacing |
| `≤ 480px` | Mobile — full-width card, 56px buttons |
| `≤ 360px` | Small phone — 50px buttons |
| Landscape short screen | Condensed display panel |
