document.getElementById("homeopt").addEventListener("click", function() {
    window.location.href = "/";
});
document.getElementById("aboutopt").addEventListener("click", function() {
    window.location.href = "/about";
});
document.getElementById("signupopt").addEventListener("click", function() {
    window.location.href = "/signup";
});

document.querySelector("#clicklogo").addEventListener("click",()=>{
    window.location.href="/";
})
let Sign_In=document.querySelector("#Sign_In");
Sign_In.addEventListener("click", async () => {
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    let ms1 = document.querySelector("#ms1");
    let signInBtn = document.getElementById("Sign_In");
    if (!email || !password) {
        ms1.innerText = "Please fill in all fields.";
        return;
    }
    signInBtn.disabled = true;
    signInBtn.style.opacity = "0.6";
    signInBtn.innerText = "Processing...";
    let response = await fetch("/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    let result = await response.json();
    if (result.success) {
        let username = email.split("@")[0];
        window.location.href = `/dashboard/${username}`;
    } else {
        ms1.innerText = result.message;
        signInBtn.disabled = false;
        signInBtn.style.opacity = "1";
        signInBtn.innerText = "Sign-In";
    }
});