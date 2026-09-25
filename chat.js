import { storage } from "./storage.js";

export function createChatStore() {
  return {
    messagesFor(productId) {
      return storage.get(`peermartMessages_${productId}`, []);
    },
    addMessage(productId, message) {
      const messages = this.messagesFor(productId);
      messages.push(message);
      storage.set(`peermartMessages_${productId}`, messages);
      return messages;
    }
  };
}
