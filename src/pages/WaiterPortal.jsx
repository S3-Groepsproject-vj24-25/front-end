import { useState, useEffect } from "react"
import { Hand, Check, Clock, User, MessageSquare, X, MenuIcon } from "lucide-react"
import { useSignalR } from "../context/SignalRContext"

const WaiterPortal = () => {
  const { helpRequests, resolveHelpRequest, isConnected } = useSignalR()
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768
      setIsMobile(isMobileView)
      if (isMobileView) {
        setShowSidebar(false)
      } else {
        setShowSidebar(true)
      }
    }

    
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const sortedRequests = [...helpRequests].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  const handleResolveRequest = async (requestId) => {
    try {
      const result = await resolveHelpRequest(requestId)
      if (result.success) {
        setSelectedRequest(null)
        if (isMobile) {
          setShowSidebar(true)
        }
      } else {
        alert(`Failed to resolve request: ${result.error}`)
      }
    } catch (error) {
      console.error("Error resolving help request:", error)
      alert("Failed to resolve request. Please try again.")
    }
  }

  const handleRequestSelect = (request) => {
    setSelectedRequest(request)
    if (isMobile) {
      setShowSidebar(false)
    }
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getTimeElapsed = (timestamp) => {
    const now = new Date()
    const requestTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - requestTime) / (1000 * 60))

    return `${diffInMinutes} minutes ago`
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <div className="md:hidden bg-amber-500 text-white p-4 flex justify-between items-center">
        <button onClick={toggleSidebar} className="p-1">
          {showSidebar ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
        <h1 className="text-xl font-bold">Help Requests</h1>
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${isConnected ? "bg-green-400" : "bg-red-400"}`}
            title={isConnected ? "Connected" : "Disconnected"}
          ></div>
          <span className="text-sm">{helpRequests.length}</span>
        </div>
      </div>

      <div
        className={`${
          showSidebar ? "block" : "hidden"
        } md:block w-full md:w-1/3 bg-white border-r overflow-y-auto md:max-h-screen ${
          isMobile && selectedRequest ? "h-[calc(100vh-64px)]" : ""
        }`}
      >
        <div className="p-4 border-b bg-amber-500 text-white hidden md:block">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Help Requests</h1>
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${isConnected ? "bg-green-400" : "bg-red-400"}`}
                title={isConnected ? "Connected" : "Disconnected"}
              ></div>
              <span className="text-sm">{helpRequests.length} active</span>
            </div>
          </div>
        </div>

        {!isConnected && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <div className="text-red-800 text-sm text-center">
              <div className="font-medium">Connection Lost</div>
              <div>Attempting to reconnect...</div>
            </div>
          </div>
        )}

        <div className="divide-y">
          {sortedRequests.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Hand className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No help requests</p>
              <p className="text-sm">All tables are doing well!</p>
            </div>
          ) : (
            sortedRequests.map((request) => (
              <div
                key={request.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedRequest?.id === request.id ? "bg-amber-50 border-r-4 border-amber-500" : ""
                }`}
                onClick={() => handleRequestSelect(request)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Table {request.tableNumber}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatTime(request.timestamp)}</span>
                      <span className="mx-2">•</span>
                      <span>{getTimeElapsed(request.timestamp)}</span>
                    </div>
                    <div className="flex items-start">
                      <MessageSquare className="h-3 w-3 mr-1 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 line-clamp-2">{request.message}</p>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                  </div>
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
        {selectedRequest ? (
          <div>
            {isMobile && (
              <button
                onClick={() => setShowSidebar(true)}
                className="mb-4 flex items-center text-amber-600 font-medium"
              >
                <X className="h-4 w-4 mr-1" /> Back to Requests
              </button>
            )}

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-amber-50">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Table {selectedRequest.tableNumber}</h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {getTimeElapsed(selectedRequest.timestamp)}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Request Time</h3>
                    <p className="text-lg">{new Date(selectedRequest.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Table Number</h3>
                    <p className="text-lg">Table {selectedRequest.tableNumber}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800">{selectedRequest.message}</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleResolveRequest(selectedRequest.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center font-medium transition-colors"
                  >
                    <Check className="mr-2 h-5 w-5" />
                    Mark as Resolved
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Hand className="h-16 w-16 mb-4 text-amber-400" />
            <p className="text-lg font-medium">Select a help request</p>
            <p className="text-sm">Choose a request from the sidebar to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default WaiterPortal
