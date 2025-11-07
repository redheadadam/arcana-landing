const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxg-ZteqHQrjs-kCWGdun7ZdfnaUAkGuxG-3rIw94R2k8Nhpw8jrFe4xXTcVXYWigjf/exec"; // Your deployed Apps Script URL

document.addEventListener("DOMContentLoaded", () => {
    const counter = document.getElementById("counter");
    const emailInput = document.getElementById("email");
    const joinButton = document.getElementById("joinButton");
    const confirmation = document.getElementById("confirmation");

    // 1️⃣ Load current count from Apps Script
    fetch(WEB_APP_URL)
        .then(async (response) => {
            console.log("GET response status:", response.status);
            const text = await response.text();
            console.log("GET response text:", text);

            try {
                return JSON.parse(text);
            } catch (err) {
                console.error("Error parsing GET response JSON:", err);
                throw err;
            }
        })
        .then(data => {
            console.log("GET data:", data);
            counter.textContent = data.count ?? 0;
        })
        .catch(err => {
            console.error("Error fetching count:", err);
            confirmation.textContent = "Failed to load current count.";
        });

    // 2️⃣ Handle email submission
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
            // Use POST to send email to Apps Script
            const response = await fetch(WEB_APP_URL, {
                method: "POST",
                body: JSON.stringify({ email }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("POST response status:", response.status);
            const text = await response.text();
            console.log("POST response text:", text);

            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                console.error("Error parsing POST response JSON:", err);
                throw err;
            }

            console.log("POST data:", data);

            if (data.count !== undefined) {
                counter.textContent = data.count;
                confirmation.textContent = "You're on the waitlist! ✅";
                emailInput.value = "";
            } else if (data.error) {
                console.error("Apps Script returned error:", data.error);
                confirmation.textContent = "Something went wrong. Check console.";
            }

        } catch (err) {
            console.error("Error submitting email:", err);
            confirmation.textContent = "Something went wrong. Check console.";
        } finally {
            joinButton.disabled = false;
        }
    });
});
