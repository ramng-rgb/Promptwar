# AeroPulse — Urban Air Quality & Smog Inversion Assistant

Live Demo: [https://ramng-rgb.github.io/Promptwar/](https://ramng-rgb.github.io/Promptwar/)

AeroPulse is an open-source web application for monitoring ambient air quality, understanding particulate matter concentrations, and adopting low-emission household practices during winter smog and thermal inversion conditions.

---

## Key Features

- **Atmospheric Overview**: Live Air Quality Index (US EPA scale) with category indicators from Good to Hazardous.
- **Multi-Pollutant Tracking**: Real-time concentrations for PM2.5, PM10, Carbon Monoxide (CO), Sulfur Dioxide (SO2), Nitrogen Dioxide (NO2), and Ground Ozone (O3) against safe exposure baselines.
- **Interactive Multi-Station Map**: Interactive geospatial map built on Leaflet displaying neighborhood monitoring stations and dispersion ranges.
- **Air Quality Scale Guide**: Detailed category breakdown explaining health impacts and protective measures for vulnerable groups.
- **Pollution Rankings**: Real-time city comparison leaderboard tracking particulate levels across major urban centers.
- **AI Smog Advisor**: Interactive assistant providing contextual recommendations for household air filtration and commute planning.
- **Household Profile & Actions**: Customizable family vulnerability settings and actionable smog mitigation measures with estimated emission reduction metrics.

---

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet with dark-mode canvas tiles
- **Data Source**: Open-Meteo Air Quality & Weather API
- **Build Tool**: Vite
- **Testing**: Vitest & React Testing Library

---

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ramng-rgb/Promptwar.git
cd Promptwar

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be running at `http://localhost:3000`.

---

## Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Compiles TypeScript and builds production bundles.
- `npm run test`: Runs the automated unit and integration tests.
- `npm run deploy`: Builds and publishes the application to GitHub Pages.

---

## License

This project is licensed under the MIT License.
