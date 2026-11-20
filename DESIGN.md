# DESIGN.md — Impeccable Design System for AeroPulse

## Visual Tone & Philosophy
- **Atmosphere**: Deep twilight atmospheric baseline (`#090d16` / `#020617`) with vibrant, calibrated environmental indicators.
- **Hierarchy & Urgency**: Clear danger-to-safety visual signifiers (Green -> Amber -> Orange -> Ruby -> Violet -> Deep Crimson).
- **Surface**: Subtle glassmorphism, crisp borders (`border-white/10`), high contrast text for legibility under harsh glare or night conditions.
- **Typography**: Clean, sans-serif high-legibility system typography with mono indicators for numerical metrics (AQI, PM2.5, µg/m³).

## Palette
- **Deep Background**: Slate 950 (`#020617`), Slate 900 (`#0f172a`), Slate 800 (`#1e293b`)
- **Accent Clean Cyan**: Sky 500 (`#0ea5e9`), Cyan 400 (`#22d3ee`)
- **AQI Color Scale**:
  - 0-50 Good: Emerald (`#10b981`)
  - 51-100 Moderate: Amber (`#f59e0b`)
  - 101-150 Sensitive Groups: Orange (`#f97316`)
  - 151-200 Unhealthy: Rose/Red (`#ef4444`)
  - 201-300 Very Unhealthy: Purple (`#a855f7`)
  - 301-500+ Severe Smog/Hazardous: Burgundy/Crimson (`#881337` / `#4c0519`)

## Accessibility Standards
- Minimum text contrast 4.5:1 on all surfaces.
- Sensory aids: Every color code accompanied by explicit label and status icon (not relying on color alone).
- High focus visible outlines for keyboard control.
