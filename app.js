import { toast } from "./storage.js";
import { createProductStore } from "./products.js";
import { createChatStore } from "./chat.js";
import { $, showView } from "./ui.js";
import { createAuth } from "./auth.js";
import { createProductsComponent } from "./products-component.js";
import { createSellerComponent } from "./seller-component.js";
import { createChatComponent } from "./chat-component.js";
import { createModal } from "./modal-component.js";

const products = createProductStore();
const chats = createChatStore();
let currentUser = null;

function refresh() {
  productView.render();
  sellerView.render();
  chatView.renderConversations();
}

function buyProduct(productId) {
  const product = products.find(productId);
  if (!product || product.sold) {
    toast("This listing is no longer available.");
    modal.close();
    refresh();
    return;
  }
  if (product.seller === currentUser?.name) {
    toast("You cannot buy your own listing.");
    return;
  }
  products.markSold(productId);
  modal.close();
  refresh();
  toast("Order placed in this demo. The seller has been notified.");
}

function openChat(productId) {
  const product = products.find(productId);
  if (!product) return;
  if (product.seller === currentUser?.name) {
    toast("This is your listing. Buyer messages will show in Messages.");
    return;
  }
  showView("messages");
  chatView.renderChat(productId);
  chatView.renderConversations();
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("peermartTheme", theme);
  $("#theme").textContent = theme === "dark" ? "Light mode" : "Dark mode";
}

function updateApp(user) {
  currentUser = user;
  $("#login").classList.toggle("hide", Boolean(user));
  $("#roleChoice").classList.toggle("hide", !user || Boolean(user.role));
  $("#app").classList.toggle("hide", !user || !user.role);
  modal.close();

  if (!user || !user.role) return;

  $("#welcome").textContent = `${user.name} · ${user.role}`;
  $("#roleHint").textContent = user.role === "seller"
    ? "Seller account · You can list products"
    : "Buyer account · Find something great";
  $('[data-view="sell"]').classList.toggle("hide", user.role !== "seller");
  showView("marketplace");
  refresh();
}

const modal = createModal({
  products,
  getUser: () => currentUser,
  onChat: openChat,
  onBuy: buyProduct
});
const productView = createProductsComponent({
  products,
  getUser: () => currentUser,
  onOpen: modal.open,
  onChat: openChat,
  onBuy: buyProduct
});
const sellerView = createSellerComponent({ products, getUser: () => currentUser, onUpdate: refresh });
const chatView = createChatComponent({
  products,
  chats,
  getUser: () => currentUser,
  onSelect: () => showView("messages")
});

const savedTheme = localStorage.getItem("peermartTheme");
const initialTheme = savedTheme === "dark" || savedTheme === "light"
  ? savedTheme
  : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(initialTheme);

$("#theme").onclick = () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
};

document.querySelectorAll(".app-nav [data-view]").forEach((button) => {
  button.onclick = () => {
    if (button.dataset.view === "sell" && currentUser?.role !== "seller") return;
    showView(button.dataset.view);
  };
});

createAuth(updateApp);
