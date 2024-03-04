import { useUser } from "@clerk/clerk-react"
import Dish from "./components/Dish"
import Shuffle from "./components/Shuffle"

function App() {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
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

  return (
    <div className="flex items-center justify-center h-screen">
      <h1>Sign in to build your personal cookbook!</h1>
    </div>
  )
}

export default App
