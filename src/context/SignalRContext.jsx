/* eslint-disable react/prop-types */
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import * as signalR from "@microsoft/signalr"

const SignalRContext = createContext()

export const useSignalR = () => {
  const context = useContext(SignalRContext)
  if (!context) {
    throw new Error("useSignalR must be used within a SignalRProvider")
  }
  return context
}

export const SignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [helpRequests, setHelpRequests] = useState([])

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5238/helpHub") 
      .withAutomaticReconnect()
      .build()

    newConnection.on("HelpRequestReceived", (helpRequest) => {
      console.log("Help request received:", helpRequest)
      setHelpRequests((prev) => {
        const exists = prev.some((req) => req.id === helpRequest.id)
        if (exists) {
          return prev.map((req) => (req.id === helpRequest.id ? helpRequest : req))
        }
        return [...prev, helpRequest]
      })
    })

    newConnection.on("HelpRequestResolved", (requestId) => {
      console.log("Help request resolved:", requestId)
      setHelpRequests((prev) => prev.filter((req) => req.id !== requestId))
    })

    newConnection.on("HelpRequestsUpdated", (requests) => {
      console.log("Help requests updated:", requests)
      setHelpRequests(requests)
    })

    const startConnection = async () => {
      try {
        await newConnection.start()
        console.log("SignalR Connected")
        setIsConnected(true)
        setConnection(newConnection)

        await newConnection.invoke("GetActiveHelpRequests")
      } catch (error) {
        console.error("SignalR Connection Error:", error)
        setIsConnected(false)
      }
    }

    startConnection()

    newConnection.onreconnecting(() => {
      console.log("SignalR Reconnecting...")
      setIsConnected(false)
    })

    newConnection.onreconnected(() => {
      console.log("SignalR Reconnected")
      setIsConnected(true)
    })

    newConnection.onclose(() => {
      console.log("SignalR Disconnected")
      setIsConnected(false)
    })

    return () => {
      if (newConnection) {
        newConnection.stop()
      }
    }
  }, [])

  const sendHelpRequest = async (tableNumber, message = "Customer needs assistance") => {
    if (connection && isConnected) {
      try {
        await connection.invoke("SendHelpRequest", tableNumber, message)
        return { success: true }
      } catch (error) {
        console.error("Error sending help request:", error)
        return { success: false, error: error.message }
      }
    }
    return { success: false, error: "Not connected to server" }
  }

  const resolveHelpRequest = async (requestId) => {
    if (connection && isConnected) {
      try {
        await connection.invoke("ResolveHelpRequest", requestId)
        return { success: true }
      } catch (error) {
        console.error("Error resolving help request:", error)
        return { success: false, error: error.message }
      }
    }
    return { success: false, error: "Not connected to server" }
  }

  const value = {
    connection,
    isConnected,
    helpRequests,
    sendHelpRequest,
    resolveHelpRequest,
  }

  return <SignalRContext.Provider value={value}>{children}</SignalRContext.Provider>
}
