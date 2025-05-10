# 🚀 FinanceBuddy

A cross‑platform mobile app built with Expo and React Native that acts as your friendly, AI‑driven financial advisor. Chat with an OpenAI‑powered bot, track personalized financial tasks, and manage your profile all in one place.

---

## 📖 Table of Contents

- [✨ Features](#✨-features)  
- [🔧 Prerequisites](#🔧-prerequisites)  
- [📥 Installation](#📥-installation)  
- [🔑 Environment Variables](#🔑-environment-variables)  
- [▶️ Running the App](#▶️-running-the-app)  
- [📁 Project Structure](#📁-project-structure)  
- [👉 Usage](#👉-usage)  
- [🤝 Contributing](#🤝-contributing)  
- [📄 License](#📄-license)  

---

## ✨ Features

- **🤖 AI Chat Advisor**  
  - Ask anything about budgeting, investing, debt, retirement, and more  
  - Structured JSON responses for easy parsing  
- **📝 Task Tracker**  
  - Auto‑generated financial tasks and reminders  
  - Mark tasks complete and track progress  
- **👤 Profile Manager**  
  - Store your financial snapshot (income, assets, goals, risk profile)  
  - Persistent storage with AsyncStorage  
- **🌙🔆 Theming & Accessibility**  
  - Dark/light mode support  
  - Safe‑area and keyboard handling for seamless UX  

---

## 🔧 Prerequisites

- Node.js v16 or higher  
- Expo CLI (`npm install -g expo-cli`)  
- An OpenAI API key  

---

## 📥 Installation

```bash
git clone https://github.com/yourusername/finance-buddy.git
cd finance-buddy
npm install
# or
yarn install
```

---

## 🔑 Environment Variables

Create a file named `.env` in the project root:

```dotenv
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

> **Note:** Variables prefixed with `EXPO_PUBLIC_` are exposed to the client. Never commit your real API key.

---

## ▶️ Running the App

```bash
npm run dev
# or
yarn dev
```

- 📱 Scan the QR code with Expo Go (iOS/Android)  
- 💻 Press `w` to run on web  

---

## 📁 Project Structure

```
finance-buddy/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx       # Chat screen
│   │   ├── tasks.tsx       # Task list
│   │   └── profile.tsx     # Profile editor
│   └── _layout.tsx         # Navigation & layout
├── components/             # Reusable UI pieces
├── services/               # OpenAI & storage services
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript interfaces
├── utils/                  # Helpers & formatters
├── assets/                 # Images, icons, fonts
├── .env                    # Environment variables
├── package.json
└── tsconfig.json
```

---

## 👉 Usage

1. **Chat Tab**: Ask FinanceBuddy questions.  
2. **Tasks Tab**: Review and complete financial tasks.  
3. **Profile Tab**: Edit your financial data for more personalized advice.

---

## 🤝 Contributing

1. Fork the repo  
2. Create a branch (`git checkout -b feature/YourFeature`)  
3. Commit your changes (`git commit -m "Add feature"`)  
4. Push (`git push origin feature/YourFeature`)  
5. Open a pull request

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE.md) for details.  
