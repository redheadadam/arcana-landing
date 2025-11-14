const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxLn4qoJ4a-nbMikOE-PwLqM37yNKaqoFdL-fyg6n_w7GvXxmeGsgG94fCWdzMthGQj/exec"; // include /exec

document.addEventListener("DOMContentLoaded", () => {
    loadCount();

    const btn = document.getElementById("joinButton");
    const emailInput = document.getElementById("email");
    const confirmation = document.getElementById("confirmation");

    btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (!email) {
            confirmation.textContent = "Enter a valid email.";
            return;
        }

        confirmation.textContent = "Submitting...";

        try {
            const response = await fetch(WEB_APP_URL, {
                method: "POST",
                body: new URLSearchParams({ email })
            });

            const text = await response.text();
            const data = JSON.parse(text);

            if (data.error) {
                confirmation.textContent = "Error: " + data.error;
                return;
            }

            document.getElementById("counter").textContent = data.count;
            confirmation.textContent = "You're on the waitlist! ✅";
            emailInput.value = "";

        } catch (err) {
            confirmation.textContent = "Something went wrong.";
            console.error(err);
        }
    });
});

async function loadCount() {
    try {
        const response = await fetch(WEB_APP_URL);
        const text = await response.text();
        const data = JSON.parse(text);

        document.getElementById("counter").textContent = data.count;
    } catch (err) {
        console.error(err);
    }
}
