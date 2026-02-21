# Google Forms Lite Clone

A simplified full-stack clone of Google Forms built with a focus on modern web architecture, type safety, and clean code principles.

## 🚀 Tech Stack

- **Monorepo Structure:** Managed via npm workspaces.
- **Front-End:** React, TypeScript, Redux Toolkit (RTK), RTK Query, Tailwind CSS.
- **Back-End:** Node.js, TypeScript, Apollo Server (GraphQL).
- **Tooling:** GraphQL Code Generator (for end-to-end type safety), ESLint, Prettier.

## 📋 Core Features

- **Monorepo Architecture:** Client and Server packages in a single repository with shared scripts.
- **Form Builder:** Create dynamic forms with various question types (Text, Multiple Choice, Checkboxes, Date).
- **Form Filler:** Responsive UI for filling out created forms.
- **Response Tracking:** View and analyze submitted responses for each form.
- **Type Safety:** Automated TypeScript hooks generation from GraphQL schema.
- **Validation:** Client-side validation for required fields and specific formats.

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone [https://github.com/LebedenkoAndrii/SimpleGoogleForm.git](https://github.com/LebedenkoAndrii/SimpleGoogleForm.git)
cd SimpleGoogleForm
```

### 2. Install Dependencies
From the root directory:
```bash
npm install
```

### 3. Start Development Environment
Run both client and server concurrently:

```bash
npm run dev
```
- **Client:** http://localhost:5173

- **Server:** http://localhost:4000/graphql

### 4.Generate Types (Optional)
If the GraphQL schema changes, update types and hooks:

```bash
npm run codegen --workspace=client
```

### Evaluation Criteria Met
- [x] Functional Monorepo setup.

- [x] Clean component structure.

- [x] RTK Query integration with CodeGen.

- [x] GraphQL schema implementation.

- [x] Client-side form validation.

- [x] Error handling & loading states.
