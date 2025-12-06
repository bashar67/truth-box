import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { users, messages } from "../db.json";
// Mocking a simple in-memory user database for development
if (!localStorage.getItem("user")) {
  const dummyUser = users[0]; // Assuming db.json has a "users" array
  localStorage.setItem("user", JSON.stringify(dummyUser));
  localStorage.setItem("messages", JSON.stringify(messages));
  localStorage.setItem("authToken", "dummy-auth-token");
  localStorage.setItem("refreshToken", "dummy-refresh-token");
}

createRoot(document.getElementById("root")!).render(<App />);
