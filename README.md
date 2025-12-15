# Stock Broker Dashboard

A modern, real-time stock trading dashboard built with Next.js 16, React 19, and TypeScript. This application provides a comprehensive interface for monitoring portfolios, tracking watchlists, and analyzing market trends.

![Stock Dashboard](https://img.shields.io/badge/Next.js-16.0.7-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=flat-square&logo=tailwind-css)

## Features

- **Real-time Stock Monitoring** - Track live stock prices and market data
- **Portfolio Management** - View and manage your stock portfolio with real-time updates
- **Watchlist** - Create and manage custom watchlists for stocks you're interested in
- **Market Analysis** - Access comprehensive market data and trends
- **User Authentication** - Secure login and signup functionality
- **Dark Mode Support** - Elegant light and dark theme options
- **Responsive Design** - Fully responsive interface that works on all devices
- **Real-time Charts** - Interactive charts powered by Recharts
- **WebSocket Support** - Live data updates using WebSocket connections

## Tech Stack

### Frontend
- **Next.js 16.0.7** - React framework with App Router
- **React 19.2.0** - Latest React with new features
- **TypeScript 5.x** - Type-safe development
- **Tailwind CSS 4.1.9** - Modern utility-first CSS framework
- **shadcn/ui** - High-quality UI components built on Radix UI
- **Lucide React** - Beautiful icon library

### Data & State Management
- **SWR 2.3.7** - Data fetching and caching
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Charts & Visualization
- **Recharts 2.15.4** - Composable charting library

### UI Components
- **Radix UI** - Unstyled, accessible component primitives
- **Sonner** - Toast notifications
- **next-themes** - Theme management

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.17 or later) - [Download here](https://nodejs.org/)
- **npm** (v9 or later) or **pnpm** (v8 or later) or **yarn** (v1.22 or later)
- **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

### Recommended VS Code Extensions

- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

## Getting Started

### 1. Extract the ZIP File

Extract the project ZIP file to your desired location.

### 2. Open in VS Code

Open VS Code and select **File > Open Folder**, then navigate to the extracted project folder.

Alternatively, you can open it from the terminal:

\`\`\`bash
cd path/to/stockdashboard1
code .
\`\`\`

### 3. Install Dependencies

Open the integrated terminal in VS Code (**View > Terminal** or `` Ctrl+` ``) and run:

\`\`\`bash
npm install
\`\`\`

Or if you prefer pnpm or yarn:

\`\`\`bash
# Using pnpm
pnpm install

# Using yarn
yarn install
\`\`\`

This will install all the required dependencies listed in `package.json`.

### 4. Run the Development Server

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

Or with pnpm/yarn:

\`\`\`bash
# Using pnpm
pnpm dev

# Using yarn
yarn dev
\`\`\`

The application will start at [http://localhost:3000](http://localhost:3000)

### 5. Open in Browser

Open your browser and navigate to:

\`\`\`
http://localhost:3000
\`\`\`

You should see the Stock Dashboard application running.

## Project Structure

\`\`\`
stockdashboard1/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── auth/               # Authentication endpoints
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── market/             # Market data endpoint
│   │   ├── stocks/             # Stock data endpoint
│   │   ├── subscribe/          # WebSocket subscription
│   │   ├── unsubscribe/        # WebSocket unsubscribe
│   │   └── watchlist/          # Watchlist management
│   ├── dashboard/              # Dashboard pages
│   │   ├── market/             # Market analysis page
│   │   ├── settings/           # User settings page
│   │   ├── watchlist/          # Watchlist page
│   │   └── page.tsx            # Main dashboard page
│   ├── login/                  # Login page
│   ├── signup/                 # Signup page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page (redirect logic)
│   └── globals.css             # Global styles
│
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ... (40+ components)
│   └── theme-provider.tsx      # Theme provider component
│
├── hooks/                      # Custom React hooks
│   ├── use-mobile.tsx         # Mobile detection hook
│   └── use-toast.ts           # Toast notification hook
│
├── lib/                        # Utility functions
│   └── utils.ts               # Common utilities (cn function, etc.)
│
├── public/                     # Static assets
│   ├── icon.svg
│   ├── icon-dark-32x32.png
│   └── icon-light-32x32.png
│
├── next.config.mjs            # Next.js configuration
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
\`\`\`

## Available Scripts

In the project directory, you can run:

### `npm run dev`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload when you make changes.

### `npm run build`
Builds the app for production to the `.next` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm start`
Starts the production server. You must run `npm run build` first.

### `npm run lint`
Runs ESLint to check for code quality issues.

## Authentication

The application uses a client-side authentication system with localStorage. By default, the following test credentials are available:

**Default User:**
- Email: `user@example.com`
- Password: `password123`

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

> **Note:** This is a demo application using localStorage for authentication. For production use, implement proper server-side authentication with a database and secure session management.

## Features Guide

### Dashboard
The main dashboard provides an overview of:
- Total portfolio value
- Today's profit/loss
- Number of stocks in portfolio
- Real-time portfolio performance chart

### Watchlist
Create and manage a personalized watchlist of stocks you want to monitor. Features include:
- Add/remove stocks
- Real-time price updates
- Price change indicators
- Quick access to stock details

### Market Analysis
View comprehensive market data including:
- Market indices (S&P 500, NASDAQ, Dow Jones)
- Top gainers and losers
- Market trends and statistics

### Settings
Customize your experience:
- Update profile information
- Change notification preferences
- Theme selection (light/dark mode)

## Customization

### Changing Theme Colors

Edit `app/globals.css` to modify the color scheme. The project uses CSS variables for theming:

\`\`\`css
:root {
  --background: oklch(0.98 0.002 280);
  --foreground: oklch(0.15 0.01 280);
  --primary: oklch(0.32 0.06 280);
  /* ... more variables */
}
\`\`\`

### Adding New Components

The project uses shadcn/ui components. To add a new component:

1. Create a new file in `components/ui/`
2. Import and use it in your pages

### Environment Variables

Create a `.env.local` file in the root directory for environment-specific variables:

\`\`\`env
# Example environment variables
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WS_URL=ws://localhost:3000
\`\`\`

## Building for Production

To create a production build:

\`\`\`bash
npm run build
npm start
\`\`\`

The production build is optimized for performance with:
- Minified JavaScript and CSS
- Optimized images
- Server-side rendering
- Static page generation where possible

## Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy this Next.js app is to use [Vercel](https://vercel.com):

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Click "Deploy"

### Deploy to Other Platforms

You can also deploy to:
- **Netlify** - Configure build command: `npm run build`, publish directory: `.next`
- **AWS Amplify** - Use the Next.js SSR hosting option
- **Railway** - Connect your Git repository and deploy
- **Render** - Use the Next.js template

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can specify a different port:

\`\`\`bash
PORT=3001 npm run dev
\`\`\`

### Module Not Found Errors

If you encounter module errors after cloning:

\`\`\`bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
\`\`\`

### TypeScript Errors

Ensure you're using TypeScript 5.x:

\`\`\`bash
npm install -D typescript@latest
\`\`\`

### Build Errors

Clear Next.js cache and rebuild:

\`\`\`bash
rm -rf .next
npm run build
\`\`\`

## Performance Optimization

The application includes several performance optimizations:

- **Code Splitting** - Automatic route-based code splitting
- **Image Optimization** - Next.js automatic image optimization
- **Font Optimization** - Self-hosted fonts with next/font
- **Caching** - SWR for efficient data fetching and caching
- **Analytics** - Vercel Analytics integration

## Browser Support

This application supports all modern browsers:

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Contributing

If you'd like to contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, questions, or feature requests:

- Open an issue on the repository
- Contact the development team
- Check the documentation

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)

---

**Happy Trading! 📈**
