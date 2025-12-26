import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suppress browser extension errors that don't affect the app
window.addEventListener('error', (event) => {
  // Filter out browser extension connection errors
  if (
    event.message?.includes('Could not establish connection') ||
    event.message?.includes('Receiving end does not exist') ||
    event.message?.includes('Extension context invalidated')
  ) {
    event.preventDefault();
    return false;
  }
});

// Also catch unhandled promise rejections from extensions
window.addEventListener('unhandledrejection', (event) => {
  const errorMessage = event.reason?.message || event.reason?.toString() || '';
  if (
    errorMessage.includes('Could not establish connection') ||
    errorMessage.includes('Receiving end does not exist') ||
    errorMessage.includes('Extension context invalidated')
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
