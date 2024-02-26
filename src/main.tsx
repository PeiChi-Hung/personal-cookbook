import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import Navbar from "./Navbar.tsx"
import { Providers } from "./Providers.tsx"
import { ClerkProvider } from "@clerk/clerk-react"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Providers>
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <Navbar />
        <main className="overflow-x-hidden lg:px-28">
          <App />
        </main>
      </ClerkProvider>
    </React.StrictMode>
  </Providers>
)
