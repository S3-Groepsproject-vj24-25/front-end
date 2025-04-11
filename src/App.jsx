import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import Homepage from "./pages/Homepage"
import CartPage from "./pages/CartPage"

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </Router>
  )
}

export default App

