import { escapeHtml } from "./storage.js";
import { $, productPicture, listingMeta } from "./ui.js";

export function createProductsComponent({ products, getUser, onOpen, onChat, onBuy }) {
  function syncChips() {
    const category = $("#categoryFilter")?.value || "";
    document.querySelectorAll("[data-cat]").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.cat === category);
    });
  }

  function render() {
    const query = ($("#searchInput")?.value || "").toLowerCase().trim();
    const category = $("#categoryFilter")?.value || "";
    const user = getUser();
    const visible = products.all().filter((product) =>
      !product.sold
      && (!category || product.category === category)
      && `${product.title} ${product.category} ${product.description}`.toLowerCase().includes(query)
    );

    const grid = $("#productGrid");
    grid.innerHTML = visible.length
      ? visible.map((product) => {
        const isOwn = product.seller === user?.name;
        const meta = listingMeta(product);
        const actions = isOwn
          ? `<div class="card-actions"><span class="meta">Your listing</span></div>`
          : `<div class="card-actions"><button class="btn alt" data-chat="${product.id}">Chat</button><button class="btn" data-buy="${product.id}">Buy now</button></div>`;
        return `<article class="card">
          <button class="product-open" data-product="${product.id}">
            ${productPicture(product)}
            <div class="info">
              <div class="meta">${escapeHtml(product.category)}</div>
              <h3>${escapeHtml(product.title)}</h3>
              <div class="rating"><span class="stars">${meta.rating} ★</span><span class="meta">(${meta.reviews.toLocaleString("en-IN")})</span></div>
              <div class="price-row">
                <div class="price">₹${meta.price.toLocaleString("en-IN")}</div>
                <span class="mrp">₹${meta.mrp.toLocaleString("en-IN")}</span>
                <span class="off">${meta.off}% off</span>
              </div>
              <div class="meta">Sold by ${escapeHtml(product.seller)}</div>
              <span class="assured">PeerMart Assured</span>
            </div>
          </button>
          ${actions}
        </article>`;
      }).join("")
      : `<div class="empty-catalog"><h3>No matching products</h3><p class="meta">Try another brand, category, or search term.</p></div>`;

    const count = $("#productCount");
    if (count) count.textContent = String(visible.length);
    syncChips();
  }

  $("#searchInput").oninput = render;
  $("#categoryFilter").onchange = render;
  document.querySelectorAll("[data-cat]").forEach((chip) => {
    chip.onclick = () => {
      $("#categoryFilter").value = chip.dataset.cat;
      render();
    };
  });
  $("#productGrid").onclick = (event) => {
    const target = event.target.closest("[data-product], [data-chat], [data-buy]");
    const productId = Number(target?.dataset.product || target?.dataset.chat || target?.dataset.buy);
    if (!productId) return;
    if (target.matches("[data-chat]")) onChat(productId);
    else if (target.matches("[data-buy]")) onBuy(productId);
    else onOpen(productId);
  };

  return { render };
}
