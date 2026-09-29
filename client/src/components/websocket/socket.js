const isLoggedIn = () => !!localStorage.getItem("userInfo");

class SocketManager extends EventTarget {
  constructor() {
    super();
    this.ws = null;
    this.reconnectDelay = 1000;  
    this.maxReconnectDelay = 15000;  
    this.reconnectTimer = null;
  }

  connect() {
    if (!isLoggedIn()) return;

    if (this.reconnectTimer) return;

    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    this.ws = ws;

    ws.onopen = () => {
      this.reconnectDelay = 1000;

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (userInfo?._id) {
        ws.send(
          JSON.stringify({
            type: "register-user",
            userId: userInfo._id,
            username: userInfo.username || userInfo.name || "User",
          })
        );
      }

      this.dispatchEvent(new Event("open"));
    };

    ws.onmessage = (event) => {
      this.dispatchEvent(new MessageEvent("message", { data: event.data }));
    };

    ws.onclose = (event) => {
      if (this.ws !== ws) return;

      this.dispatchEvent(new Event("close"));

      if (event.code === 4401 || event.code === 4403) return;

      if (isLoggedIn()) {
        clearTimeout(this.reconnectTimer);

        this.reconnectTimer = setTimeout(() => {
          this.reconnectTimer = null;
          this.connect();
        }, this.reconnectDelay);

        this.reconnectDelay = Math.min(
          this.reconnectDelay * 2,
          this.maxReconnectDelay
        );
      }
    };

    ws.onerror = () => {
      console.warn("WebSocket error");
    };
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }

  get readyState() {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }

  disconnect() {
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

let managerInstance = null;

export const getSocket = () => {
  if (!isLoggedIn()) return null;

  if (!managerInstance) {
    managerInstance = new SocketManager();
  }

  managerInstance.connect();

  return managerInstance;
};

export default getSocket;