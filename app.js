// --- STORAGE & HELPERS ---
const storage = {
  get(key, fallback) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {}
  }
};

function toast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const $ = (selector) => document.querySelector(selector);

function showView(viewName) {
  document.querySelectorAll(".app-view").forEach((view) => {
    view.classList.toggle("hide", view.id !== `${viewName}View`);
  });
  document.querySelectorAll(".app-nav [data-view]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// --- DATA SOURCE (Exactly 1 product per category across 18 categories) ---
const sellers = ["Riya", "Arjun", "Meera", "Kabir", "Neha", "Aman", "Ishita", "Vikram", "Sara", "Dev"];

const images = {
  phone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
  car: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
  bike: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
  laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
  appliance: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80"
};

const rawProducts = [
  ["Mobile Phones", "📱", images.phone, "Apple iPhone 15", 65000, "Factory unlocked, 128GB, pristine condition with original box and fast charger."],
  ["Laptops", "💻", images.laptop, "MacBook Air M2", 85000, "Midnight color, 8GB RAM, 256GB SSD, battery health at 98%, includes sleeve."],
  ["Cars", "🚗", images.car, "Toyota Fortuner", 3200000, "Diesel automatic 4x4, single owner, 45,000 km driven, comprehensive insurance active."],
  ["Car Parts", "⚙️", images.car, "Alloy Wheels Set", 24000, "Set of 4 heavy-duty diamond cut alloy wheels (16-inch), compatible with most cars."],
  ["Bikes", "🏍️", images.bike, "Royal Enfield Classic 350", 165000, "Halcyon Black, single owner, fitted with genuine touring mirrors and sump guard."],
  ["Calculators", "🔢", images.laptop, "Casio Scientific Calculator", 1200, "FX-991ES Plus 2nd Edition, dual power, perfect for engineering and advanced mathematics."],
  ["Kitchen Appliances", "🍲", images.appliance, "Morphy Richards Mixer Grinder", 4500, "750W motor with 3 stainless steel jars, overload protection, heavy-duty build."],
  ["Large Appliances", "❄️", images.appliance, "Whirlpool 300L Refrigerator", 28000, "Double door frost-free inverter refrigerator, 3-star energy rating, 2 years old."],
  ["Audio & Sound", "🎧", images.phone, "Sony WH-1000XM5 Headphones", 29990, "Industry leading noise cancellation, crystal clear handsfree calling, 30-hour battery life."],
  ["Smartwatches", "⌚", images.phone, "Apple Watch Series 9", 41900, "GPS 41mm Midnight Aluminum Case with Midnight Sport Band, unused replacement unit."],
  ["Cameras", "📷", images.phone, "Canon EOS 1500D DSLR", 42000, "24.1 MP with 18-55mm lens kit, ideal for beginners starting their photography journey."],
  ["Gaming Consoles", "🎮", images.laptop, "Sony PlayStation 5", 49990, "Disc edition console with 1 DualSense wireless controller and HDMI cable."],
  ["Home Entertainment", "📺", images.phone, "Samsung 55\" 4K Smart TV", 45000, "Crystal 4K UHD processor, HDR 10+, slim bezel design, voice assistant built-in."],
  ["Fitness", "🏋️", images.car, "Cockatoo Motorized Treadmill", 22000, "Foldable fitness machine with auto incline, max speed 14 km/h, LED display."],
  ["Office Electronics", "🖨️", images.laptop, "HP LaserJet Printer", 18500, "Monochrome wireless laser printer, prints, scans and copies reliably."],
  ["Smart Home", "💡", images.phone, "Amazon Echo Dot (5th Gen)", 4499, "Smart speaker with Alexa, vibrant sound, deep bass, glacier white color."],
  ["Tools & Hardware", "🔧", images.car, "Bosch Cordless Drill Driver", 5500, "18V lithium-ion battery powered drill with multi-bit accessory set and carry case."],
  ["Furniture", "🪑", images.car, "Ergonomic Mesh Office Chair", 7500, "Adjustable lumbar support, 3D armrests, pneumatic height adjustment for long work hours."]
];

const starterProducts = rawProducts.map(([category, emoji, defaultImage, title, price, description], index) => ({
  id: index + 1,
  title,
  price,
  category,
  seller: sellers[index % sellers.length],
  emoji,
  image: defaultImage,
  description
}));

// --- PRODUCT STORE ---
function createProductStore() {
  let items = storage.get("peermartProducts", starterProducts);
  return {
    all() { return items; },
    find(id) { return items.find(p => p.id === Number(id)); },
    add(product) {
      const newProduct = { id: Date.now(), sold: false, ...product };
      items.unshift(newProduct);
      storage.set("peermartProducts", items);
      return newProduct;
    },
    remove(id) {
      items = items.filter(p => p.id !== Number(id));
      storage.set("peermartProducts", items);
    },
    markSold(id) {
      const p = this.find(id);
      if (p) {
        p.sold = true;
        storage.set("peermartProducts", items);
      }
    }
  };
}

// --- CHAT STORE & FAKE SEEDING ---
function createChatStore() {
  if (!localStorage.getItem("peermartMessages_1")) {
    localStorage.setItem("peermartMessages_1", JSON.stringify([
      { sender: "Arjun", text: "Hi, is this iPhone 15 still available for pickup today?", time: Date.now() - 3600000 },
      { sender: "Riya", text: "Yes it is! The box and charger are included.", time: Date.now() - 1800000 }
    ]));
  }
  if (!localStorage.getItem("peermartMessages_3")) {
    localStorage.setItem("peermartMessages_3", JSON.stringify([
      { sender: "Kabir", text: "What is the final mileage on this Toyota Fortuner?", time: Date.now() - 7200000 },
      { sender: "Meera", text: "It has driven 45,000 km with full service records.", time: Date.now() - 3600000 }
    ]));
  }

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

// --- AUTH LOGIC ---
function createAuth(onChange) {
  let user = storage.get("peermartUser", null);
  if (user && typeof user === "object") {
    user.name = String(user.name || "").trim();
    user.email = String(user.email || "").trim();
    user.password = String(user.password || "").trim();
    if (!user.name || !user.email) user = null;
  } else {
    user = null;
  }

  $("#loginForm").onsubmit = (event) => {
    event.preventDefault();
    const name = $("#userName").value.trim();
    const email = $("#userEmail").value.trim();
    const password = $("#userPassword").value.trim();

    if (!name || !email || !password) {
      toast("Please enter your name, email, and password.");
      return;
    }
    user = { name, email, password, role: null };
    storage.set("peermartUser", user);
    onChange(user);
  };

  document.querySelectorAll("[data-role]").forEach((button) => {
    button.onclick = () => {
      if (!user) return;
      user.role = button.dataset.role;
      storage.set("peermartUser", user);
      onChange(user);
      toast(`Welcome to PeerMart, ${user.name}!`);
    };
  });

  $("#logout").onclick = () => {
    user = null;
    storage.remove("peermartUser");
    onChange(null);
  };

  onChange(user);
  return { getUser: () => user };
}

// --- COMPONENTS ---
function createProductsComponent({ products, getUser, onOpen, onChat, onBuy }) {
  let currentCategory = "";
  let searchQuery = "";

  function render() {
    const list = products.all().filter(p => {
      if (currentCategory && p.category !== currentCategory) return false;
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    $("#productCount").textContent = list.length;
    const grid = $("#productGrid");
    
    if (!list.length) {
      grid.innerHTML = `<div class="empty-catalog"><h3>No listings found</h3><p>Try clearing filters or search terms.</p></div>`;
      return;
    }

    grid.innerHTML = list.map(p => `
      <div class="card">
        <button class="product-open" data-id="${p.id}">
          <div class="pic">${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}">` : p.emoji}</div>
          <div class="info">
            <div class="rating"><span class="stars">★★★★★</span><span class="meta">Verified peer</span></div>
            <h3>${escapeHtml(p.title)}</h3>
            <div class="price-row"><span class="price">₹${p.price.toLocaleString()}</span></div>
            <span class="assured">PeerMart Assured</span>
          </div>
        </button>
        <div class="card-actions">
          <button class="btn alt" data-chat-id="${p.id}">Chat</button>
          <button class="btn" data-buy-id="${p.id}" ${p.sold ? "disabled" : ""}>${p.sold ? "Sold Out" : "Buy Now"}</button>
        </div>
      </div>
    `).join("");
  }

  $("#productGrid").onclick = (e) => {
    const openBtn = e.target.closest("[data-id]");
    const chatBtn = e.target.closest("[data-chat-id]");
    const buyBtn = e.target.closest("[data-buy-id]");

    if (openBtn) onOpen(openBtn.dataset.id);
    if (chatBtn) onChat(chatBtn.dataset.chatId);
    if (buyBtn) onBuy(buyBtn.dataset.buyId);
  };

  $("#searchInput").oninput = (e) => {
    searchQuery = e.target.value.trim();
    render();
  };

  $("#categoryFilter").onchange = (e) => {
    currentCategory = e.target.value;
    document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c.dataset.cat === currentCategory));
    render();
  };

  document.querySelectorAll(".chip").forEach(chip => {
    chip.onclick = () => {
      currentCategory = chip.dataset.cat;
      document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === chip));
      $("#categoryFilter").value = currentCategory;
      render();
    };
  });

  return { render };
}

function createSellerComponent({ products, getUser, onUpdate }) {
  const form = $("#sellForm");
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const user = getUser();
      if (!user || user.role !== "seller") {
        toast("Only sellers can list items.");
        return;
      }
      const title = $("#productTitle").value.trim();
      const category = $("#productCategory").value;
      const price = Number($("#productPrice").value);
      const image = $("#productImage").value.trim();
      const description = $("#productDescription").value.trim();

      const emojis = { 
        "Mobile Phones": "📱", "Laptops": "💻", "Cars": "🚗", 
        "Car Parts": "⚙️", "Bikes": "🏍️", "Calculators": "🔢", 
        "Kitchen Appliances": "🍲", "Large Appliances": "❄️", 
        "Audio & Sound": "🎧", "Smartwatches": "⌚", "Cameras": "📷", 
        "Gaming Consoles": "🎮", "Home Entertainment": "📺", "Fitness": "🏋️", 
        "Office Electronics": "🖨️", "Smart Home": "💡", "Tools & Hardware": "🔧", "Furniture": "🪑" 
      };
      
      products.add({ title, category, price, image, description, seller: user.name, emoji: emojis[category] || "📦" });
      form.reset();
      toast("Listing published successfully!");
      onUpdate();
    };
  }

  function render() {
    const user = getUser();
    const container = $("#myListingsContainer");
    if (!container) return;
    if (!user || user.role !== "seller") {
      container.innerHTML = `<p class="empty-state">Switch to seller mode to manage inventory.</p>`;
      return;
    }

    const myListings = products.all().filter(p => p.seller === user.name);
    const activeCount = myListings.filter(p => !p.sold).length;
    const soldCount = myListings.filter(p => p.sold).length;
    const totalRevenue = myListings.filter(p => p.sold).reduce((sum, p) => sum + p.price, 0);

    container.innerHTML = `
      <div class="hero-stats" style="margin-bottom: 16px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
        <div style="background: var(--bg); padding: 10px; border-radius: 8px; border: 1px solid var(--line);">
          <b>${activeCount}</b><span style="font-size: 0.75rem;">Active</span>
        </div>
        <div style="background: var(--bg); padding: 10px; border-radius: 8px; border: 1px solid var(--line);">
          <b>${soldCount}</b><span style="font-size: 0.75rem;">Sold</span>
        </div>
        <div style="background: var(--bg); padding: 10px; border-radius: 8px; border: 1px solid var(--line);">
          <b>₹${totalRevenue.toLocaleString()}</b><span style="font-size: 0.75rem;">Revenue</span>
        </div>
      </div>
    ` + (myListings.length ? myListings.map(p => `
      <div class="mine">
        <div class="pic">${p.image ? `<img src="${escapeHtml(p.image)}" alt="">` : p.emoji}</div>
        <div>
          <b>${escapeHtml(p.title)}</b>
          <div class="meta">₹${p.price.toLocaleString()} · <span style="color: ${p.sold ? 'var(--ok)' : 'var(--brand)'}; font-weight: 600;">${p.sold ? "Sold" : "Active"}</span></div>
        </div>
        <button class="btn alt" data-delete="${p.id}">Delete</button>
      </div>
    `).join("") : `<p class="empty-state">You haven't listed any products yet.</p>`);

    container.onclick = (e) => {
      const delId = e.target.closest("[data-delete]")?.dataset.delete;
      if (delId) {
        products.remove(delId);
        render();
        onUpdate();
        toast("Listing removed.");
      }
    };
  }

  return { render };
}

function createChatComponent({ products, chats, getUser, onSelect }) {
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

  const listEl = $("#conversationList");
  if (listEl) {
    listEl.onclick = (event) => {
      const productId = Number(event.target.closest("[data-conversation]")?.dataset.conversation);
      if (productId) {
        renderChat(productId);
        renderConversations();
        onSelect();
      }
    };
  }

  return { renderConversations, renderChat };
}

function createModal({ products, getUser, onChat, onBuy }) {
  const ov = $("#ov");
  const modal = $("#modal");

  function open(productId) {
    const p = products.find(productId);
    if (!p) return;
    modal.innerHTML = `
      <button class="modal-close" id="modalClose">×</button>
      <div class="modal-product">
        <div class="modal-gallery"><div class="pic">${p.image ? `<img src="${escapeHtml(p.image)}" alt="">` : p.emoji}</div></div>
        <div class="modal-copy">
          <span class="eyebrow">${escapeHtml(p.category)}</span>
          <h2>${escapeHtml(p.title)}</h2>
          <div class="price-row"><span class="price">₹${p.price.toLocaleString()}</span></div>
          <div class="modal-description-box" style="margin-top: 12px;">
            <strong>Detailed Description:</strong>
            <p style="margin: 6px 0 0;">${escapeHtml(p.description)}</p>
          </div>
          <p class="meta" style="margin-top: 12px;">Verified Seller: <b>${escapeHtml(p.seller)}</b></p>
          <div class="modal-actions">
            <button class="btn alt" id="modalChat">Chat with seller</button>
            <button class="btn" id="modalBuy" ${p.sold ? "disabled" : ""}>${p.sold ? "Sold Out" : "Buy Now"}</button>
          </div>
        </div>
      </div>
    `;
    ov.classList.remove("hide");

    $("#modalClose").onclick = close;
    ov.onclick = (e) => { if (e.target === ov) close(); };
    $("#modalChat").onclick = () => onChat(p.id);
    $("#modalBuy").onclick = () => onBuy(p.id);
  }

  function close() {
    ov.classList.add("hide");
  }

  return { open, close };
}

// --- MAIN APPLICATION BOOTSTRAP ---
const productStore = createProductStore();
const chatStore = createChatStore();
let currentUser = null;

function refreshApp() {
  productView.render();
  sellerView.render();
  chatView.renderConversations();
}

function handleBuyProduct(productId) {
  const product = productStore.find(productId);
  if (!product || product.sold) {
    toast("This listing is no longer available.");
    modal.close();
    refreshApp();
    return;
  }
  if (product.seller === currentUser?.name) {
    toast("You cannot buy your own listing.");
    return;
  }
  productStore.markSold(productId);
  modal.close();
  refreshApp();
  toast("Order placed in this demo. The seller has been notified.");
}

function handleOpenChat(productId) {
  const product = productStore.find(productId);
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
    ? "Seller account · You can list products and view revenue stats"
    : "Buyer account · Find great deals";
  $('[data-view="sell"]').classList.toggle("hide", user.role !== "seller");
  showView("marketplace");
  refreshApp();
}

const modal = createModal({
  products: productStore,
  getUser: () => currentUser,
  onChat: handleOpenChat,
  onBuy: handleBuyProduct
});

const productView = createProductsComponent({
  products: productStore,
  getUser: () => currentUser,
  onOpen: modal.open,
  onChat: handleOpenChat,
  onBuy: handleBuyProduct
});

const sellerView = createSellerComponent({
  products: productStore,
  getUser: () => currentUser,
  onUpdate: refreshApp
});

const chatView = createChatComponent({
  products: productStore,
  chats: chatStore,
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