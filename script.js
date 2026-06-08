// ======================================================
// LOGIN
// ======================================================

const loginForm =
  document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value.trim();

    const errorMessage =
      document.getElementById("errorMessage");

    if (email === "") {

      errorMessage.innerText =
        "Please enter your email.";

      return;

    }

    if (password === "") {

      errorMessage.innerText =
        "Please enter your password.";

      return;

    }

    errorMessage.innerText = "";

    localStorage.setItem(
      "misaUser",
      email
    );

    window.location.href =
      "avatar.html";

  });

}

// ======================================================
// AVATAR SELECTION
// ======================================================

const avatarCards =
  document.querySelectorAll(".avatar-card");

const continueBtn =
  document.getElementById("continueBtn");

const avatarHint =
  document.getElementById("avatarHint");

let selectedAvatar = false;

avatarCards.forEach(card => {

  card.addEventListener("click", () => {

    avatarCards.forEach(c => {
      c.classList.remove("selected");
    });

    card.classList.add("selected");

    localStorage.setItem(
      "misaAvatar",
      card.dataset.avatar
    );

    localStorage.setItem(
      "misaAvatarImage",
      card.dataset.image
    );

    localStorage.setItem(
      "misaAvatarTone",
      card.dataset.tone
    );

    selectedAvatar = true;

    if (avatarHint) {
      avatarHint.innerText =
        `${card.dataset.avatar} is ready for your workspace.`;
    }

    if (continueBtn) {
      continueBtn.disabled = false;
    }

  });

});

if (continueBtn) {

  continueBtn.addEventListener("click", () => {

    if (!selectedAvatar) return;

    window.location.href =
      "dashboard.html";

  });

}

// ======================================================
// DASHBOARD
// ======================================================

const profileImage =
  document.getElementById("profileImage");

const welcomeText =
  document.getElementById("welcomeText");

const greetingSubtitle =
  document.getElementById("greetingSubtitle");

if (
  profileImage &&
  welcomeText
) {

  const avatarImage =
    localStorage.getItem("misaAvatarImage") || "assets/avatars/a1.png";

  const user =
    localStorage.getItem("misaUser") || "user@example.com";

  profileImage.src =
    avatarImage;

  const rawName =
    user.split("@")[0];

  let firstName =
    rawName
      .replace(/[0-9]/g, "")
      .split(/[_\-\.]/)[0]
      .toLowerCase()
      .replace(/^(shruti).*/, "$1");

  firstName =
    firstName.charAt(0).toUpperCase() +
    firstName.slice(1);

  const hour =
    new Date().getHours();

  let greeting = "Welcome back";
  let subtitle = "Let's create something beautiful today.";

  if (hour < 12) {
    greeting = "Good morning";
    subtitle = "Ready to start the day with intention?";
  } else if (hour < 18) {
    greeting = "Good afternoon";
    subtitle = "How's your momentum? Let's keep building.";
  } else {
    greeting = "Good evening";
    subtitle = "Winding down thoughtfully, I see. What's on your mind?";
  }

  welcomeText.innerText =
    `${greeting}, ${firstName}`;

  if (greetingSubtitle) {
    greetingSubtitle.innerText = subtitle;
  }

}

// ======================================================
// AI CHAT SYSTEM
// ======================================================

const sendBtn =
  document.getElementById("sendBtn");

const userInput =
  document.getElementById("chatInput");

const chatBox =
  document.getElementById("chatBox");

const chatPresence =
  document.getElementById("chatPresence");

const newChatBtn =
  document.getElementById("newChatBtn");

const historyBtn =
  document.getElementById("historyBtn");

const settingsBtn =
  document.getElementById("settingsBtn");

const chatApiUrl =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === ""
    ? "http://localhost:3000/chat"
    : "/api/chat";

const chatHistoryUrl =
  `${chatApiUrl}/history`;

if (
  sendBtn &&
  userInput &&
  chatBox
) {

  loadChatHistory();

  sendBtn.addEventListener(
    "click",
    sendMessage
  );

  userInput.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Enter") {

        sendMessage();

      }

    }
  );

}

// Action button handlers
if (newChatBtn) {
  newChatBtn.addEventListener("click", () => {
    console.log("New chat clicked");
    chatBox.innerHTML = '<div class="message ai"><span class="message-author">MISA</span><p>Hello. I am here with you. Tell me what you want to build, plan, fix, or understand, and I will help you move through it clearly.</p></div>';
    userInput.focus();
  });
}

if (historyBtn) {
  historyBtn.addEventListener("click", () => {
    console.log("History clicked");
    loadChatHistory();
  });
}

if (settingsBtn) {
  settingsBtn.addEventListener("click", () => {
    console.log("Settings clicked");
    alert("Settings coming soon!");
  });
}

async function sendMessage() {

  const message =
    userInput.value.trim();

  if (message === "") return;

  addMessage(
    "user",
    message
  );

  userInput.value = "";

  const aiDiv =
    addMessage(
      "ai",
      "MISA is thinking..."
    );

  setPresence("Thinking");

  try {

    const response =
      await fetch(
        chatApiUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: message,
            email: getCurrentUserEmail()
          })
        }
      );

    const data =
      await response.json();

    const reply =
      data.reply ||
      data.response ||
      data.message ||
      getLocalReply(message);

    renderAiMessage(
      aiDiv,
      reply
    );

  } catch (error) {

    console.log(error);

    renderAiMessage(
      aiDiv,
      getLocalReply(message)
    );

  } finally {

    setPresence("Ready");

    chatBox.scrollTop =
      chatBox.scrollHeight;

  }

}

async function loadChatHistory() {

  const email =
    getCurrentUserEmail();

  if (!email) return;

  try {

    const response =
      await fetch(
        `${chatHistoryUrl}?email=${encodeURIComponent(email)}`
      );

    if (!response.ok) return;

    const data =
      await response.json();

    if (
      !Array.isArray(data.messages) ||
      data.messages.length === 0
    ) {
      return;
    }

    chatBox.innerHTML = "";

    data.messages.forEach(message => {

      addMessage(
        message.role,
        message.content
      );

    });

  } catch (error) {

    console.log(error);

  }

}

function addMessage(type, text) {

  const messageDiv =
    document.createElement("div");

  messageDiv.className =
    `message ${type}`;

  if (type === "ai") {

    renderAiMessage(
      messageDiv,
      text
    );

  } else {

    messageDiv.innerText =
      text;

  }

  chatBox.appendChild(messageDiv);

  chatBox.scrollTop =
    chatBox.scrollHeight;

  return messageDiv;

}

function renderAiMessage(element, text) {

  element.innerHTML =
    `<span class="message-author">MISA</span><p>${escapeHtml(text)}</p>`;

}

function setPresence(text) {

  if (chatPresence) {
    chatPresence.innerText =
      text;
  }

}

function getLocalReply(message) {

  const avatarName =
    localStorage.getItem("misaAvatar") || "MISA";

  const lowerMessage =
    message.toLowerCase();

  if (
    lowerMessage.includes("task") ||
    lowerMessage.includes("plan")
  ) {

    return `${avatarName} here. I would start by naming the outcome, choosing the next three actions, and doing the smallest one first. Tell me the goal and I will turn it into a clean plan.`;

  }

  if (
    lowerMessage.includes("code") ||
    lowerMessage.includes("bug") ||
    lowerMessage.includes("fix")
  ) {

    return `${avatarName} here. Share the error or the file you are working in, and I will help trace the cause, patch it, and check the behavior step by step.`;

  }

  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi")
  ) {

    return "Hello. I am here and ready. What are we making today?";

  }

  return `${avatarName} heard you. I can help you shape this into actions, write content, debug code, or think through the decision. Give me one more detail and I will make it concrete.`;

}

function getCurrentUserEmail() {

  return localStorage.getItem("misaUser") || "";

}

function escapeHtml(value) {

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
