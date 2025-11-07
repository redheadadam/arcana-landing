const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbywTqaSGvCMq1Ef3ikfWEEG-liV9fxHsLUP7UrN-Zy3O4HAh9H7sncjNj-QbbZ5-RTf/exec"; // <-- replace with your deployed URL

document.addEventListener("DOMContentLoaded", () => {
    const counter = document.getElementById("counter");
    const emailInput = document.getElementById("email");
    const joinButton = document.querySelector("button");
    const confirmation = document.getElementById("confirmation");

    // 1️⃣ Fetch current count from Apps Script
    fetch(WEB_APP_URL)
        .then(response => response.json())
        .then(data => {
            counter.textContent = data.count;
        })
        .catch(err => console.error("Error fetching count:", err));

    // 2️⃣ Handle email submission
    joinButton.addEventListener("click", () => {
        const email = emailInput.value.trim();
        if (!email) return;

        fetch(WEB_APP_URL, {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            counter.textContent = data.count;       // update count live
            confirmation.textContent = "You're on the waitlist! ✅";
            emailInput.value = "";
        })
        .catch(err => {
            console.error("Error submitting email:", err);
            confirmation.textContent = "Something went wrong. Try again.";
        });
    });
});
