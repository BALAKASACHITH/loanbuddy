let lf=document.querySelector("#loanForm")
lf.addEventListener("submit", async function (event) {
    event.preventDefault();
    let formData = new FormData(this);
    let jsonObject = {};
    formData.forEach((value, key) => { jsonObject[key] = value; });
    const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonObject)
    });
    const result = await response.json();
    alert("Loan Eligibility: " + result.result);
});
