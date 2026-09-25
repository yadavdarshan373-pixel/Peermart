import { escapeHtml, toast } from "./storage.js";
import { $, productPicture } from "./ui.js";

export function createSellerComponent({ products, getUser, onUpdate }) {
  function render() {
    const user = getUser();
    const mine = products.all().filter((product) => product.seller === user?.name);
    $("#myListingsContainer").innerHTML = mine.length
      ? mine.map((product) => `<div class="mine">${productPicture(product)}<span><b>${escapeHtml(product.title)}</b><br><span class="meta">₹${Number(product.price).toLocaleString("en-IN")} · ${escapeHtml(product.category)} ${product.sold ? "· Sold" : "· Active"}</span></span><button class="btn alt" data-delete="${product.id}">Remove</button></div>`).join("")
      : `<p class="meta">You have not listed anything yet. Publish a product to see it here.</p>`;
  }

  $("#sellForm").onsubmit = (event) => {
    event.preventDefault();
    const user = getUser();
    if (!user) return;

    const title = $("#productTitle").value.trim();
    const price = Number($("#productPrice").value);
    if (!title) {
      toast("Please enter a product title.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      toast("Please enter a valid price.");
      return;
    }

    products.add({
      title,
      price,
      category: $("#productCategory").value,
      seller: user.name,
      emoji: "📦",
      image: $("#productImage").value.trim(),
      description: $("#productDescription").value.trim() || "Seller has not added a description yet."
    });
    event.target.reset();
    onUpdate();
    toast("Your product is now listed.");
  };

  $("#myListingsContainer").onclick = (event) => {
    const productId = Number(event.target.closest("[data-delete]")?.dataset.delete);
    if (!productId) return;
    products.remove(productId);
    render();
    onUpdate();
  };

  return { render };
}
