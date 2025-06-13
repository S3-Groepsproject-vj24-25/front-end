/* eslint-disable react/prop-types */
"use client"

import { useState } from "react"
import { Hand, Check, Wifi, WifiOff } from "lucide-react"
import { useSignalR } from "../context/SignalRContext"

const HelpButton = ({ tableNumber = "15" }) => {
  const { sendHelpRequest, isConnected } = useSignalR()
  const [isRequesting, setIsRequesting] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  const handleHelpRequest = async () => {
    if (isRequesting || requestSent) return

    setIsRequesting(true)

    try {
      const result = await sendHelpRequest(tableNumber, "Customer needs assistance")

      if (result.success) {
        setRequestSent(true)
        setShowMessage(true)

        setTimeout(() => {
          setShowMessage(false)
        }, 5000)

        setTimeout(() => {
          setRequestSent(false)
        }, 30000)
      } else {
        alert(`Failed to send help request: ${result.error}`)
      }
    } catch (error) {
      console.error("Error sending help request:", error)
      alert("Failed to send help request. Please try again.")
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleHelpRequest}
        disabled={isRequesting || requestSent || !isConnected}
        className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-200 ${
          requestSent
            ? "bg-green-500 text-white"
            : isConnected
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isRequesting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Requesting Help...
          </>
        ) : requestSent ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Help Requested
          </>
        ) : (
          <>
            <Hand className="mr-2 h-5 w-5" />
            Ask for Help
          </>
        )}
      </button>

      <div className="flex items-center justify-center mt-2 text-xs">
        {isConnected ? (
          <div className="flex items-center text-green-600">
            <Wifi className="h-3 w-3 mr-1" />
            Connected
          </div>
        ) : (
          <div className="flex items-center text-red-600">
            <WifiOff className="h-3 w-3 mr-1" />
            Disconnected
          </div>
        )}
      </div>

      {showMessage && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-green-100 border border-green-300 rounded-lg text-green-800 text-sm text-center">
          <div className="flex items-center justify-center">
            <Check className="h-4 w-4 mr-1" />
            Waiter has been notified and will be with you shortly!
          </div>
        </div>
      )}
    </div>
  )
}

export default HelpButton
