import { useUser } from "@clerk/clerk-react"
import Dish from "./components/Dish"
import Shuffle from "./components/Shuffle"

function App() {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    // Handle loading state however you like
    return null
  }

  if (isSignedIn) {
    return (
      <div>
        <Dish />
        <Shuffle />
      </div>
    )
  }

  return <div>Sign in to build your personal cookbook!</div>
}

export default App
