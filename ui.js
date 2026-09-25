import { escapeHtml } from "./storage.js";

export function $(selector) {
  return document.querySelector(selector);
}

export function showView(viewName) {
  document.querySelectorAll(".app-view").forEach((view) => {
    view.classList.add("hide");
  });

  const target = $(`#${viewName}View`);
  if (target) {
    target.classList.remove("hide");
  }

  document.querySelectorAll(".app-nav .tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === viewName);
  });
}

export function productPicture(product) {
  if (product.image) {
    return `<div class="pic"><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" loading="lazy"></div>`;
  }
  return `<div class="pic">${escapeHtml(product.emoji || "📦")}</div>`;
}

export function listingMeta(product) {
  const price = Number(product.price) || 0;
  const mrp = Math.round(price * 1.18);
  const off = mrp > price ? Math.round((1 - price / mrp) * 100) : 0;
  const rating = (3.9 + (Number(product.id) % 11) / 10).toFixed(1);
  const reviews = (Number(product.id) * 47) % 1800 + 86;
  return { price, mrp, off, rating, reviews };
}
