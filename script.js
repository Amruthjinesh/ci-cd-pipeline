// script.js

document.addEventListener("DOMContentLoaded", () => {
  // ================================
  // ELEMENTS
  // ================================

  const messageForm = document.querySelector(".channel-message-form");
  const messageInput = document.querySelector(
    '.channel-message-form textarea, .channel-message-form input'
  );

  const messageContainer =
    document.querySelector(".channel-feed__body");

  const navLinks = document.querySelectorAll(
    ".nav-section .nav__link"
  );

  const channelTitle = document.querySelector(
    ".segment-topbar__title"
  );

  const channelOverline = document.querySelector(
    ".segment-topbar__overline"
  );

  const searchInput = document.querySelector(
    '.form-search input, input[type="search"]'
  );

  // ================================
  // CHANNEL DATA
  // ================================

  const channels = {
    general: {
      title: "# GENERAL",
      description: "PUBLIC CHANNEL",
      messages: [
        {
          user: "SYSTEM",
          text: "Welcome to the network.",
          time: "12:01"
        },
        {
          user: "NOVA",
          text: "Anyone online?",
          time: "12:03"
        },
        {
          user: "ZERO",
          text: "Yeah. Signal is stable.",
          time: "12:04"
        }
      ]
    },

    development: {
      title: "# DEVELOPMENT",
      description: "DEV CHANNEL",
      messages: [
        {
          user: "NOVA",
          text: "The new interface is almost ready.",
          time: "11:48"
        },
        {
          user: "BYTE",
          text: "Push the latest build when you're done.",
          time: "11:52"
        }
      ]
    },

    random: {
      title: "# RANDOM",
      description: "OFF-TOPIC CHANNEL",
      messages: [
        {
          user: "ZERO",
          text: "Anyone watching the night feed?",
          time: "10:31"
        },
        {
          user: "NOVA",
          text: "Always.",
          time: "10:33"
        }
      ]
    }
  };

  let currentChannel = "general";

  // ================================
  // MESSAGE RENDERING
  // ================================

  function renderMessages(channelName) {
    if (!messageContainer) return;

    const channel = channels[channelName];

    if (!channel) return;

    messageContainer.innerHTML = "";

    channel.messages.forEach((message) => {
      addMessageToDOM(message);
    });

    scrollToBottom();
  }

  function addMessageToDOM(message) {
    const wrapper = document.createElement("div");

    wrapper.className = "message";

    wrapper.innerHTML = `
      <div class="message__body">
        <strong>${escapeHTML(message.user)}</strong>
        <span> // </span>
        ${escapeHTML(message.text)}
      </div>

      <div class="message__footer">
        ${escapeHTML(message.time)}
      </div>
    `;

    messageContainer.appendChild(wrapper);
  }

  // ================================
  // SEND MESSAGE
  // ================================

  if (messageForm && messageInput) {
    messageForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const text = messageInput.value.trim();

      if (!text) return;

      const now = new Date();

      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      const newMessage = {
        user: "YOU",
        text,
        time
      };

      channels[currentChannel].messages.push(newMessage);

      addMessageToDOM(newMessage);

      messageInput.value = "";

      scrollToBottom();

      // Simulate a system response
      simulateResponse();
    });
  }

  // ================================
  // SIMULATED RESPONSE
  // ================================

  function simulateResponse() {
    const responses = [
      "Signal received.",
      "Message acknowledged.",
      "Copy that.",
      "Transmission received.",
      "Standing by...",
      "Connection stable."
    ];

    const response =
      responses[Math.floor(Math.random() * responses.length)];

    setTimeout(() => {
      if (!channels[currentChannel]) return;

      const now = new Date();

      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      const systemMessage = {
        user: "SYSTEM",
        text: response,
        time
      };

      channels[currentChannel].messages.push(systemMessage);

      addMessageToDOM(systemMessage);

      scrollToBottom();
    }, 700);
  }

  // ================================
  // CHANNEL NAVIGATION
  // ================================

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const channel =
        link.dataset.channel ||
        link.getAttribute("href")?.replace("#", "");

      if (!channel || !channels[channel]) return;

      switchChannel(channel, link);
    });
  });

  function switchChannel(channel, clickedLink) {
    currentChannel = channel;

    navLinks.forEach((link) => {
      link.classList.remove("nav__link--active");
      link.classList.remove("channel-link--unread");
    });

    if (clickedLink) {
      clickedLink.classList.add("nav__link--active");
    }

    const data = channels[channel];

    if (channelTitle) {
      channelTitle.textContent = data.title;
    }

    if (channelOverline) {
      channelOverline.textContent = data.description;
    }

    renderMessages(channel);
  }

  // ================================
  // SEARCH
  // ================================

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value
        .toLowerCase()
        .trim();

      const messages =
        messageContainer?.querySelectorAll(".message");

      if (!messages) return;

      messages.forEach((message) => {
        const text = message.textContent.toLowerCase();

        message.style.display =
          !query || text.includes(query)
            ? ""
            : "none";
      });
    });
  }

  // ================================
  // KEYBOARD SHORTCUTS
  // ================================

  document.addEventListener("keydown", (event) => {
    // Focus message box with "/"
    if (
      event.key === "/" &&
      document.activeElement !== messageInput &&
      document.activeElement !== searchInput
    ) {
      event.preventDefault();

      if (messageInput) {
        messageInput.focus();
      }
    }

    // Escape clears the input
    if (event.key === "Escape") {
      if (messageInput) {
        messageInput.value = "";
        messageInput.blur();
      }
    }
  });

  // ================================
  // ONLINE STATUS
  // ================================

  function updateOnlineStatus() {
    const statusElements = document.querySelectorAll(
      ".conversation-link"
    );

    statusElements.forEach((element) => {
      const isOnline = Math.random() > 0.35;

      element.classList.toggle(
        "conversation-link--online",
        isOnline
      );
    });
  }

  updateOnlineStatus();

  // ================================
  // CLOCK
  // ================================

  function updateClock() {
    const clock = document.querySelector("[data-clock]");

    if (!clock) return;

    const now = new Date();

    clock.textContent = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  updateClock();

  setInterval(updateClock, 1000);

  // ================================
  // AUTO-SCROLL
  // ================================

  function scrollToBottom() {
    if (!messageContainer) return;

    messageContainer.scrollTop =
      messageContainer.scrollHeight;
  }

  // ================================
  // HTML SAFETY
  // ================================

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ================================
  // INITIALIZE
  // ================================

  if (channels.general) {
    renderMessages("general");
  }

  console.log(
    "%c[SYSTEM ONLINE]",
    "color:#2be4ea;font-weight:bold;"
  );

  console.log(
    "%cCyber interface initialized.",
    "color:#e8615a;"
  );
});
