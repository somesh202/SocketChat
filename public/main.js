(() => {
  const app = document.querySelector(".app");
  const socket = io();

  let uname;

  // Event listener for user join button
  app.querySelector(".join-cont #user-join").addEventListener("click", () => {
    const username = app.querySelector(".join-cont #username").value;
    console.log(username);
    if (username.length === 0) return;
    socket.emit("newuser", username);
    uname = username;

    // Switch screen
    app.querySelector(".join-cont").classList.remove("active");
    app.querySelector(".chat-cont").classList.add("active");
  });

  // Event listener for send button
  app.querySelector(".chat-cont #sendBtn").addEventListener("click", () => {
    const mssg = app.querySelector(".chat-cont #mssg-input").value;

    if (mssg.length === 0) return;

    // Render and emit chat message
    renderMessage("my", {
      username: uname,
      text: mssg,
    });
    socket.emit("chat", {
      username: uname,
      text: mssg,
    });
    app.querySelector(".chat-cont #mssg-input").value = "";
  });

  // Event listener for leave button
  app.querySelector(".chat-cont #leave").addEventListener("click", () => {
    // Emit exit user and refresh the page
    socket.emit("exituser", uname);
    window.location.assign("/");
  });

  // Socket event listener for update messages
  socket.on("update", (update) => {
    renderMessage("update", update);
  });

  // Socket event listener for chat messages
  socket.on("chat", (mssg) => {
    renderMessage("other", mssg);
  });

  // Function to render different types of messages
  function renderMessage(type, mssg) {
    const mssgContainer = app.querySelector(".chat-cont .mssgs");
    if (type === "my") {
      // Render user's message
      const e1 = document.createElement("div");
      e1.setAttribute("class", "mssg rec-mssg");
      e1.innerHTML = `
          <div>
            <div class="name">You</div>
            <div class="text">${mssg.text}</div>
          </div>`;
      mssgContainer.appendChild(e1);
    } else if (type === "other") {
      // Render other user's message
      const e1 = document.createElement("div");
      e1.setAttribute("class", "mssg sender-mssg");
      e1.innerHTML = `
          <div>
            <div class="name">${mssg.username}</div>
            <div class="text">${mssg.text}</div>
          </div>`;
      mssgContainer.appendChild(e1);
    } else if (type === "update") {
      // Render update message
      const e1 = document.createElement("div");
      e1.setAttribute("class", "popup");
      e1.innerText = mssg;
      mssgContainer.appendChild(e1);
    }
    // Auto-scroll to the latest message
    mssgContainer.scrollTop =
      mssgContainer.scrollHeight - mssgContainer.clientHeight;
  }
})();
