# Ants Simulation (ants-js)

A JavaScript-based simulation of ant colony behavior driven by scent trails.

## Features

- **Scent Trails**: Ants emit various scents and follow the traces of others.
- **Environmental Objects**: Includes sugar sources, an ant nest and various obstacles.
- **Evolution**: Ants evolve over time, optimizing their probe length for more efficient sugar collection.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd ants-js
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Development

Start the development server with hot-reload:

```bash
npm run dev
```

### Building for Production

Build the project for production (output in `dist/`):

```bash
npm run build
```

Preview the production build:

```bash
npm run serve
```

### Testing

Run the unit tests:

```bash
npm run test
```
