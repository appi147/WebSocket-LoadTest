import React, { useState, useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";

const WebSocketInterface: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/app-endpoint",
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe("/topic/response", (message: IMessage) => {
          const data = JSON.parse(message.body);
          setResponses((prev) => [...prev, data.value]);
        });
      },
      onStompError: (frame) => {
        console.error("Broker error: ", frame.headers["message"]);
        console.error("Details: ", frame.body);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error: ", error);
      },
    });

    clientRef.current = client;
    return () => {
      client.deactivate();
    };
  }, []);

  const connect = () => {
    clientRef.current?.activate();
  };

  const disconnect = () => {
    clientRef.current?.deactivate();
    setConnected(false);
    setResponses([]);
  };

  const sendMessage = () => {
    if (clientRef.current && inputValue.trim()) {
      clientRef.current.publish({
        destination: "/app/request",
        body: JSON.stringify({ value: inputValue }),
      });
      setInputValue("");
    }
  };

  return (
    <div className="container-fluid px-4 pt-3">
      <div className="card p-4 shadow rounded-3">
        <h3 className="card-title mb-4 text-center">WebSocket Interface</h3>

        <div className="row g-3 mb-3">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <div className="btn-group" role="group">
              <button
                className="btn btn-success px-4 rounded-start-pill"
                onClick={connect}
                disabled={connected}
              >
                Connect
              </button>
              <button
                className="btn btn-danger px-4 rounded-end-pill"
                onClick={disconnect}
                disabled={!connected}
              >
                Disconnect
              </button>
            </div>
            <span
              className={`badge px-3 py-2 fs-6 fw-medium ${
                connected ? "bg-success" : "bg-secondary"
              }`}
              style={{ borderRadius: "1rem" }}
            >
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className="col-md-6">
            <form
              className="d-flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Type your request..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </form>
          </div>
        </div>

        {connected && (
          <div className="table-responsive">
            <table className="table table-bordered table-hover mt-3">
              <thead className="table-light">
                <tr>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((res, index) => (
                  <tr key={index}>
                    <td>{res}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebSocketInterface;
