const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzeUXsomT69fgJDrXr4-ypgqtfAJIuERcUf-vStVVFuG9dVNsfI5PW60QBZPBfTSsct/exec"; // <-- your deployed Apps Script URL

document.addEventListener("DOMContentLoaded", () => {
    const counter = document.getElementById("counter");
    const emailInput = document.getElementById("email");
    const joinButton = document.getElementById("joinButton");
    const confirmation = document.getElementById("confirmation");

    // 1️⃣ Fetch current count from Apps Script
    fetch(WEB_APP_URL)
        .then(response => response.json())
        .then(data => {
            counter.textContent = data.count;
        })
        .catch(err => console.error("Error fetching count:", err));

    // 2️⃣ Handle email submission
    joinButton.addEventListener("click", (e) => {
        e.preventDefault(); // prevents page reload
        const email = emailInput.value.trim();
        if (!email) return;

        joinButton.disabled = true; // prevent double submit

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
        })
        .finally(() => {
            joinButton.disabled = false;
        });
    });
});
