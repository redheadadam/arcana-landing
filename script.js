const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw9kbEwUnNYCM540qiaIsk09RFj8D7sp5d3Lgg_0v5nnVf7z1jk9yt1D5Ie00nkeLC5cQ/exec";

// -----------------------
// Load Current Count
// -----------------------
async function loadCount() {
    try {
        const response = await fetch(WEB_APP_URL);
        const text = await response.text();
        const data = JSON.parse(text);

        console.log("Count loaded:", data);

        document.getElementById("counter").textContent = data.count;
    } catch (err) {
        console.error("Error loading count:", err);
    }
}

// -----------------------
// Submit Email
// -----------------------
async function submitEmail(email) {
    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            body: new URLSearchParams({ email })
        });

        const text = await response.text();
        const data = JSON.parse(text);

        console.log("Submit result:", data);

        if (data.error) {
            document.getElementById("confirmation").textContent = "Error: " + data.error;
            return;
        }

        document.getElementById("counter").textContent = data.count;
        document.getElementById("confirmation").textContent = "You're on the waitlist! ✅";
    } catch (err) {
        console.error("Error submitting:", err);
        document.getElementById("confirmation").textContent = "Something went wrong.";
    }
}

// -----------------------
// Setup Button
// -----------------------
document.addEventListener("DOMContentLoaded", () => {
    loadCount();

    const joinButton = document.getElementById("joinButton");
    const emailInput = document.getElementById("email");
    const confirmation = document.getElementById("confirmation");

    joinButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        if (!email) {
            confirmation.textContent = "Please enter a valid email.";
            return;
        }

        confirmation.textContent = "Submitting...";
        await submitEmail(email);

        emailInput.value = "";
    });
});
