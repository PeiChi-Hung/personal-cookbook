import { SignedIn, SignedOut } from "@clerk/clerk-react"
import Dish from "./components/Dish"

function App() {
  return (
    <div>
      <SignedOut>Sign in to build your personal cookbook!</SignedOut>
      <SignedIn>
        <Dish />
      </SignedIn>
    </div>
  )
}

export default App
