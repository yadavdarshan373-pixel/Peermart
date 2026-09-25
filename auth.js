import { storage, toast } from "./storage.js";

export function createAuth(onChange) {
  let user = storage.get("peermartUser", null);
  if (user && typeof user === "object") {
    user.name = String(user.name || "").trim();
    user.email = String(user.email || "").trim();
    if (!user.name || !user.email) user = null;
  } else {
    user = null;
  }

  const $ = (selector) => document.querySelector(selector);

  $("#loginForm").onsubmit = (event) => {
    event.preventDefault();
    const name = $("#userName").value.trim();
    const email = $("#userEmail").value.trim();
    if (!name || !email) {
      toast("Please enter your name and email.");
      return;
    }
    user = { name, email, role: null };
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
