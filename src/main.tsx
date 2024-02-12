import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import Navbar from "./Navbar.tsx"
import { Providers } from "./Providers.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Providers>
    <React.StrictMode>
      <Navbar />
      <App />
    </React.StrictMode>
  </Providers>
)
