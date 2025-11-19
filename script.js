const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw9kbEwUnNYCM540qiaIsk09RFj8D7sp5d3Lgg_0v5nnVf7z1jk9yt1D5Ie00nkeLC5cQ/exec"; 
// Replace with: https://script.google.com/macros/s/.../exec

// -----------------------
// Load Current Count (GET)
// -----------------------
async function loadCount() {
    try {
        const response = await fetch(WEB_APP_URL);
        const text = await response.text();
        const data = JSON.parse(text);

        console.log("Loaded count:", data);

        const odometerEl = document.getElementById("odometer");
        odometerEl.innerHTML = data.count;   // triggers odometer animation

    } catch (err) {
        console.error("Error loading count:", err);
    }
}

// -----------------------
// Submit Email (POST)
// -----------------------
async function submitEmail(email) {
    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            body: new URLSearchParams({ email })
        });

        const text = await response.text();
        const data = JSON.parse(text);

        console.log("Submit response:", data);

        if (data.error) {
            document.getElementById("confirmation").textContent = "Error: " + data.error;
            return;
        }

        // Update odometer
        const odometerEl = document.getElementById("odometer");
        odometerEl.innerHTML = data.count;

        const conf = document.getElementById("confirmation");

	// update text FIRST
	conf.textContent = "You're on the waitlist! ✅";

	// reset + replay fade-in animation
	conf.style.animation = "none";
	conf.offsetHeight;          
	conf.style.animation = "confirmFade 0.6s ease-out forwards";



    } catch (err) {
        console.error("Submit error:", err);
        document.getElementById("confirmation").textContent = "Something went wrong.";
    }
}

// -----------------------
// UI Setup
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
