document.getElementById("homeopt").addEventListener("click", function() {
    window.location.href = "/";
});

document.getElementById("aboutopt").addEventListener("click", function() {
    window.location.href = "/about";
});

document.getElementById("signinopt").addEventListener("click", function() {
    window.location.href = "/signin";
});

document.querySelector("#clicklogo").addEventListener("click",()=>{
    window.location.href="/";
})
let one=document.querySelector("#one");
let two=document.querySelector("#two");
let three=document.querySelector("#three");
let sendotp=document.querySelector("#sendotp");
let verrify=document.querySelector("#verrify");
let Sign_Up=document.querySelector("#Sign_Up");
let bottum=document.querySelector("#bottum");
sendotp.addEventListener("click", async () => {
    let email = document.querySelector("#email").value;
    let ms1 = document.querySelector("#ms1");
    if (!email) {
        ms1.innerText = "Please enter an email.";
        return;
    }
    sendotp.disabled = true;
    sendotp.style.opacity = "0.6";
    sendotp.innerHTML = "Sending OTP...";
    let response = await fetch("/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });
    let result = await response.json();
    sendotp.disabled = false;
    sendotp.style.opacity = "1";
    sendotp.innerHTML = "Send-OTP";
    if (result.success) {
        ms1.innerText = "OTP sent successfully!";
        one.style.visibility = "hidden";
        two.style.visibility = "visible";
        three.style.visibility = "hidden";
    } else {
        if(result.message==="Email already registered"){
            alert("You are existing user please signin");
            window.location.href = "/signin";
        }
        ms1.innerText = result.message;
    }
});
verrify.addEventListener("click", async () => {
    let email = document.querySelector("#email").value;
    let otp = document.querySelector("#otp").value;
    let ms2 = document.querySelector("#ms2");
    if (!otp) {
        ms2.innerText = "Please enter OTP.";
        verrify.disabled=true;
        verrify.style.opacity="0.6";
        verrify.innerText="Verrifying...";
        return;
    }
    verrify.disabled=true;
    verrify.style.opacity="0.6";
    verrify.innerText="Verrifying...";
    let response = await fetch("/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
    });
    let result = await response.json();

    verrify.disabled = false;
    verrify.style.opacity = "1";
    verrify.innerHTML = "verrify";
    if (result.success) {
        ms2.innerText = "OTP Verified!";
        one.style.visibility = "hidden";
        two.style.visibility = "hidden";
        three.style.visibility = "visible";
    } else {
        ms2.innerText = "Invalid OTP. Try again.";
    }
});
Sign_Up.addEventListener("click", async () => {
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#ep").value;
    let confirmPassword = document.querySelector("#cp").value;
    let ms3 = document.querySelector("#ms3");
    Sign_Up.disabled=true;
    Sign_Up.style.opacity="0.6";
    Sign_Up.innerText="Processing...";
    if (!email || !password || !confirmPassword) {
        ms3.innerText = "All fields are required.";
        Sign_Up.disabled=false;
        Sign_Up.style.opacity="1";
        Sign_Up.innerText="Sign-Up";
        return;
    }
    if (password !== confirmPassword) {
        ms3.innerText = "Passwords do not match.";
        Sign_Up.disabled=false;
        Sign_Up.style.opacity="1";
        Sign_Up.innerText="Sign-Up";
        return;
    }
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        ms3.innerText = "Password must have at least 1 lowercase, 1 uppercase, 1 number, 1 symbol, and be at least 8 characters long.";
        Sign_Up.disabled=false;
        Sign_Up.style.opacity="1";
        Sign_Up.innerText="Sign-Up";
        return;
    }
    let response = await fetch("/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    let result = await response.json();
    
    Sign_Up.disabled=false;
    Sign_Up.style.opacity="1";
    Sign_Up.innerText="Sign-Up";
    if (result.success) {
        let username = email.split("@")[0];
        window.location.href = `/dashboard/${username}`;
    } else {
        ms3.innerText = result.message;
    }
});