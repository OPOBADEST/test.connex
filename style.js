window.addEventListener("load", function () {
      setTimeout(function () {
        const preloader =
          document.getElementById("preloader");

        if (preloader) {
          preloader.classList.add("hide");
        }
      }, 1000);
    });


     const plan = document.getElementById("plan");
    const amount = document.getElementById("amount");

    const rateOutput = document.getElementById("rate");
    const investmentOutput = document.getElementById("investment");
    const profitOutput = document.getElementById("profit");
    const totalOutput = document.getElementById("total");
    const message = document.getElementById("message");

    function money(value) {
        return "$" + value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function myfunction1(){
        document.getElementById("bars").style.display="none";
        document.getElementById('times').style.
        display='block';
        document.getElementById('header2').style.display='block';
    }


    function myfunction2(){
        document.getElementById("bars").style.display="block";
        document.getElementById('times').style.
        display='none';
        document.getElementById('header2').style.display='none';
    }


     function myfunction3(){
        document.getElementById("bars").style.display="block";
        document.getElementById('times').style.
        display='none';
        document.getElementById('header2').style.display='none';
    }


    function autoCalculate() {
        const rate = Number(plan.value);
        const enteredAmount = amount.value;
        const investment = Number(enteredAmount);

        rateOutput.textContent = rate + "%";

        if (
            enteredAmount.trim() === "" ||
            !Number.isFinite(investment) ||
            investment < 100
        ) {
            investmentOutput.textContent = "$0.00";
            profitOutput.textContent = "$0.00";
            totalOutput.textContent = "$0.00";
            message.textContent =
                "Enter at least $100 to see your estimate.";
            return;
        }

        // Calculate automatically as the user types
        const profit = investment * rate / 100;
        const total = investment + profit;

        investmentOutput.textContent = money(investment);
        profitOutput.textContent = money(profit);
        totalOutput.textContent = money(total);

        message.textContent =
            "Estimate at " + rate +
            "%.  Return are guaranteed.";
    }

    // Recalculate whenever the amount changes
    amount.addEventListener("input", autoCalculate);

    // Recalculate whenever the plan changes
    plan.addEventListener("change", autoCalculate);

    // Show the default plan rate immediately
    autoCalculate();


    // ==========================================
// coNNex WHATSAPP LIVE SUPPORT
// ==========================================


// IMPORTANT:
// Replace this with your WhatsApp Business number.
// Use international format without +, spaces or dashes.
// Example format: 2348012345678

const WHATSAPP_NUMBER = "14843305472";


const whatsappSupport =
    document.getElementById("whatsappSupport");

const whatsappLauncher =
    document.getElementById("whatsappLauncher");

const whatsappPanel =
    document.getElementById("whatsappPanel");

const supportClose =
    document.getElementById("supportClose");


// ==========================================
// OPEN AND CLOSE SUPPORT WINDOW
// ==========================================

function openSupport() {

    whatsappPanel.classList.add("open");

    whatsappPanel.setAttribute("aria-hidden", "false");

    whatsappLauncher.setAttribute("aria-expanded", "true");

}


function closeSupport() {

    whatsappPanel.classList.remove("open");

    whatsappPanel.setAttribute("aria-hidden", "true");

    whatsappLauncher.setAttribute("aria-expanded", "false");

}


whatsappLauncher.addEventListener("click", () => {

    const isOpen =
        whatsappPanel.classList.contains("open");

    if (isOpen) {
        closeSupport();
    } else {
        openSupport();
    }

});


supportClose.addEventListener("click", closeSupport);


// ==========================================
// SEND QUESTION TO WHATSAPP BUSINESS
// ==========================================

document.querySelectorAll(".support-question").forEach(button => {

    button.addEventListener("click", () => {

        const question = button.dataset.question;

        if (
            !/^\d{8,15}$/.test(WHATSAPP_NUMBER) ||
            WHATSAPP_NUMBER.includes("X")
        ) {
            alert(
                "Please configure your coNNex WhatsApp Business number in the JavaScript file."
            );

            return;
        }

        const whatsappURL =
            "https://wa.me/" +
            WHATSAPP_NUMBER +
            "?text=" +
            encodeURIComponent(question);

        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );

    });

});


// ==========================================
// DRAGGABLE FLOATING WHATSAPP BUTTON
// DESKTOP + MOBILE
// ==========================================

let isDragging = false;
let wasDragged = false;

let startX = 0;
let startY = 0;

let originalLeft = 0;
let originalTop = 0;

let dragPointerId = null;


whatsappLauncher.addEventListener("pointerdown", event => {

    isDragging = true;
    wasDragged = false;

    dragPointerId = event.pointerId;

    const rect = whatsappSupport.getBoundingClientRect();

    startX = event.clientX;
    startY = event.clientY;

    originalLeft = rect.left;
    originalTop = rect.top;

    whatsappLauncher.setPointerCapture(event.pointerId);

});


whatsappLauncher.addEventListener("pointermove", event => {

    if (!isDragging || event.pointerId !== dragPointerId) {
        return;
    }

    const moveX = event.clientX - startX;
    const moveY = event.clientY - startY;

    if (
        Math.abs(moveX) > 5 ||
        Math.abs(moveY) > 5
    ) {
        wasDragged = true;
    }

    if (!wasDragged) {
        return;
    }

    const width = whatsappSupport.offsetWidth;
    const height = whatsappSupport.offsetHeight;

    const maxLeft = window.innerWidth - width;
    const maxTop = window.innerHeight - height;

    const newLeft = Math.max(
        0,
        Math.min(maxLeft, originalLeft + moveX)
    );

    const newTop = Math.max(
        0,
        Math.min(maxTop, originalTop + moveY)
    );

    whatsappSupport.style.left = newLeft + "px";
    whatsappSupport.style.top = newTop + "px";

    whatsappSupport.style.right = "auto";
    whatsappSupport.style.bottom = "auto";

});


whatsappLauncher.addEventListener("pointerup", event => {

    if (event.pointerId !== dragPointerId) {
        return;
    }

    isDragging = false;
    dragPointerId = null;

});


whatsappLauncher.addEventListener("pointercancel", () => {

    isDragging = false;
    dragPointerId = null;

});


// Prevent a drag from opening or closing the support panel.

whatsappLauncher.addEventListener("click", event => {

    if (wasDragged) {
        event.stopImmediatePropagation();
        event.preventDefault();
        wasDragged = false;
    }

}, true);


// ==========================================
// KEEP BUTTON INSIDE SCREEN AFTER RESIZING
// ==========================================

window.addEventListener("resize", () => {

    const rect = whatsappSupport.getBoundingClientRect();

    const maxLeft =
        window.innerWidth - whatsappSupport.offsetWidth;

    const maxTop =
        window.innerHeight - whatsappSupport.offsetHeight;

    const left = Math.max(
        0,
        Math.min(rect.left, maxLeft)
    );

    const top = Math.max(
        0,
        Math.min(rect.top, maxTop)
    );

    whatsappSupport.style.left = left + "px";
    whatsappSupport.style.top = top + "px";

    whatsappSupport.style.right = "auto";
    whatsappSupport.style.bottom = "auto";

});



