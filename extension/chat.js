
// Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "inquid-chat.firebaseapp.com",
  databaseURL: "https://inquid-chat-default-rtdb.firebaseio.com",
  projectId: "inquid-chat",
  storageBucket: "inquid-chat.appspot.com",
  messagingSenderId: "771474336667",
  appId: "1:771474336667:web:819d6a6fe187018f0a0f3e",
  measurementId: "G-2SRNLJ8J2X"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get or set user name
let myName = localStorage.getItem('github-chat-name');
if (!myName) {
  myName = 'GitHub User ' + Math.floor(Math.random() * 10000);
  localStorage.setItem('github-chat-name', myName);
}

const messagesContent = document.getElementById('messages-content');
const messageInput = document.getElementById('message');

// Handle message deletion from realtime database
firebase.database().ref("messages").on("child_removed", function (snapshot) {
  const el = document.getElementById("message-" + snapshot.key);
  if (el) {
    el.classList.add('deleted');
    el.innerHTML = "This message has been deleted";
  }
});

// Delete a message
function deleteMessage(self) {
  const messageId = self.getAttribute("data-id");
  db.collection("messages").doc(messageId).delete()
    .then(() => console.log("Document deleted"))
    .catch((error) => console.error("Error removing document: ", error));
}

// Send a message
function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  db.collection("messages").add({
    message: message,
    sender: myName,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then((docRef) => {
    console.log("Message sent: ", docRef.id);
    messageInput.value = "";
    messageInput.style.height = 'auto';
  })
  .catch((error) => {
    console.error("Error sending message: ", error);
  });

  return false;
}

// Auto-resize textarea
messageInput.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Send on Enter (Shift+Enter for newline)
messageInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Listen for new messages
db.collection("messages").orderBy("timestamp", "asc").limit(100)
  .onSnapshot((snapshot) => {
    messagesContent.innerHTML = '';
    
    if (snapshot.empty) {
      messagesContent.innerHTML = '<div class="loading">No messages yet. Start the conversation!</div>';
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const isSelf = data.sender === myName;
      
      const msgEl = document.createElement('div');
      msgEl.className = 'message ' + (isSelf ? 'self' : 'other');
      msgEl.id = 'message-' + doc.id;
      
      msgEl.innerHTML = `
        <div class="sender">${escapeHtml(data.sender || 'Anonymous')}</div>
        <div class="text">${escapeHtml(data.message || '')}</div>
        ${isSelf ? `<button class="btn-delete" data-id="${doc.id}" onclick="deleteMessage(this)">Delete</button>` : ''}
      `;
      
      messagesContent.appendChild(msgEl);
    });

    // Scroll to bottom
    const msgContainer = document.querySelector('.messages');
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, (error) => {
    messagesContent.innerHTML = `<div class="error-msg">Error loading messages: ${escapeHtml(error.message)}</div>`;
  });

// Helper
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Minimize button
const minimizeBtn = document.getElementById('chat-minimize');
if (minimizeBtn) {
  minimizeBtn.addEventListener('click', () => {
    parent.postMessage({ type: 'github-chat-minimize' }, '*');
  });
}
