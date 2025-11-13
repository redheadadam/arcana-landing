const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyTSwUZCR3EoCsY864OUOAkOakXy1uS4KZaRoH4rQyLDTrCFjwpGNiVDER7nn2qUXwg/exec";

document.addEventListener("DOMContentLoaded", () => {
    const counter = document.getElementById("counter");
    const emailInput = document.getElementById("email");
    const joinButton = document.getElementById("joinButton");
    const confirmation = document.getElementById("confirmation");

    // GET: load current count
    fetch(WEB_APP_URL)
        .then(r => r.json())
        .then(data => {
            console.log("GET data:", data);
            counter.textContent = data.count ?? 0;
        })
        .catch(err => {
            console.error("Error fetching count:", err);
            confirmation.textContent = "Failed to load current count.";
        });

    // POST: submit email
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
                body,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            console.log("POST status:", response.status);
            const data = await response.json();
            console.log("POST data:", data);

            if (data.count !== undefined) {
                counter.textContent = data.count;
                confirmation.textContent = "You're on the waitlist! ✅";
                emailInput.value = "";
            } else if (data.error) {
                console.error("Server error:", data.error);
                confirmation.textContent = "Server error: " + data.error;
            }
        } catch (err) {
            console.error("Error submitting email:", err);
            confirmation.textContent = "Something went wrong. Check console.";
        } finally {
            joinButton.disabled = false;
        }
    });
});
