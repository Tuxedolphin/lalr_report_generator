# LALR Report Generator

The **LALR Report Generator** is a React + TypeScript application built with Vite. It allows users to create, manage, and download standardized reports for **Late Activation (LA)** and **Late Response (LR)** incidents. The app features a modern Material-UI design, seamless navigation, and robust report generation capabilities using `pptxgenjs`.

## Features

- **Dynamic Report Generation**: Generate PowerPoint reports for LA and LR incidents.
- **Step-by-Step Forms**: Guided forms for entering incident details, ACES information, and footage data.
- **Report History**: View, edit, or delete previously created reports.
- **Downloadable Reports**: Export reports as `.pptx` files.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Modern UI**: Built with Material-UI for a clean and intuitive interface.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Framework**: Material-UI
- **State Management**: React Context API
- **Database**: Dexie.js (IndexedDB)
- **Report Generation**: `pptxgenjs`
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/tuxedolphin/lalr_report_generator.git
   cd lalr_report_generator
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm run dev
   ```

4. Open the app in your browser:

   ```plaintext
   http://localhost:5173
   ```

## Scripts

- `pnpm run dev`: Start the development server.
- `pnpm run build`: Build the app for production.
- `pnpm run preview`: Preview the production build.
- `pnpm run deploy`: Deploy the app to GitHub Pages.
- `pnpm run lint`: Run ESLint to check for code issues.
- `pnpm run format`: Format code with Prettier.

## Deployment

The app is deployed to GitHub Pages. To deploy:

1. Build the app:

   ```bash
   pnpm run build
   ```

2. Deploy to GitHub Pages:

   ```bash
   pnpm run deploy
   ```

The app will be available at: [https://tuxedolphin.github.io/lalr_report_generator/](https://tuxedolphin.github.io/lalr_report_generator/)

## Folder Structure

```plaintext
lalr_report_generator/
├── src/
│   ├── app/
│   │   ├── pages/          # Main pages of the app
│   │   │   ├── AddEntryPage.tsx       # Add Entry page
│   │   │   ├── Home.tsx               # Home page
│   │   │   ├── DownloadPage.tsx       # Download page
│   │   │   ├── History.tsx            # History page
│   │   │   ├── forms/                 # Step-by-step form components
│   │   │   │   ├── IncidentInfoForm.tsx
│   │   │   │   ├── AcesInfoForm.tsx
│   │   │   │   ├── FirstFootageForm.tsx
│   │   │   │   ├── SecondFootageForm.tsx
│   ├── features/
│   │   ├── generateReport/ # Report generation logic
│   │   │   ├── generateReport.ts
│   │   │   ├── generateLaReport.ts
│   │   │   ├── generateLrReport.ts
│   │   │   ├── utils/      # Helper functions for report generation
│   │   │       ├── helperFunctions.ts
│   │   ├── db/             # Database utilities (Dexie.js)
│   │   ├── LocalStorage/   # LocalStorage utilities
│   ├── context/            # React Context for global state
│   ├── components/         # Reusable UI components
│   ├── classes/            # Core data model classes
│   │   ├── Report.ts       # Report data structure
│   │   ├── Time.ts         # Time utilities
│   │   ├── ReportImage.ts  # Image handling
│   ├── types/              # TypeScript type definitions
│   │   ├── types.ts
│   ├── utils/              # General helper functions and constants
│   │   ├── constants.ts
│   ├── main.tsx            # App entry point
├── public/                 # Static assets
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── package.json            # Project metadata and dependencies
├── README.md               # Project documentation
├── LICENSE                 # License file
```

## Key Components

### Pages

- **Home**: Landing page with quick actions for creating new reports or viewing history.
- **Add Entry**: Multi-step form for entering report details.
- **History**: View, edit, or delete previously created reports.
- **Download**: Displays report generation progress and download options.

### Core Features

- **Report Generation**: Uses `pptxgenjs` to create PowerPoint reports.
- **Database**: Stores reports locally using Dexie.js (IndexedDB).
- **LocalStorage**: Tracks the current working report.

## Contributing

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add your message here"
   ```

4. Push to your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.txt) file for details.

---

Happy reporting! 🚒📊
