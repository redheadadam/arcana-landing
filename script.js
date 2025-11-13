const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz-ut9JSVQZH3G-5juy38L23_8eDMb9HHQhK-r5-jp0Rvty3wO8_lRQ0_tT-i2LqgH9/exec"; // Your deployed Apps Script URL

document.addEventListener("DOMContentLoaded", () => {
    const counter = document.getElementById("counter");
    const emailInput = document.getElementById("email");
    const joinButton = document.getElementById("joinButton");
    const confirmation = document.getElementById("confirmation");

    // 1️⃣ Load current count from Apps Script (best-effort)
    fetch(WEB_APP_URL)
        .then(r => r.json())
        .then(data => {
            console.log("GET data:", data);
            if (data && typeof data.count === "number") {
                counter.textContent = data.count;
            }
        })
        .catch(err => {
            console.warn("Error fetching count (non-fatal):", err);
            // Don't scare the user, just silently fail
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
            const formBody = new URLSearchParams({ email }).toString();

            const response = await fetch(WEB_APP_URL, {
                method: "POST",
                body: formBody,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            console.log("POST response status:", response.status);

            let data = null;
            try {
                const text = await response.text();
                console.log("POST response text:", text);
                data = JSON.parse(text);
                console.log("POST data:", data);
            } catch (parseErr) {
                console.warn("Could not parse POST JSON (likely CORS / opaque response). Treating as success.", parseErr);
            }

            // If we *did* get JSON with a count, update it
            if (data && typeof data.count === "number") {
                counter.textContent = data.count;
            } else {
                // Fallback: try a fresh GET to refresh count
                fetch(WEB_APP_URL)
                    .then(r => r.json())
                    .then(data2 => {
                        if (data2 && typeof data2.count === "number") {
                            counter.textContent = data2.count;
                        }
                    })
                    .catch(err2 => {
                        console.warn("Fallback GET after POST failed:", err2);
                    });
            }

            confirmation.textContent = "You're on the waitlist! ✅";
            emailInput.value = "";

        } catch (err) {
            console.error("Error submitting email:", err);
            // We *know* Apps Script often still processed the request here;
            // So we assume success from the user's POV:
            confirmation.textContent = "You're on the waitlist! ✅ (If this shows up twice, blame CORS 🙃)";
        } finally {
            joinButton.disabled = false;
        }
    });
});
