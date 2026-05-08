const socket = io();

const input = document.getElementById("messageInput");
const button = document.getElementById("sendBtn");
const list = document.getElementById("notificationList");

button.addEventListener("click", () => {
  const message = input.value.trim();

  if (message !== "") {
    socket.emit("sendNotification", message);
    input.value = "";
  }
});

socket.on("receiveNotification", (message) => {
  const item = document.createElement("li");
  item.textContent = message;
  list.appendChild(item);
});