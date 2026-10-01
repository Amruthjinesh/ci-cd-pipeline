document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================
  // ELEMENTS
  // ==========================================

  const messageForm = document.querySelector(".channel-message-form");
  const messageInput = document.querySelector("#message");
  const messageBody = document.querySelector(".channel-feed__body");

  const searchInput = document.querySelector(
    '.form-search input[name="query"]'
  );

  const feedLinks = document.querySelectorAll(
    ".app-a .nav-section:nth-of-type(1) .nav__link"
  );

  const directLinks = document.querySelectorAll(
    ".app-a .nav-section:nth-of-type(2) .nav__link"
  );

  const allSidebarLinks = document.querySelectorAll(
    ".app-a .nav__link"
  );

  const mainTitle = document.querySelector(
    ".channel-feed .segment-topbar__title"
  );

  const mainOverline = document.querySelector(
    ".channel-feed .segment-topbar__overline"
  );

  const unreadBadge = document.querySelector(
    ".app-header .badge"
  );

  // ==========================================
  // DATA
  // ==========================================

  const conversations = {
    "Afterlife": {
      type: "channel",
      seed: "NetWire_Seed: af7d91c4b61e4c9f",
      messages: [
        {
          author: "Rogue Amendiares",
          text: "Afterlife's quiet tonight. That usually means something big is coming.",
          time: "10:41pm"
        },
        {
          author: "V. M. Vargas",
          text: "Got a lead on a small job. Watson side of town.",
          time: "10:47pm"
        }
      ]
    },

    "NCPD-Gigs": {
      type: "channel",
      seed: "NetWire_Seed: 94a72c1d0b9f6e31",
      messages: [
        {
          author: "NCPD Dispatch",
          text: "New gig uploaded. Check the details before accepting.",
          time: "09:22pm"
        }
      ]
    },

    "Pacifica": {
      type: "channel",
      seed: "NetWire_Seed: 52d6f1a9c83e74b2",
      messages: [
        {
          author: "Placide",
          text: "Keep your head down. Pacifica doesn't forgive mistakes.",
          time: "08:13pm"
        }
      ]
    },

    "Watson": {
      type: "channel",
      seed: "NetWire_Seed: d869db7fe62fb07c25a0403ecaea55031744b5fb",
      messages: [
        {
          author: "V. M. Vargas",
          text: "I got a gig lined up in Watson, no biggie. If you prove useful, expect more side gigs coming your way. I need a half-decent netrunner. Hit me up, provide credentials, eddies on completion.",
          time: "11:04pm"
        },
        {
          author: "V. M. Vargas",
          text: "I got a gig lined up in Watson, no biggie. If you prove useful, expect more side gigs coming your way. I need a half-decent netrunner. Hit me up, provide credentials, eddies on completion.",
          time: "11:04pm"
        }
      ]
    },

    "_T_SQUAD": {
      type: "channel",
      seed: "NetWire_Seed: 7c3e91f4a5d8b2e6",
      messages: [
        {
          author: "T_SQUAD",
          text: "Squad channel secured. Keep comms clean.",
          time: "10:02pm"
        }
      ]
    },

    "Rogue Amendiares": {
      type: "direct",
      seed: "DIRECT_LINK: ROGUE",
      messages: [
        {
          author: "Rogue Amendiares",
          text: "You looking for work, or just browsing?",
          time: "10:51pm"
        },
        {
          author: "Rogue Amendiares",
          text: "I've got something that might interest you.",
          time: "10:54pm"
        }
      ]
    },

    "Takemura": {
      type: "direct",
      seed: "DIRECT_LINK: TAKEMURA",
      messages: [
        {
          author: "Takemura",
          text: "We should speak. There are matters requiring your attention.",
          time: "09:32pm"
        }
      ]
    },

    "Wakado O., Regina Jones": {
      type: "direct",
      seed: "DIRECT_LINK: REGINA",
      messages: [
        {
          author: "Regina Jones",
          text: "Got another lead for you. Let me know if you're interested.",
          time: "08:44pm"
        }
      ]
    },

    "Dexter DeShawn": {
      type: "direct",
      seed: "DIRECT_LINK: DEX",
      messages: [
        {
          author: "Dexter DeShawn",
          text: "Listen, choom. We got business to discuss.",
          time: "07:21pm"
        }
      ]
    },

    "Megabuilding H10 Administration": {
      type: "direct",
      seed: "DIRECT_LINK: H10",
      messages: [
        {
          author: "H10 Administration",
          text: "Your maintenance request has been received.",
          time: "06:15pm"
        }
      ]
    }
  };

  let currentConversation = "Watson";

  // ==========================================
  // HELPERS
  // ==========================================

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getCurrentTime() {
    return new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    });
  }

  // ==========================================
  // RENDER MESSAGES
  // ==========================================

  function renderMessages(name) {
    const conversation = conversations[name];

    if (!conversation || !messageBody) {
      return;
    }

    messageBody.innerHTML = "";

    conversation.messages.forEach((message) => {
      createMessage(message);
    });

    scrollToBottom();
  }

  function createMessage(message) {
    const messageElement = document.createElement("div");

    messageElement.className = "message";

    messageElement.innerHTML = `
      <div class="message__body">
        <div>${escapeHTML(message.text)}</div>
      </div>

      <div class="message__footer">
        <span class="message__authoring">
          ${escapeHTML(message.author)}
        </span>
        - ${escapeHTML(message.time)}
      </div>
    `;

    messageBody.appendChild(messageElement);
  }

  // ==========================================
  // CHANGE CONVERSATION
  // ==========================================

  function openConversation(name, link) {
    if (!conversations[name]) {
      return;
    }

    currentConversation = name;

    // Remove active state
    allSidebarLinks.forEach((item) => {
      item.classList.remove("nav__link--active");
    });

    // Add active state
    if (link) {
      link.classList.add("nav__link--active");
    }

    const conversation = conversations[name];

    // Update title
    if (mainTitle) {
      mainTitle.innerHTML = `
        <span class="channel-link">
          <span class="channel-link__icon">
            ${conversation.type === "channel" ? "#" : ""}
          </span>

          <span class="channel-link__element">
            ${escapeHTML(name)}
          </span>
        </span>
      `;
    }

    // Update seed
    if (mainOverline) {
      mainOverline.textContent = conversation.seed;
    }

    // Remove unread indicator
    const unread = link?.querySelector(".conversation-link--unread");

    if (unread) {
      unread.classList.remove("conversation-link--unread");

      const badge = unread.querySelector(".badge");

      if (badge) {
        badge.remove();
      }
    }

    renderMessages(name);
  }

  // ==========================================
  // SIDEBAR CLICK EVENTS
  // ==========================================

  allSidebarLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const textElement = link.querySelector(
        ".channel-link__element, .conversation-link__element"
      );

      if (!textElement) {
        return;
      }

      const name = textElement.textContent.trim();

      openConversation(name, link);
    });
  });

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  if (messageForm && messageInput) {
    messageForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const text = messageInput.value.trim();

      if (!text) {
        return;
      }

      const message = {
        author: "YOU",
        text: text,
        time: getCurrentTime()
      };

      conversations[currentConversation].messages.push(message);

      createMessage(message);

      messageInput.value = "";

      scrollToBottom();

      // Small cyberpunk-style response
      showSystemResponse();
    });
  }

  // ==========================================
  // SYSTEM RESPONSE
  // ==========================================

  function showSystemResponse() {
    const responses = [
      "Signal received.",
      "Transmission acknowledged.",
      "Copy that, choom.",
      "Data packet received.",
      "Message encrypted and stored.",
      "Connection stable."
    ];

    const response =
      responses[Math.floor(Math.random() * responses.length)];

    setTimeout(() => {
      const message = {
        author: "NETWIRE",
        text: response,
        time: getCurrentTime()
      };

      conversations[currentConversation].messages.push(message);

      createMessage(message);

      scrollToBottom();
    }, 800);
  }

  // ==========================================
  // SEARCH
  // ==========================================

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value
        .toLowerCase()
        .trim();

      allSidebarLinks.forEach((link) => {
        const text = link.textContent
          .toLowerCase()
          .trim();

        const item = link.closest(".nav__item");

        if (!item) {
          return;
        }

        item.style.display =
          !query || text.includes(query)
            ? ""
            : "none";
      });
    });

    // Prevent search form reload
    const searchForm = document.querySelector(".form-search");

    if (searchForm) {
      searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
      });
    }
  }

  // ==========================================
  // NEW MESSAGE BUTTON
  // ==========================================

  const newMessageButton = document.querySelector(
    ".app-a .segment-topbar__aside .button"
  );

  if (newMessageButton) {
    newMessageButton.addEventListener("click", (event) => {
      event.preventDefault();

      if (messageInput) {
        messageInput.focus();

        messageInput.style.boxShadow =
          "0 0 10px #2be4ea";

        setTimeout(() => {
          messageInput.style.boxShadow = "";
        }, 600);
      }
    });
  }

  // ==========================================
  // HEADER NAVIGATION
  // ==========================================

  const headerLinks = document.querySelectorAll(
    ".app-header .nav__link"
  );

  headerLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      headerLinks.forEach((item) => {
        item.classList.remove("nav__link--active");
      });

      link.classList.add("nav__link--active");
    });
  });

  // ==========================================
  // KEYBOARD SHORTCUTS
  // ==========================================

  document.addEventListener("keydown", (event) => {
    // "/" focuses the message box
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

    // Escape clears the message box
    if (event.key === "Escape") {
      if (messageInput) {
        messageInput.value = "";
        messageInput.blur();
      }
    }

    // Ctrl + K focuses search
    if (event.ctrlKey && event.key.toLowerCase() === "k") {
      event.preventDefault();

      if (searchInput) {
        searchInput.focus();
      }
    }
  });

  // ==========================================
  // ENTER TO SEND
  // ==========================================

  if (messageInput) {
    messageInput.addEventListener("keydown", (event) => {
      // Enter = send
      // Shift + Enter = new line
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        if (messageForm) {
          messageForm.requestSubmit();
        }
      }
    });
  }

  // ==========================================
  // SCROLL
  // ==========================================

  function scrollToBottom() {
    if (!messageBody) {
      return;
    }

    messageBody.scrollTop = messageBody.scrollHeight;
  }

  // ==========================================
  // CYBERPUNK TERMINAL EFFECT
  // ==========================================

  function terminalStartup() {
    const title = document.querySelector(
      ".app-header__anchor__text"
    );

    if (!title) {
      return;
    }

    const originalText = title.textContent;

    title.textContent = "";

    let index = 0;

    const interval = setInterval(() => {
      title.textContent += originalText[index];

      index++;

      if (index >= originalText.length) {
        clearInterval(interval);
      }
    }, 45);
  }

  // ==========================================
  // INITIALIZE
  // ==========================================

  renderMessages(currentConversation);

  terminalStartup();

  console.log(
    "%c[NIGHT-CITY NETWIRE]",
    "color:#2be4ea;font-size:16px;font-weight:bold;"
  );

  console.log(
    "%cSYSTEM ONLINE",
    "color:#e8615a;font-weight:bold;"
  );

  console.log(
    "%cPress / to focus messaging.",
    "color:#fed33f;"
  );

  console.log(
    "%cPress CTRL+K to search.",
    "color:#fed33f;"
  );
});
