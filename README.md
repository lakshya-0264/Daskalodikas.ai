# Daskalodikas.ai - Your AI Tutoring Companion

This project is a React-based frontend application designed to provide an interactive learning experience with an AI tutor. It allows users to define a problem or topic, then engages in a conversation with an AI to deepen their understanding and problem-solving skills. The application leverages a backend API for session management and message exchange, offering a seamless and engaging tutoring experience.

## 🚀 Key Features

- **Problem Setting**:  Users can easily input the problem or topic they want to explore.
- **Interactive Conversation**:  Engage in real-time conversations with an AI tutor.
- **Session Management**:  Creates and manages user sessions for personalized learning.
- **Dynamic Routing**:  Uses `react-router-dom` to navigate between the problem setting and conversation pages.
- **Real-time Updates**:  Displays messages in real-time, providing an interactive experience.
- **Copy to Clipboard**: Allows users to copy messages for easy sharing and reference.
- **Exit Session**: Provides a clean way to end the current session and return to the problem setting page.
- **Loading and Error Handling**: Displays loading indicators and error messages for a smooth user experience.
- **Responsive Design**: Built with Tailwind CSS for a modern and responsive user interface.

## 🛠️ Tech Stack

- **Frontend**:
    - React
    - React Router DOM
    - Lucide React (icons)
    - Tailwind CSS
- **Build Tool**:
    - Vite
- **Other**:
    - ESLint (for linting)
    - JavaScript (ES Modules)
    - Node.js
    - npm (or yarn/pnpm)

## 📦 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (version >= 18)
- npm (or yarn/pnpm)
- A backend API server running (configured via `VITE_BACKEND_URL` environment variable)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd frontend-dsa
    ```

2.  Install dependencies:

    ```bash
    npm install # or yarn install or pnpm install
    ```

3.  Set up environment variables:

    - Create a `.env` file in the root directory.
    - Add the following line, replacing `<backend_url>` with the actual URL of your backend API:

        ```
        VITE_BACKEND_URL=<backend_url>
        ```

### Running Locally

1.  Start the development server:

    ```bash
    npm run dev # or yarn dev or pnpm dev
    ```

2.  Open your browser and navigate to the address shown in the console (usually `http://localhost:5173`).

## 💻 Usage

1.  **Problem Setting**: Enter the problem or topic you want to discuss with the AI tutor on the main page.
2.  **Conversation**: After submitting the problem, you will be redirected to the conversation page.
3.  **Interaction**: Type your messages in the input field and press Enter to send them to the AI tutor.
4.  **Session Management**: Use the "Exit Session" button to end the current session and return to the problem setting page.

## 📂 Project Structure

```
frontend-dsa/
├── src/
│   ├── components/
│   │   ├── ConversationPage.jsx
│   │   ├── ProblemSettingPage.jsx
│   │   └── ...
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── ...
├── public/
│   ├── vite.svg
│   └── ...
├── .env
├── vite.config.js
├── package.json
├── README.md
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main repository.

## 📬 Contact

If you have any questions or suggestions, feel free to contact me at [lakshyasinghal2320@gmail.com](mailto:lakshyasinghal2320@gmail.com).

Thank you for checking out this project! I hope it helps you learn and grow.

