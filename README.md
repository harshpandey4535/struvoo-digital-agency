# STRUVOO

A responsive, cinematic agency website built with React, TypeScript, Vite, Tailwind CSS v4, and Motion.

## Run

```sh
npm install
npm run dev
npm run build
```

## Browser Tests

```sh
npx playwright install --with-deps chromium
npx playwright test
```

The test suite covers service exploration, concept project navigation, project-brief validation and downloads, keyboard navigation, mobile menus, reduced-motion preferences, and overflow at five viewport widths.

## Content And Launch Setup

- Edit services, concept projects, agency copy, contact email, and social URLs in `src/data/content.ts`.
- Brand geometry lives in `src/components/Brand.tsx`. This is a vector reconstruction from the supplied reference, since original logo files were not available in the project. Replace with approved SVG artwork for exact production fidelity. The logo is not generated text.
- Update `public/favicon.svg` if the approved symbol artwork changes.
- Project imagery is generated demonstration artwork. Both concepts are explicitly labeled as independent explorations, not client work.
- Contact details and social URLs intentionally remain unconfigured. No real client names, results, or testimonials are invented.
- The contact form creates a local, downloadable project brief. It never claims to send a message. Setting `siteConfig.contactEmail` enables an optional mail-client link with the prepared brief. Connect a real submission endpoint separately if direct delivery is needed.
- Update the page title, social sharing metadata, and production image URL in `index.html` for the final deployment domain.

Images and the variable Manrope font are served locally. The font's license is included in `public/fonts/OFL.txt`. Motion honors reduced-motion preferences and touch devices do not receive the desktop custom cursor.
