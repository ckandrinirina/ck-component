# CK Wheel Games Component

A feature-rich demonstration of interactive wheel games and prize wheels built with React and React Router.

## Features

- 🎡 Customizable spin wheel component
- 🎲 Probability-based prize selection
- 🎨 Flexible theming and styling options
- 🎯 Interactive user experience with animations
- 🏆 Configurable prizes and outcomes
- 🔒 TypeScript for type safety
- 🚀 Server-side rendering with React Router
- 🎉 TailwindCSS for modern styling

## Wheel Component Features

- Configurable wheel segments with custom colors and icons
- Probability-based outcomes for weighted prize distribution
- Smooth spin animations with customizable duration
- Accessible UI with proper ARIA attributes
- Reset functionality to replay the game
- Responsive design that works on various screen sizes

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t wheel-games .

# Run the container
docker run -p 3000:3000 wheel-games
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Customization

The wheel component supports various configuration options:
- Custom colors for segments
- Custom icons for each prize
- Probability weighting for prize distribution
- Button styling and text
- Size and animation duration

---

Built with ❤️ using React Router and TypeScript.