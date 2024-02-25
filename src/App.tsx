import { SignedIn, SignedOut } from "@clerk/clerk-react"
import Dish from "./components/Dish"
import Shuffle from "./components/Shuffle"

function App() {
  return (
    <div>
      <SignedOut>Sign in to build your personal cookbook!</SignedOut>
      <SignedIn>
        <Dish />
        <Shuffle />
      </SignedIn>
    </div>
  )
}

export default App
