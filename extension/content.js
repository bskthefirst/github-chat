
// GitHub Chat - Content Script
(function() {
  if (document.getElementById('github-chat-container')) return; // Already injected

  // Create toggle button
  const toggleBtn = document.createElement('div');
  toggleBtn.id = 'github-chat-toggle';
  toggleBtn.innerHTML = '💬';
  toggleBtn.title = 'Open GitHub Chat';
  toggleBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #2da44e;
    color: white;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: transform 0.2s, box-shadow 0.2s;
    user-select: none;
    border: 2px solid white;
  `;
  toggleBtn.addEventListener('mouseenter', () => {
    toggleBtn.style.transform = 'scale(1.1)';
    toggleBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
  });
  toggleBtn.addEventListener('mouseleave', () => {
    toggleBtn.style.transform = 'scale(1)';
    toggleBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  });

  // Create chat panel container
  const chatContainer = document.createElement('div');
  chatContainer.id = 'github-chat-container';
  chatContainer.style.cssText = `
    position: fixed;
    bottom: 90px;
    right: 20px;
    z-index: 9998;
    width: 380px;
    height: 520px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    display: none;
    overflow: hidden;
    background: white;
    border: 1px solid #d0d7de;
  `;

  // Create chat iframe
  const chatIframe = document.createElement('iframe');
  chatIframe.id = 'github-chat-iframe';
  chatIframe.src = chrome.runtime.getURL('chat.html');
  chatIframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
  `;
  chatContainer.appendChild(chatIframe);

  // Toggle functionality
  let isOpen = false;
  toggleBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    chatContainer.style.display = isOpen ? 'block' : 'none';
    toggleBtn.innerHTML = isOpen ? '✕' : '💬';
    toggleBtn.style.background = isOpen ? '#cf222e' : '#2da44e';
    toggleBtn.title = isOpen ? 'Close GitHub Chat' : 'Open GitHub Chat';
  });

  // Append to page
  document.body.appendChild(toggleBtn);
  document.body.appendChild(chatContainer);

  // Restore state
  chrome.storage.local.get(['chatOpen'], (result) => {
    if (result.chatOpen) {
      toggleBtn.click();
    }
  });
  
  // Save state
  const observer = new MutationObserver(() => {
    chrome.storage.local.set({ chatOpen: isOpen });
  });
  observer.observe(chatContainer, { attributes: true, attributeFilter: ['style'] });
})();
