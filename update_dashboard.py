html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard • MISA.SPACE</title>
  <link rel="stylesheet" href="style.css">
</head>

<body class="dashboard-body">
  <div class="stars"></div>
  <div class="stars2"></div>
  <div class="stars3"></div>

  <main class="dashboard">
    <section class="dashboard-hero">
      <div class="hero-container">
        <div class="hero-avatar">
          <img id="profileImage" src="assets/avatars/a1.png" alt="Selected avatar">
        </div>
        
        <div class="hero-content">
          <p class="eyebrow">Live workspace</p>
          <h1 id="welcomeText">Welcome back</h1>
          <p class="greeting-subtitle">Settle in and let's shape something thoughtful today.</p>
          
          <div class="profile-actions">
            <button class="action-button primary" id="newChatBtn">New chat</button>
            <button class="action-button secondary" id="historyBtn">Previous chat</button>
            <button class="action-button ghost" id="settingsBtn">Settings</button>
          </div>
        </div>

        <div class="session-chip">
          <span></span>
          MISA is listening
        </div>
      </div>
    </section>

    <section class="chat-panel">
      <div class="chat-header">
        <div>
          <p class="eyebrow">Conversation</p>
          <h2>Ask MISA anything</h2>
        </div>
        <p id="chatPresence">Ready</p>
      </div>

      <div class="chat-box" id="chatBox">
        <div class="message ai">
          <span class="message-author">MISA</span>
          <p>Hello. I am here with you. Tell me what you want to build, plan, fix, or understand, and I will help you move through it clearly.</p>
        </div>
      </div>

      <div class="chat-input">
        <input
          type="text"
          id="chatInput"
          placeholder="Message MISA..."
          autocomplete="off">
        <button id="sendBtn" type="button">Send</button>
      </div>
    </section>
  </main>

  <script src="script.js"></script>
</body>
</html>
"""

with open('c:\\Users\\SHRUTI SINGH\\Desktop\\misa-space\\dashboard.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Dashboard updated successfully!")
