# Repository Instructions

## Project

This is a coding challenge for Outsera.

Requirements and business rules: @docs/REQUIREMENTS.md

## Commands

- 'install': 'npm install' (npm 10+; npm 9 fails with an 'edgesOut' error)
- 'start': 'npm start' (serves on port 4200)
- 'test': 'npm test' (Vitest, single run when not in a TTY)
- 'build': 'npm run build'

## Architecture

- Standalone components, zoneless change detection, signals.
- 'core/api/movie-api.ts' is the only place that calls the API; it returns Observables.
- Components load data with 'rxResource' and show loading/error through 'app-resource-state'.
- Business rules that do not depend on Angular live in pure functions under 'core/utils'.
- Routes are lazy loaded ('app.routes.ts').

## Coding Conventions

- Use Typescript for new application code.
- Follow the Angular CLI file naming (e.g. 'dashboard.ts', no '.component' suffix).
- Use 'inject()', signal inputs/outputs and the built-in control flow ('@if', '@for').
- Format with Prettier ('.prettierrc').

## Stack

- Node.js
- Typescript
- Angular
- Bootstrap

## Repository Structure

- 'docs': coding challenge documentation and requirements
- 'src/app/core': API access, models and pure business rules
- 'src/app/features': dashboard and movie list views
- 'src/app/shared': reusable UI components and pipes
- 'src/testing': test helpers (DOM helpers and fixtures)

## Testing

- Add or update tests when application code changes.
- Mock HTTP: tests must never call the real API.
