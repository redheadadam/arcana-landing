const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwlDGq3elehJQxO__LM6pbjjw2oqQqI66DRxgM5SSQXpODbwOIymUugKYZXzgMgze0Q/exec";

document.addEventListener("DOMContentLoaded", () => {
  const counter = document.getElementById("counter");
  const emailInput = document.getElementById("email");
  const joinButton = document.getElementById("joinButton");
  const confirmation = document.getElementById("confirmation");

  // 1️⃣ Load current count (simple GET)
  fetch(WEB_APP_URL)
    .then((r) => r.json())
    .then((data) => {
      if (typeof data.count === "number") {
        counter.textContent = data.count;
      } else {
        confirmation.textContent = "Failed to load current count.";
      }
    })
    .catch((err) => {
      console.error("GET error:", err);
      confirmation.textContent = "Failed to load current count.";
    });

  // 2️⃣ Handle POST (URL-encoded → no preflight CORS)
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
      const body = new URLSearchParams({ email });

      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
      });

      const data = await response.json();

      if (typeof data.count === "number") {
        counter.textContent = data.count;
        confirmation.textContent = "You're on the waitlist! ✅";
        emailInput.value = "";
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("POST error:", err);
      confirmation.textContent = "Something went wrong. Please try again.";
    } finally {
      joinButton.disabled = false;
    }
  });
});
