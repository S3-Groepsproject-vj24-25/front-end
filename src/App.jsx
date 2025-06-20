import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import { TableProvider } from "./context/TableContext"
import { SignalRProvider } from "./context/SignalRContext"
import Homepage from "./pages/Homepage"
import CartPage from "./pages/CartPage"
import KitchenPortal from "./pages/KitchenPortal"
import AdminDashboard from "./pages/AdminDashboard"
import WaiterPortal from "./pages/WaiterPortal"

function App() {
  return (
    <Router>
      <TableProvider>
        <SignalRProvider>
        <CartProvider>
          <Routes>
            <Route path="/table/:tableId" element={<Homepage />} />
            <Route path="/" element={<Homepage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/kitchen" element={<KitchenPortal />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/waiter" element={<WaiterPortal />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
        </SignalRProvider>
      </TableProvider>
    </Router>
  )
}

export default App

