import { useUser } from "@clerk/clerk-react"
import Dish from "./components/Dish"

function App() {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    return (
      <div>
        <Dish />
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
