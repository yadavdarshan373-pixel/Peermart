import { escapeHtml } from "./storage.js";
import { $, productPicture, listingMeta } from "./ui.js";

export function createModal({ products, getUser, onChat, onBuy }) {
  function close() {
    $("#ov").classList.add("hide");
    $("#modal").innerHTML = "";
  }

  function open(productId) {
    const product = products.find(productId);
    if (!product) return;
    const isOwn = product.seller === getUser()?.name;
    const meta = listingMeta(product);
    $("#ov").classList.remove("hide");
    $("#modal").innerHTML = `
      <button class="modal-close" type="button" id="modalClose" aria-label="Close">×</button>
      <div class="modal-product">
        <div class="modal-gallery">${productPicture(product)}</div>
        <div class="modal-copy">
          <p class="eyebrow">${escapeHtml(product.category)}</p>
          <h2>${escapeHtml(product.title)}</h2>
          <div class="rating"><span class="stars">${meta.rating} ★</span><span class="meta">${meta.reviews.toLocaleString("en-IN")} ratings</span></div>
          <div class="price-row">
            <div class="price">₹${meta.price.toLocaleString("en-IN")}</div>
            <span class="mrp">₹${meta.mrp.toLocaleString("en-IN")}</span>
            <span class="off">${meta.off}% off</span>
          </div>
          <p>${escapeHtml(product.description)}</p>
          <p class="meta">Sold by <b>${escapeHtml(product.seller)}</b> · PeerMart Assured · 7-day returns</p>
          <div class="modal-actions">
            ${isOwn
              ? `<span class="meta">This is your listing</span>`
              : `<button class="btn alt" id="modalChat">Chat with seller</button><button class="btn" id="modalBuy">Buy now</button>`}
          </div>
        </div>
      </div>`;
    $("#modalClose").onclick = close;
    if (!isOwn) {
      $("#modalChat").onclick = () => { close(); onChat(productId); };
      $("#modalBuy").onclick = () => onBuy(productId);
    }
  }

  $("#ov").onclick = (event) => {
    if (event.target === $("#ov")) close();
  };

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !$("#ov").classList.contains("hide")) close();
  });

  return { open, close };
}
