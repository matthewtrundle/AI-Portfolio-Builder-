"use client";

import { useState, useEffect } from "react";
import { Shield, AlertTriangle, Activity, Clock } from "lucide-react";

interface SecurityEvent {
  timestamp: string;
  type: "rate_limit" | "injection_attempt" | "file_rejected" | "invalid_input";
  identifier: string;
  details?: any;
}

export default function SecurityMonitor() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    blockedRequests: 0,
    uniqueIPs: 0,
    lastUpdate: new Date().toISOString(),
  });

  // In production, this would connect to your logging service
  // For development, we'll simulate with localStorage
  useEffect(() => {
    const loadEvents = () => {
      const stored = localStorage.getItem("security_events");
      if (stored) {
        const parsedEvents = JSON.parse(stored);
        setEvents(parsedEvents.slice(-50)); // Keep last 50 events
        
        // Calculate stats
        const uniqueIPs = new Set(parsedEvents.map((e: SecurityEvent) => e.identifier));
        setStats({
          totalRequests: parsedEvents.length,
          blockedRequests: parsedEvents.filter((e: SecurityEvent) => 
            ["injection_attempt", "rate_limit"].includes(e.type)
          ).length,
          uniqueIPs: uniqueIPs.size,
          lastUpdate: new Date().toISOString(),
        });
      }
    };

    loadEvents();
    const interval = setInterval(loadEvents, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getEventColor = (type: SecurityEvent["type"]) => {
    switch (type) {
      case "injection_attempt":
        return "text-red-600 bg-red-50";
      case "rate_limit":
        return "text-orange-600 bg-orange-50";
      case "file_rejected":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getEventIcon = (type: SecurityEvent["type"]) => {
    switch (type) {
      case "injection_attempt":
        return <AlertTriangle className="w-4 h-4" />;
      case "rate_limit":
        return <Clock className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  if (process.env.NODE_ENV !== "development") {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg border p-4 max-h-96 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Security Monitor
        </h3>
        <span className="text-xs text-gray-500">Dev Only</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
        <div className="bg-gray-50 rounded p-2">
          <div className="text-gray-600 text-xs">Total Requests</div>
          <div className="font-semibold">{stats.totalRequests}</div>
        </div>
        <div className="bg-red-50 rounded p-2">
          <div className="text-red-600 text-xs">Blocked</div>
          <div className="font-semibold text-red-600">{stats.blockedRequests}</div>
        </div>
        <div className="bg-blue-50 rounded p-2">
          <div className="text-blue-600 text-xs">Unique IPs</div>
          <div className="font-semibold text-blue-600">{stats.uniqueIPs}</div>
        </div>
      </div>

      {/* Events */}
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {events.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No security events recorded
          </p>
        ) : (
          events.slice(-10).reverse().map((event, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 p-2 rounded text-xs ${getEventColor(
                event.type
              )}`}
            >
              {getEventIcon(event.type)}
              <div className="flex-1">
                <div className="font-medium">
                  {event.type.replace(/_/g, " ").toUpperCase()}
                </div>
                <div className="opacity-75">
                  {event.identifier} • {new Date(event.timestamp).toLocaleTimeString()}
                </div>
                {event.details && (
                  <div className="opacity-50 truncate">
                    {JSON.stringify(event.details)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-2 pt-2 border-t text-xs text-gray-500 flex items-center gap-1">
        <Activity className="w-3 h-3" />
        Last updated: {new Date(stats.lastUpdate).toLocaleTimeString()}
      </div>
    </div>
  );
}