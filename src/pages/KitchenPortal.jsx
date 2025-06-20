import { useState, useEffect } from "react"
import { Clock, CheckCircle, AlertCircle, ChefHat, ArrowRight, ArrowLeft, Menu, X } from 'lucide-react'

const OrderStatus = {
  PENDING: "Pending",
  IN_PROGRESS: "Preparing",
  COMPLETED: "Completed",
}

const API_BASE_URL = "https://willemapi-access20250619102749-b6cqcvf5fyhge2du.canadacentral-01.azurewebsites.net/api/orders"

const fetchOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching kitchen orders:", error)
    throw error
  }
}

const fetchOrdersByStatus = async (status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/status?status=${status}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const orders = await response.json()
    return orders.filter((order) => order.items.some((item) => item.type === "Food"))
  } catch (error) {
    console.error(`Error fetching orders with status ${status}:`, error)
    throw error
  }
}

const startOrderPreparation = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${orderId}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error starting order preparation:", error)
    throw error
  }
}

const completeOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${orderId}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error completing order:", error)
    throw error
  }
}

const updateOrder = async (order) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${order.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating order:", error)
    throw error
  }
}

const KitchenPortal = () => {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [showSidebar, setShowSidebar] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setShowSidebar(true)
      } else {
        setShowSidebar(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      try {
        let data
        if (statusFilter === "all") {
          data = await fetchOrders()
        } else {
          data = await fetchOrdersByStatus(statusFilter)
        }
        setOrders(data)
      } catch (error) {
        console.error("Error loading orders:", error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    loadOrders()

    const interval = setInterval(loadOrders, 30000)

    return () => clearInterval(interval)
  }, [statusFilter])

  const updateOrderStatus = async (order, newStatus) => {
    try {
      let response = { success: false }

      if (newStatus === OrderStatus.IN_PROGRESS) {
        response = await startOrderPreparation(order.id)
      } else if (newStatus === OrderStatus.COMPLETED) {
        response = await completeOrder(order.id)
      } else if (newStatus === OrderStatus.PENDING) {
        const updatedOrder = { ...order, status: OrderStatus.PENDING }
        response = await updateOrder(updatedOrder)
      }

      if (response.success) {
        if (statusFilter === "all") {
          const updatedOrders = await fetchOrders()
          setOrders(updatedOrders)
        } else {
          const updatedOrders = await fetchOrdersByStatus(statusFilter)
          setOrders(updatedOrders)
        }

        if (selectedOrder && selectedOrder.id === order.id) {
          try {
            const updatedOrder = await fetch(`${API_BASE_URL}/${order.id}`).then((res) => {
              if (!res.ok) throw new Error("Failed to fetch updated order")
              return res.json()
            })
            setSelectedOrder(updatedOrder)
          } catch (error) {
            console.error("Error fetching updated order:", error)
            const updatedOrders = await fetchOrders()
            setOrders(updatedOrders)
            setSelectedOrder(null)
          }
        }

        if (isMobile) {
          setShowSidebar(false)
        }
      } else {
        alert("Failed to update order status. Please try again.")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("An error occurred while updating the order. Please try again.")
    }
  }

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case OrderStatus.PENDING:
        return OrderStatus.IN_PROGRESS
      case OrderStatus.IN_PROGRESS:
        return OrderStatus.COMPLETED
      default:
        return currentStatus
    }
  }

  const getPreviousStatus = (currentStatus) => {
    switch (currentStatus) {
      case OrderStatus.IN_PROGRESS:
        return OrderStatus.PENDING
      case OrderStatus.COMPLETED:
        return OrderStatus.IN_PROGRESS
      default:
        return currentStatus
    }
  }

  const sortedOrders = [...orders].sort((a, b) => {
    const statusPriority = {
      [OrderStatus.PENDING]: 0,
      [OrderStatus.IN_PROGRESS]: 1,
      [OrderStatus.COMPLETED]: 2,
    }

    const statusDiff = statusPriority[a.status] - statusPriority[b.status]

    if (statusDiff === 0) {
      return new Date(b.timestamp) - new Date(a.timestamp)
    }

    return statusDiff
  })


  const getStatusColor = (status) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-blue-400"
      case OrderStatus.IN_PROGRESS:
        return "bg-amber-400"
      case OrderStatus.COMPLETED:
        return "bg-green-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusBgColor = (status) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-blue-50"
      case OrderStatus.IN_PROGRESS:
        return "bg-amber-50"
      case OrderStatus.COMPLETED:
        return "bg-green-50"
      default:
        return "bg-gray-50"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <AlertCircle className="h-5 w-5" />
      case OrderStatus.IN_PROGRESS:
        return <ChefHat className="h-5 w-5" />
      case OrderStatus.COMPLETED:
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getNextStatusText = (currentStatus) => {
    switch (currentStatus) {
      case OrderStatus.PENDING:
        return "Start Preparing"
      case OrderStatus.IN_PROGRESS:
        return "Mark Completed"
      default:
        return "Completed"
    }
  }

  const getPreviousStatusText = (currentStatus) => {
    switch (currentStatus) {
      case OrderStatus.IN_PROGRESS:
        return "Move to Pending"
      case OrderStatus.COMPLETED:
        return "Move to In Progress"
      default:
        return "No Previous Status"
    }
  }

  const handleOrderSelect = (order) => {
    setSelectedOrder(order)
    if (isMobile) {
      setShowSidebar(false)
    }
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-primary bg-opacity-90 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Kitchen Orders</h1>
        <button onClick={toggleSidebar} className="p-1">
          {showSidebar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={`${
          showSidebar ? "block" : "hidden"
        } md:block w-full md:w-1/3 bg-white border-r overflow-y-auto md:max-h-screen ${
          isMobile && selectedOrder ? "h-[calc(100vh-64px)]" : ""
        }`}
      >
        <div className="p-4 border-b bg-primary bg-opacity-90 text-white hidden md:block">
          <h1 className="text-xl font-bold">Kitchen Orders</h1>
        </div>

        <div className="p-4 bg-gray-50 border-b">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                statusFilter === "all" ? "bg-primary bg-opacity-90 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setStatusFilter(OrderStatus.PENDING)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                statusFilter === OrderStatus.PENDING
                  ? "bg-blue-400 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter(OrderStatus.IN_PROGRESS)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                statusFilter === OrderStatus.IN_PROGRESS
                  ? "bg-amber-400 text-white"
                  : "bg-amber-100 text-amber-700 hover:bg-amber-200"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setStatusFilter(OrderStatus.COMPLETED)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                statusFilter === OrderStatus.COMPLETED
                  ? "bg-green-400 text-white"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="divide-y">
          {loading ? (
            <div className="p-4 text-center">Loading orders...</div>
          ) : sortedOrders.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No orders found</div>
          ) : (
            sortedOrders.map((order) => (
              <div
                key={order.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedOrder?.id === order.id ? getStatusBgColor(order.status) : ""
                }`}
                onClick={() => handleOrderSelect(order)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">Order #{order.id}</div>
                    <div className="text-sm text-gray-500">Table: {order.tableNumber}</div>
                    <div className="text-sm text-gray-500">{formatTime(order.timestamp)}</div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-white text-xs flex items-center ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  {order.items.filter((item) => item.type === "Food").length} food item(s)
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div
        className={`${
          !showSidebar || !isMobile ? "block" : "hidden"
        } md:block flex-1 p-4 md:p-6 overflow-y-auto max-h-screen bg-gray-50`}
      >
        {selectedOrder ? (
          <div>
            {isMobile && (
              <button onClick={() => setShowSidebar(true)} className="mb-4 flex items-center text-primary font-medium">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Orders
              </button>
            )}

            <div
              className={`flex flex-col md:flex-row md:justify-between md:items-center mb-6 p-4 rounded-lg ${getStatusBgColor(
                selectedOrder.status,
              )}`}
            >
              <h2 className="text-2xl font-bold mb-2 md:mb-0">Order #{selectedOrder.id}</h2>
              <div
                className={`px-3 py-1 rounded-full text-white flex items-center self-start md:self-auto ${getStatusColor(
                  selectedOrder.status,
                )}`}
              >
                {getStatusIcon(selectedOrder.status)}
                <span className="ml-1">{selectedOrder.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Order Time</h3>
                <p>{new Date(selectedOrder.timestamp).toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Table</h3>
                <p>{selectedOrder.tableNumber}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b bg-primary bg-opacity-80 text-white">
                <h3 className="font-medium">Food Items</h3>
              </div>
              <div className="divide-y">
                {selectedOrder.items
                  .filter((item) => item.type === "Food")
                  .map((item, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="flex justify-between">
                        <div className="font-medium">
                          {item.quantity}x {item.name}
                        </div>
                      </div>

                      {item.modifications && (
                        <div className="mt-1 pl-6">
                          <div className="text-sm text-gray-500">Modifications:</div>
                          <div className="text-sm">{item.modifications}</div>
                        </div>
                      )}

                      {item.instructions && (
                        <div className="mt-1 pl-6">
                          <div className="text-sm text-gray-500">Instructions:</div>
                          <div className="text-sm italic">{item.instructions}</div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 justify-end">
              {selectedOrder.status !== OrderStatus.PENDING && (
                <button
                  onClick={() => updateOrderStatus(selectedOrder, getPreviousStatus(selectedOrder.status))}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center justify-center md:justify-start"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {getPreviousStatusText(selectedOrder.status)}
                </button>
              )}

              {selectedOrder.status !== OrderStatus.COMPLETED && (
                <button
                  onClick={() => updateOrderStatus(selectedOrder, getNextStatus(selectedOrder.status))}
                  className="bg-primary bg-opacity-90 text-white px-4 py-2 rounded-lg flex items-center justify-center md:justify-start"
                >
                  {getNextStatusText(selectedOrder.status)}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ChefHat className="h-16 w-16 mb-4 text-primary text-opacity-80" />
            <p>Select an order to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default KitchenPortal