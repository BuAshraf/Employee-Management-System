# Frontend Documntion

## Overview

This frontend is a React application (CRA) for the Employee Management System (EMS). It blends Tailwind utility classes with Bootstrap, uses Framer Motion for micro-interactions, Recharts for charts, lucide-react icons, and a custom i18n layer.

## Tech stack

- React (Create React App)
- React Router (routing)
- Tailwind CSS + Bootstrap (styling)
- Framer Motion (animations)
- Recharts (data visualizations)
- lucide-react (icons)
- react-toastify (toasts)
- Custom i18n via `src/i18n.js`

## App entry and routing

- Entry: `src/App.js`
  - Wraps the app in a Router.
  - Lazy-loads major routes/components via `utils/lazyLoad`.
  - Renders global `Navbar`, `Footer`, and `ToastContainer`.
  - Includes a global background component `PageBackground` behind all pages.
- Routes defined in `<Routes>` for:
  - `/` Home
  - `/dashboard` Dashboard
  - `/employees` list + add/edit/view
  - `/departments` Department list
  - `/reports` Reports
  - `/settings` Settings
  - `/profile` Profile
  - `/admin` Admin Control Panel

## Layout

- `components/layout/Navbar.js`
  - Top navigation with language and theme switchers.
  - High z-index to stay above overlays and background.
  - Uses local EMS SVG for the brand mark.
- `components/layout/Footer.js`
  - Simple footer (lazy loaded).
- `components/layout/PageBackground.js`
  - Fixed SVG pattern using the EMS logo; sits behind all content.
  - Adjust size/lightness via pattern tile size and `scale()`/opacity.

## Dashboard

- `components/dashboard/Dashboard.js` (EnhancedDashboard)
  - Data loading from `services/EmployeeService.js`.
  - Header actions: Home, Date Range selector (week/month/quarter/year), Refresh button.
  - KPIs, department pie, salary bar, trend line, recent employees table, performance metrics, and activity feed.
  - i18n-aware labels and descriptions. Recent additions include keys:
    - `activeEmployees`, `operatingUnits`, `perEmployee`, plus existing `thisMonth`.

## Reports

- `components/reports/Reports.js`
  - Multiple report types (overview, department, salary, trend, attendance).
  - Period filter (week/month/quarter/year).
  - Export placeholders (CSV/PDF/Excel) and email to admin.

## Employees

- `components/employee/EmployeeList.js` for listing, search, filters, and status.
- `components/employee/AddEmployee.js`, `UpdateEmployee.js`, `EmployeeDetails.js` for CRUD.

## Internationalization (i18n)

- File: `src/i18n.js`
  - `useI18n()` hook provides `t(key)` and `lang` switching.
  - English and Arabic locales included.
  - To add a label: add key/value under `en` and `ar`, then use `t('yourKey')`.

## Styling conventions

- Tailwind utilities used alongside Bootstrap classes.
- Common patterns:
  - Buttons: Bootstrap `btn` variants + Tailwind spacing when needed.
  - Cards/tiles: white bg, rounded, subtle border, shadow, Framer hover.

## Icons & charts

- Icons via `lucide-react` (e.g., Users, RefreshCw, Building2).
- Charts via `recharts` (PieChart, BarChart, LineChart, ResponsiveContainer).

## Global background logo

- File: `components/layout/PageBackground.js`
  - Tiled SVG pattern using the EMS logo.
  - Change size: update `<pattern width/height>` and the `scale()` in the `<g ...>` transform.
  - Change lightness: adjust the group `opacity` and element `strokeOpacity`/`opacity`.
- Integrated in `App.js` before the main content; `Navbar`, `main`, and `Footer` use higher z-index to stay on top.

## Services & data

- `src/services/*` contains fetch logic for Employees, Departments, Settings, etc.
- Example: `EmployeeService.getAllEmployees()` powers Dashboard and Lists.

## Theming & language

- Theme: `context/ThemeContext.js` with a simple light/dark/auto select in Navbar.
- Language: Switcher in Navbar toggles `en`/`ar` via `useI18n()`.

## Scripts

- Start dev server: `npm start`
- Build: `npm run build`

## Add a new page

1) Create your component under `src/components/pages/YourPage.js`.
2) Add a lazy import in `App.js` using `lazyLoad`.
3) Add a `<Route path="/your-path" element={<YourPage />} />`.
4) Add navigation entry in `Navbar` if needed.

## Notes

- Stacking context: Navbar wrapper and nav have high z-index (9999) to appear above overlays.
- Some components mix Tailwind + Bootstrap; keep consistency in new code.
- Use `t('key') || 'Fallback'` for user-visible strings when adding new text.
