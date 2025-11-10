const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyFhQZwuxA1uAAoymRQEVuqJEU0X4jsEmLASD2HbusiUtXCn8DKAIA52489l6RiEBjB/exec";

document.addEventListener("DOMContentLoaded", () => {
  const counter = document.getElementById("counter");
  const emailInput = document.getElementById("email");
  const joinButton = document.getElementById("joinButton");
  const confirmation = document.getElementById("confirmation");

  // 1️⃣ Load current count via JSONP (no CORS needed)
  const script = document.createElement("script");
  script.src = `${WEB_APP_URL}?callback=updateCount&_=${Date.now()}`;
  document.body.appendChild(script);

  window.updateCount = (data) => {
    if (data && typeof data.count === "number") {
      counter.textContent = data.count;
    } else {
      confirmation.textContent = "Failed to load current count.";
    }
  };

  // 2️⃣ Handle POST (still via fetch)
  joinButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) {
      confirmation.textContent = "Please enter a valid email.";
      return;
    }

    joinButton.disabled = true;
    confirmation.textContent = "Submitting...";

    try {
      const formBody = new URLSearchParams({ email }).toString();
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        body: formBody,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const data = await response.json();
      counter.textContent = data.count ?? counter.textContent;
      confirmation.textContent = "You're on the waitlist! ✅";
      emailInput.value = "";
    } catch (err) {
      console.error(err);
      confirmation.textContent = "Something went wrong. Check console.";
    } finally {
      joinButton.disabled = false;
    }
  });
});
