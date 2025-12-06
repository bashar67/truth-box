# TruthBox - Anonymous Messaging Platform

A complete React front-end application for anonymous messaging, built with React 18, TypeScript, Tailwind CSS, and modern best practices.

## 🚀 Features

- **Authentication System**

  - Email/Password login and signup
  - Google OAuth integration
  - Forget password flow with OTP verification
  - Password reset functionality

- **User Profile Management**

  - Update profile information (firstname, lastname, gender)
  - Change password
  - Delete account (with password confirmation)
  - Freeze account (with password confirmation)

- **Anonymous Messaging**

  - Receive anonymous messages
  - Shareable user URL for others to send messages
  - Delete messages
  - View message history

- **Theme Support**
  - Light/Dark mode toggle
  - Persistent theme preference
  - System preference detection

## 🛠️ Technology Stack

- **React 18+** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Hook Form + Zod** for form validation
- **React Router DOM v6** for routing
- **Axios** for API calls
- **React Hot Toast** for notifications
- **React Helmet Async** for SEO
- **Google OAuth** for social authentication

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running (see API Requirements below)
- Google OAuth Client ID (for Google login)

## 🔧 Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd truthbox
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_API_BASE_URL=https://your-backend-api.com
   VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔌 Backend API Requirements

The application expects the following API endpoints to be available:

### Authentication

- `POST /auth/login` - Login with email/password
- `POST /auth/signup` - Create new account
- `POST /auth/logout` - Logout user
- `POST /auth/google` - Google OAuth authentication
- `POST /auth/forget-password` - Send OTP to email
- `POST /auth/verify-otp` - Verify OTP code
- `POST /auth/reset-password` - Reset password with OTP

### User Management

- `PUT /user/update` - Update user profile
- `POST /user/change-password` - Change password
- `DELETE /user/delete` - Delete account
- `POST /user/freeze` - Freeze account

### Messages

- `GET /messages` - Fetch user messages
- `DELETE /messages/:id` - Delete a message

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn UI components
│   ├── CustomInput.tsx  # Form input component
│   ├── CustomSelect.tsx # Select dropdown component
│   ├── Header.tsx       # App header with navigation
│   ├── Loader.tsx       # Loading spinner
│   ├── Modal.tsx        # Modal dialog
│   ├── ThemeToggle.tsx  # Dark/light mode toggle
│   └── PrivateRoute.tsx # Protected route wrapper
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication state
│   └── ThemeContext.tsx # Theme management
├── hooks/               # Custom React hooks
│   └── useApi.ts        # API call hook
├── layouts/             # Layout components
│   └── MainLayout.tsx   # Main app layout
├── lib/                 # Utilities
│   ├── axios.ts         # Axios instance with interceptors
│   └── utils.ts         # Utility functions
├── pages/               # Page components
│   ├── Index.tsx        # Landing page
│   ├── Login.tsx        # Login page
│   ├── Signup.tsx       # Signup page
│   ├── ForgetPassword.tsx
│   ├── OtpVerification.tsx
│   ├── ResetPassword.tsx
│   ├── Messages.tsx     # Messages dashboard
│   ├── Dashboard.tsx    # Profile settings
│   └── ChangePassword.tsx
├── utils/               # Helper functions
│   └── validationSchemas.ts # Zod validation schemas
├── App.tsx              # App root with routing
└── main.tsx             # App entry point
```

## 🎨 Design System

The app uses a modern design system with:

- **Primary Color**: Deep Blue (#2563EB)
- **Secondary Color**: Teal (#0D9488)
- **Accent Color**: Orange (#F97316)
- Gradient overlays for visual appeal
- Smooth transitions and animations
- Responsive design for all screen sizes

## 🔐 Security Features

- JWT token-based authentication
- Axios interceptors for automatic token attachment
- Protected routes requiring authentication
- Password confirmation for destructive actions
- Client-side validation with Zod
- Secure password handling (never logged)

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast colors
- Screen reader friendly

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly UI elements
- Optimized for all screen sizes

## 🚀 Performance Optimizations

- Lazy loading for route components
- Code splitting with dynamic imports
- Optimized images with loading states
- Minimal bundle size
- React.memo and useCallback where needed

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or issues, contact the project maintainer.
