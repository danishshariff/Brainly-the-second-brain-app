import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import Dashboard from "./pages/dashboard"
import Signin from "./pages/signin"
import Signup from "./pages/signup"
import { Profile } from "./components/ui/Profile"
import ShareView from "./components/ui/ShareView"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/share/:shareLink" element={<ShareView />} />
          <Route path="/" element={<Signin />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App