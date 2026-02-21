# Google Forms Lite

Monorepo for a lightweight form builder (client + server).

## Structure

- **client** – React + Vite + TypeScript + Tailwind CSS + React Router
- **server** – Node.js + TypeScript + Apollo Server (GraphQL), in-memory storage

## Setup

```bash
npm install
```

## Development

Run both client and server:

```bash
npm run dev
```

- Client: http://localhost:5173  
- Server (GraphQL): http://localhost:4000  

Or run individually:

```bash
npm run dev:client   # client only
npm run dev:server   # server only
```

## Build

```bash
npm run build
```
