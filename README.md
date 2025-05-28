# Go Alchemy 🔮

[![Version](https://img.shields.io/badge/version-0.1.2-blue.svg)](package.json)
[![React Native](https://img.shields.io/badge/React%20Native-0.76.6-green.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2052-blue.svg)](https://expo.dev/)

**Go Alchemy** is a React Native mobile application for studying and practicing Go (Weiqi/Baduk) problems. The app provides an interactive platform for improving your Go skills through various problem categories including Tsumego, Tesuji, Joseki, Opening, Sabaki, and Shape problems.

## ✨ Features

- **📱 Cross-platform**: Built with React Native and Expo for iOS and Android
- **🧩 Multiple Problem Categories**: 
  - Tsumego (Life & Death)
  - Tesuji (Tactical problems)
  - Joseki (Corner sequences)
  - Opening (Fuseki)
  - Sabaki (Light play)
  - Shape (Good shape principles)
- **📅 Daily Problems**: Curated daily problem sets for consistent practice
- **🎨 Interactive Go Board**: Full-featured Go board with gesture support
- **💾 Problem Navigation**: Browse and solve problems with smooth navigation
- **🌙 Theme Support**: Light and dark theme options
- **📊 Redux State Management**: Persistent app state and user progress
- **🔄 SGF Support**: Standard Go file format integration

## 🛠 Tech Stack

- **Framework**: React Native 0.76.6 with Expo SDK 52
- **Router**: Expo Router with file-based routing
- **State Management**: Redux Toolkit with Redux Persist
- **UI Library**: React Native Elements (RNEUI)
- **Go Engine**: @sabaki libraries for SGF parsing and game tree management
- **Navigation**: React Navigation v7
- **Storage**: AsyncStorage with Expo SecureStore

## 📁 Project Structure

```
go-alchemy/
├── app/                      # Expo Router pages
│   ├── _layout.js           # Root layout with tab navigation
│   ├── index.js             # Home screen
│   ├── daily/               # Daily problems section
│   ├── problems/            # Problem browser
│   ├── settings.js          # App settings
│   └── about.js             # Information page
├── assets/                  # Static assets
│   ├── problems/            # SGF problem files
│   └── images/              # Images and thumbnails
├── components/              # Reusable UI components
│   ├── GoBoard.tsx          # Interactive Go board
│   ├── ControlPanel.tsx     # Game controls
│   ├── ProblemCard.tsx      # Problem preview cards
│   └── ...
├── contexts/                # React contexts
│   ├── GameContext.tsx      # Game state management
│   ├── ProblemContext.tsx   # Problem navigation context
│   └── GameTreeContext.tsx  # SGF game tree context
├── store/                   # Redux store configuration
├── utils/                   # Utility functions
├── types/                   # TypeScript type definitions
└── themes/                  # Theme configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/go-alchemy.git
cd go-alchemy
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npx expo start
```

4. **Run on device/simulator**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

### Development Scripts

```bash
npm start           # Start Expo development server
npm run android     # Run on Android emulator
npm run ios         # Run on iOS simulator
npm run web         # Run web version
npm test            # Run tests
npm run lint        # Run ESLint
npm run build       # Build for production
```

## 📖 Core Features Documentation

### 🏠 Home Screen (`app/index.js`)
The main landing page featuring app branding and quick navigation to problem categories.

### 🧩 Problems Section (`app/problems/`)
- **Index** (`index.js`): Grid view of all problem categories
- **Category View** (`[category].tsx`): Grid of problems within a selected category
- **Problem Solver** (`problem/[id].tsx`): Interactive Go board for solving individual problems

### 📅 Daily Problems (`app/daily/`)
- **Daily Overview** (`index.tsx`): Today's curated problems across categories
- **Daily Problem Solver** (`problem/[id].tsx`): Individual daily problem interface

### ⚙️ Settings (`app/settings.js`)
User preferences including theme selection, board settings, and app configuration.

### ℹ️ About (`app/about.js`)
App information, version details, and acknowledgments.

## 🎯 Problem Categories

### Tsumego (詰碁)
Life and death problems focusing on capturing stones or making living groups.

### Tesuji (手筋)
Tactical problems featuring clever moves and combinations.

### Joseki (定石)
Standard corner opening sequences and their variations.

### Opening (布石)
Whole-board opening strategy and fuseki patterns.

### Sabaki (捌き)
Light, flexible play in difficult situations.

### Shape (形)
Good and bad shapes, efficient stone placement.

## 🔧 Configuration

### App Configuration (`app.config.js`)
Expo configuration including app metadata, permissions, and build settings.

### Metro Configuration (`metro.config.js`)
Metro bundler configuration for React Native assets and transformations.

### Theme Configuration (`themes/`)
Centralized theme management supporting light and dark modes.

## 📱 Navigation Structure

The app uses Expo Router with a tab-based navigation structure:

```
├── Home (index)
├── Daily Problems (daily)
├── Problems (problems)
├── Settings (settings)
└── About (about)
```

Each tab contains its own stack navigation for detailed views.

## 🎮 Game Engine

The app integrates several Go-specific libraries:

- **@sabaki/sgf**: SGF file parsing and manipulation
- **@sabaki/immutable-gametree**: Game tree data structure
- **@sabaki/go-board**: Go board logic and utilities

## 💾 State Management

- **Redux Store**: Centralized application state
- **Redux Persist**: Automatic state persistence
- **Local Storage**: User preferences and progress tracking

## 🎨 UI/UX

- **React Native Elements**: Consistent UI components
- **Custom Theme System**: Dynamic theming support
- **Responsive Design**: Adaptive layouts for different screen sizes
- **Gesture Handling**: Touch and pan gestures for board interaction

## 🔄 Problem Loading

Problems are loaded from SGF files stored in the assets directory:
- Each problem has metadata including difficulty, category, and board range
- Problems support both full-board and corner-specific views
- Automatic thumbnail generation for problem previews

## 🌙 Theme System

The app supports multiple themes:
- Light mode (default)
- Dark mode
- Custom theme configurations
- Per-component theme overrides

## 📊 Analytics & Tracking

- User progress tracking
- Problem completion statistics
- Daily practice streaks
- Performance metrics

## 🚀 Building for Production

### Android
```bash
npm run build:production
```

### iOS (requires Apple Developer account)
```bash
eas build --platform ios --profile production
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Sabaki Project**: For excellent Go-related JavaScript libraries
- **Go Community**: For problem contributions and feedback
- **Expo Team**: For the amazing development platform
- **React Native Community**: For continuous improvements and support

## 📮 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/go-alchemy/issues) page
2. Create a new issue with detailed information
3. Join the discussion in our community channels

---

**Happy Go studying! 🎯**

*Remember: The master has failed more times than the beginner has even tried.*
