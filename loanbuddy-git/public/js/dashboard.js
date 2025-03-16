let tryBtn=document.querySelector("#tryBtn");
tryBtn.addEventListener("click",()=>{
    console.log("hello tryBtn");
    window.location.href=`/checkform/${username}`;
})