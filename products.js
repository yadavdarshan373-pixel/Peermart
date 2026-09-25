import { storage } from "./storage.js";
import { starterProducts } from "./data.js";

export function createProductStore() {
  const stored = storage.get("peermartProducts", starterProducts);
  let items = Array.isArray(stored) ? stored : starterProducts;

  function save() {
    storage.set("peermartProducts", items);
  }

  return {
    all() {
      return items;
    },
    find(id) {
      return items.find((p) => p.id === Number(id));
    },
    add(productData) {
      const newProduct = {
        ...productData,
        id: Date.now(),
        title: String(productData.title || "").trim(),
        price: Number(productData.price),
        image: String(productData.image || "").trim(),
        sold: false
      };
      items.unshift(newProduct);
      save();
      return newProduct;
    },
    remove(id) {
      items = items.filter((p) => p.id !== Number(id));
      save();
    },
    markSold(id) {
      const p = this.find(id);
      if (p) {
        p.sold = true;
        save();
      }
    }
  };
}
