import { escapeHtml } from "./storage.js";
import { $ } from "./ui.js";

export function createChatComponent({ products, chats, getUser, onSelect }) {
  let activeProductId = null;

  function userConversations() {
    const user = getUser();
    if (!user) return [];
    return products.all().filter((product) => {
      const messages = chats.messagesFor(product.id);
      if (!messages.length) return false;
      if (product.seller === user.name) return true;
      return messages.some((message) => message.sender === user.name);
    });
  }

  function renderConversations() {
    const user = getUser();
    const conversations = userConversations();
    $("#conversationList").innerHTML = conversations.length
      ? conversations.map((product) => `<button class="conversation ${product.id === activeProductId ? "selected" : ""}" data-conversation="${product.id}"><b>${escapeHtml(product.title)}</b><span>${product.seller === user?.name ? "Buyer conversation" : `Seller: ${escapeHtml(product.seller)}`}</span></button>`).join("")
      : `<p class="empty-state">Your conversations will appear here when you message a seller.</p>`;
    $("#messageCount").textContent = conversations.reduce((total, product) => total + chats.messagesFor(product.id).length, 0);
  }

  function renderChat(productId) {
    const product = products.find(productId);
    if (!product) return;
    activeProductId = Number(productId);
    const user = getUser();
    const messages = chats.messagesFor(productId);

    $("#chatPanel").innerHTML = `
      <div class="chat-header">
        <div>
          <b>${escapeHtml(product.title)}</b>
          <span class="meta">${product.seller === user?.name ? "Chat with buyer" : `Seller: ${escapeHtml(product.seller)}`}</span>
        </div>
      </div>
      <div class="chat-messages" id="chatMessagesContainer">
        ${messages.length ? messages.map((message) => `<div class="message ${message.sender === user?.name ? "mine-message" : "their-message"}"><span>${escapeHtml(message.text)}</span><small>${escapeHtml(message.sender)}</small></div>`).join("") : `<p class="empty-state">Start the conversation about this product.</p>`}
      </div>
      <form class="chat-form" id="chatForm">
        <input id="chatInput" required placeholder="Write a message...">
        <button class="btn" type="submit">Send</button>
      </form>`;

    const container = $("#chatMessagesContainer");
    if (container) container.scrollTop = container.scrollHeight;

    $("#chatForm").onsubmit = (event) => {
      event.preventDefault();
      const input = $("#chatInput");
      const text = input.value.trim();
      if (!text || !user) return;
      chats.addMessage(productId, { sender: user.name, text, time: Date.now() });
      renderChat(productId);
      renderConversations();
    };
  }

  $("#conversationList").onclick = (event) => {
    const productId = Number(event.target.closest("[data-conversation]")?.dataset.conversation);
    if (productId) {
      renderChat(productId);
      renderConversations();
      onSelect();
    }
  };

  return { renderConversations, renderChat };
}
