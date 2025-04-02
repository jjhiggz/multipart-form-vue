# Multipart Form Vue

A Vue 3 application demonstrating a sophisticated multipart form implementation with currency conversion, compliance checks, and a modular form engine.

## Prerequisites

You need to have [Bun](https://bun.sh) installed on your system. If you haven't installed it yet, you can do so by running:

```bash
# For macOS and Linux:
curl -fsSL https://bun.sh/install | bash

# For Windows:
# First install WSL2, then run the above command in your WSL2 terminal
```

## Getting Started

1. Install dependencies:
```bash
bun install
```

2. Start the backend server (runs on port 3000):
```bash
bun run server
```

3. In a new terminal, start the development server:
```bash
bun run dev
```

4. Open your browser and navigate to [http://localhost:5173](http://localhost:5173)

## Development

- The application uses Vue 3 with TypeScript
- State management is handled through Vue's Composition API
- API calls are managed with TanStack Query v5
- Form validation uses Zod
- The backend is built with Hono

## Testing

To run the test suite:
```bash
bun run test:unit
```

## Project Structure

- `src/` - Frontend application code
  - `components/` - Reusable Vue components
  - `composables/` - Vue composables for shared logic
  - `views/` - Page components
- `server/` - Backend API code
- `shared/` - Shared types and utilities

## Features

- Multi-step form with conditional navigation
- Real-time currency conversion
- Compliance checks for large transactions
- Type-safe form handling
- Responsive design

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

### Compile and Hot-Reload for Development

```sh
bun dev
```

### Type-Check, Compile and Minify for Production

```sh
bun run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
bun lint
```
