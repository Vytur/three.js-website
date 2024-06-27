const socket = io("http://localhost:3001");

socket.on("connect", () => {
    console.log("Connected to server");
});

socket.on("seed", (seed) => {
  console.log("Seed received from server:", seed);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

socket.on("connect_error", (err) => {
    console.log("Connection error:", err);
});

