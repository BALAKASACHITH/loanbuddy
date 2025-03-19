document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loanForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Loan Eligibility: " + result.result);
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            alert("Request failed: " + error.message);
        }
    });
});
