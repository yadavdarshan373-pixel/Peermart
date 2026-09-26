# 🛒 PeerMart — Peer-to-Peer Marketplace

PeerMart is a lightweight, modern, client-side peer-to-peer (P2P) marketplace web application inspired by eBay[cite: 1, 7, 9]. It connects local buyers and sellers directly[cite: 1], enabling users to browse listings across 18 unique categories, securely negotiate via built-in direct messaging, and track inventory or revenue through a dedicated seller dashboard.

---

## ✨ Key Features

* **🛡️ Secure User Authentication & Roles**: Sign in with custom user details and choose between a **Buyer** or **Seller** account setup[cite: 1].
* **📱 18 Diverse Categories**: Pre-populated catalog spanning mobile phones, laptops, cars, appliances, furniture, and more (exactly 1 featured seed product per category).
* **💬 Direct P2P Messaging**: Built-in chat interface with pre-seeded conversations between buyers and sellers to negotiate pricing and details.
* **📦 Upgraded Seller Hub**: Real-time inventory metrics tracking active listings, sold items, and total cumulative revenue[cite: 9].
* **🔍 Advanced Discovery**: Instant search bar filtering and multi-category chips to quickly locate items[cite: 9].
* **🌓 Theme Toggle**: Fully responsive design with native **Light / Dark mode** preferences stored locally[cite: 9].
* **💾 Local Storage Persistence**: All products, user sessions, and chat logs persist seamlessly using browser `localStorage`.

---

## 🛠️ Technology Stack

* **HTML5**: Semantic markup structure with accessible form controls and responsive layouts[cite: 9].
* **CSS3**: Custom variables (`:root`), Flexbox, Grid layout, and dynamic theme switching designed with an eBay-inspired aesthetic[cite: 1, 7, 9].
* **JavaScript (ES6+)**: Component-driven architecture using pure vanilla JavaScript, event delegation, and state storage handlers[cite: 9].

---

## 📁 File Architecture

Ensure all three files are placed in the same root folder on your local machine:

```text
peermart/
├── index.html    # Main HTML structure, views, modals, and templates
├── style.css     # Design system, layout grid, theme variables, and responsive media queries
└── app.js        # Core logic, local storage engine, state management, and component routers
