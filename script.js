// ======================================================
// LOGIN
// ======================================================

const loginBtn =
  document.getElementById("loginBtn");

if (loginBtn) {

  loginBtn.addEventListener("click", () => {

    const email =
      document.getElementById("email").value.trim();

    if (email === "") {

      alert("Please enter your email");

      return;

    }

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

    selectedAvatar = true;

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

const profileName =
  document.getElementById("profileName");

const welcomeText =
  document.getElementById("welcomeText");

if (
  profileImage &&
  profileName &&
  welcomeText
) {

  const avatarName =
    localStorage.getItem("misaAvatar");

  const avatarImage =
    localStorage.getItem("misaAvatarImage");

  const user =
    localStorage.getItem("misaUser") || "user@example.com";

  profileImage.src =
    avatarImage || "assets/avatars/a1.png";

  profileName.innerText =
    avatarName || "AI Companion";

  const rawName =
    user.split("@")[0];

  let firstName =
    rawName.replace(/[0-9]/g, "");

  firstName =
    firstName.charAt(0).toUpperCase() +
    firstName.slice(1);

  const hour =
    new Date().getHours();

  let greeting = "Welcome";

  if (hour < 12) {

    greeting = "Good Morning";

  } else if (hour < 18) {

    greeting = "Good Afternoon";

  } else {

    greeting = "Good Evening";

  }

  welcomeText.innerText =
    `${greeting}, ${firstName} ✨`;

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

const chatApiUrl =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/chat"
    : "/api/chat";

if(sendBtn){

  sendBtn.addEventListener(
    "click",
    sendMessage
  );

  userInput.addEventListener(
    "keypress",
    (e) => {

      if(e.key === "Enter"){

        sendMessage();

      }

    }
  );

}

async function sendMessage(){

  const message =
    userInput.value.trim();

  if(message === "") return;

  // USER MESSAGE

  const userDiv =
    document.createElement("div");

  userDiv.className =
    "message user";

  userDiv.innerText =
    message;

  chatBox.appendChild(userDiv);

  userInput.value = "";

  // AI THINKING

  const aiDiv =
    document.createElement("div");

  aiDiv.className =
    "message ai";

  aiDiv.innerText =
    "MISA is thinking...";

  chatBox.appendChild(aiDiv);

  chatBox.scrollTop =
    chatBox.scrollHeight;

  try{

    console.log("Sending:", message);

const response =
  await fetch(
    chatApiUrl,
        {
          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify({
            message:message
          })
        }
      );

      console.log("Status:", response.status);


    const data =
  await response.json();

console.log("SERVER RESPONSE:");
console.log(data);

aiDiv.innerText =
  data.reply || data.response || data.error || data.message || "No response";

  }catch(error){

    console.log(error);

    aiDiv.remove();

  }

}
