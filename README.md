# LALR Report Generator

A web app for writing Late Activation (LA) and Late Response (LR) incident
reports. Officers fill in the incident details, ACES information and camera
footage notes, and the app produces the report as a PowerPoint file in the
standard format.

Everything runs in the browser. Reports are saved in IndexedDB on the device
and nothing is sent to a server, so incident data stays on the machine it was
entered on.

Live: https://tuxedolphin.github.io/lalr_report_generator/

## What it does

- Step-by-step forms for the incident, ACES data and up to two footage sections
- Separate LA and LR report layouts, generated with `pptxgenjs`
- A history page to reopen, edit or delete saved reports
- Works on desktop and mobile

## Stack

React 18, TypeScript, Vite, Material UI, Dexie (IndexedDB) and `pptxgenjs`.
Hosted on GitHub Pages.

## Running it

```bash
pnpm install
pnpm run dev       # http://localhost:5173
```

Other scripts:

- `pnpm run build`: production build
- `pnpm run preview`: serve the production build locally
- `pnpm run lint` / `pnpm run format`: ESLint and Prettier
- `pnpm run deploy`: build and publish to GitHub Pages

## Code layout

- `src/app/pages`: home, history, download and the multi-step entry form
  (`forms/` holds one component per step)
- `src/features/generateReport`: builds the LA and LR slides
- `src/features/db`: Dexie database access
- `src/classes`: the `Report`, `Time` and `ReportImage` models
- `src/context`: shared state for the report being edited
- `src/components`, `src/utils`, `src/types`: shared UI, constants and types

## License

MIT, see [LICENSE.txt](LICENSE.txt).
