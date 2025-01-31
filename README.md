# Multimodal Transport Management System (MTMS)

This project is a Multimodal Transport Management System (MTMS) built using React and Vite. The application aims to streamline and manage various aspects of multimodal transport logistics.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A build tool that provides a faster and leaner development experience for modern web projects.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (>= 14.x)
- npm (>= 6.x) or yarn (>= 1.x)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/cybercrm-app.git
   cd cybercrm-app
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the Application

To start the development server, run:
```sh
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To create a production build, run:
```sh
npm run build
# or
yarn build
```

The build output will be in the `dist` directory.

## Project Structure

- `src/components`: Contains React components.
- `src/assets`: Contains static assets like images.
- `src/styles`: Contains CSS and styling files.

## ESLint Configuration

This project uses ESLint for code linting. The configuration can be expanded to enable type-aware lint rules:

```js
export default tseslint.config({
  languageOptions: {
    // ...existing code...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

Install `eslint-plugin-react` and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // ...existing code...
  settings: { react: { version: '18.3' } },
  plugins: {
    react,
  },
  rules: {
    // ...existing code...
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
