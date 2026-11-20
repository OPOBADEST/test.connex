// Dashboard page navigation
const pageDetails = {
    dashboard: {
        title: "Dashboard",
        subtitle: "Welcome back! Here's an overview of your account."
    },

    invest: {
        title: "Invest",
        subtitle: "Here you can invest in various plans."
    },

    deposit: {
        title: "Deposit",
        subtitle: "Add funds to your investment account."
    },

    withdraw: {
        title: "Withdraw",
        subtitle: "Request a withdrawal from your account."
    },

    transactions: {
        title: "Transactions",
        subtitle: "View your account transaction history."
    },

    referrals: {
        title: "Referrals",
        subtitle: "Invite others and track your referrals."
    },

    kyc: {
        title: "KYC Verification",
        subtitle: "Verify your identity to access account services."
    },

    settings: {
        title: "Settings",
        subtitle: "Manage your account preferences."
    }
};


// Get navigation links and page sections
const navLinks = document.querySelectorAll(
    ".navigation .nav-link"
);

const contentSections = document.querySelectorAll(
    ".content-section"
);

const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");


// Function to switch pages
function showPage(pageId) {

    // Handle logout separately
    if (pageId === "logout") {
        window.location.href = "logout.php";
        return;
    }

    // Check whether the requested page exists
    if (!pageDetails[pageId]) return;

    // Remove active class from all navigation links
    navLinks.forEach(link => {
        link.classList.remove("active");
    });

    // Activate the clicked navigation link
    const activeLink = document.querySelector(
        `.navigation .nav-link[href="#${pageId}"]`
    );

    if (activeLink) {
        activeLink.classList.add("active");
    }

    // Hide all content sections
    contentSections.forEach(section => {
        section.classList.remove("active-section");
    });

    // Show the selected section
    const selectedSection = document.getElementById(pageId);

    if (selectedSection) {
        selectedSection.classList.add("active-section");
    }

    // Update page heading and subtitle
    pageTitle.textContent = pageDetails[pageId].title;
    pageSubtitle.textContent = pageDetails[pageId].subtitle;

    // Update browser URL hash
    window.location.hash = pageId;
}


// Listen for sidebar clicks
navLinks.forEach(link => {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        const pageId = this.getAttribute("href").substring(1);

        showPage(pageId);

    });

});


// Load the correct page when the dashboard opens
const initialPage = window.location.hash.substring(1);

if (initialPage === "logout") {
    showPage("logout");
} else {
    showPage(
        pageDetails[initialPage] ? initialPage : "dashboard"
    );
}


// Handle browser back and forward buttons
window.addEventListener("hashchange", function() {

    const pageId = window.location.hash.substring(1);

    if (pageDetails[pageId]) {
        showPage(pageId);
    }

});






// ACTIVE INVESTMENTS

const activeInvestments = [

    {
        id: "INV001",
        plan: "Long-term Plan",
        amount: 10000,
        startedAt: "2026-11-09T23:58:00",
        endsAt: "2027-05-09T23:58:00"
    }

];

// FORMAT DATE

function formatInvestmentDate(date) {

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }).format(date);

}

// FORMAT AMOUNT

function formatInvestmentAmount(amount) {

    return "$" + Number(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

}

// DISPLAY INVESTMENTS

function renderActiveInvestments() {

    const tableBody = document.getElementById("activeInvestmentRows");

    if (!tableBody) return;

    if (activeInvestments.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:30px;">
                    You don't have any active investments yet.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = activeInvestments.map(investment => {

        const started = new Date(investment.startedAt);
        const ends = new Date(investment.endsAt);

        return `
            <tr class="active-investment-row"
                data-start="${started.getTime()}"
                data-end="${ends.getTime()}">

                <td class="investment-plan">
                    ${investment.plan}
                </td>

                <td class="investment-amount">
                    ${formatInvestmentAmount(investment.amount)}
                </td>

                <td>
                    ${formatInvestmentDate(started)}
                </td>

                <td>
                    ${formatInvestmentDate(ends)}
                </td>

                <td>
                    <span class="investment-status">
                        In Progress
                    </span>
                </td>

                <td>
                    <div class="investment-progress">

                        <div class="investment-countdown">
                            Calculating...
                        </div>

                        <div class="investment-progress-track">
                            <div class="investment-progress-fill"></div>
                        </div>

                        <div class="investment-progress-label">
                            0% completed
                        </div>

                    </div>
                </td>

            </tr>
        `;

    }).join("");

    updateInvestmentCountdowns();

}

// UPDATE COUNTDOWN AND PROGRESS

function updateInvestmentCountdowns() {

    const rows = document.querySelectorAll(".active-investment-row");

    const now = Date.now();

    rows.forEach(row => {

        const startTime = Number(row.dataset.start);
        const endTime = Number(row.dataset.end);

        const totalDuration = endTime - startTime;

        const remaining = Math.max(0, endTime - now);

        const elapsed = Math.min(
            totalDuration,
            Math.max(0, now - startTime)
        );

        let percentage = totalDuration > 0
            ? Math.round((elapsed / totalDuration) * 100)
            : 0;

        percentage = Math.max(0, Math.min(100, percentage));

        const days = Math.floor(remaining / 86400000);
        const hours = Math.floor((remaining % 86400000) / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);

        const countdown = row.querySelector(".investment-countdown");

        const progressFill = row.querySelector(".investment-progress-fill");

        const progressLabel = row.querySelector(".investment-progress-label");

        const status = row.querySelector(".investment-status");

        if (remaining > 0) {

            countdown.textContent =
                `${days}d ${hours}h ${minutes}m ${seconds}s`;

            status.textContent = "In Progress";
            status.classList.remove("completed");

        } else {

            countdown.textContent = "Completed";

            status.textContent = "Completed";
            status.classList.add("completed");

        }

        progressFill.style.width = percentage + "%";

        progressLabel.textContent =
            percentage + "% completed";

    });

}

// START

renderActiveInvestments();

// UPDATE EVERY SECOND

setInterval(updateInvestmentCountdowns, 1000);











/* =====================================
   CO NNEX ACCOUNT OVERVIEW UI GRAPH
===================================== */

const graph = document.getElementById("overviewGraph");

if (graph) {

    const grid = document.getElementById("overviewGrid");
    const area = document.getElementById("overviewArea");
    const line = document.getElementById("overviewLine");
    const pointsGroup = document.getElementById("overviewPoints");

    const values = [35, 110, 180, 300, 420, 550, 800];

    const width = 760;
    const height = 250;

    const top = 15;
    const bottom = 225;

    // DRAW GRID LINES.
    for (let i = 0; i < 4; i++) {

        const y = top + (i * (bottom - top) / 3);

        const gridLine = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

        gridLine.setAttribute("x1", 0);
        gridLine.setAttribute("x2", width);
        gridLine.setAttribute("y1", y);
        gridLine.setAttribute("y2", y);

        grid.appendChild(gridLine);

    }

    // CREATE GRAPH COORDINATES.
    const maxValue = 850;

    const coordinates = values.map((value, index) => {

        return {

            x: index * (width / (values.length - 1)),

            y: bottom - (value / maxValue) * (bottom - top)

        };

    });

    // DRAW LINE.
    const linePath = coordinates.map((point, index) => {

        return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;

    }).join(" ");

    line.setAttribute("d", linePath);

    // DRAW SHADED AREA.
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];

    area.setAttribute(
        "d",
        linePath +
        ` L ${last.x} ${height}` +
        ` L ${first.x} ${height} Z`
    );

    // DRAW POINTS.
    coordinates.forEach(point => {

        const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        circle.setAttribute("cx", point.x);
        circle.setAttribute("cy", point.y);
        circle.setAttribute("r", 5);

        pointsGroup.appendChild(circle);

    });

}


document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");

    if (!menuToggle || !sidebar) {
        console.error("Menu toggle or sidebar not found!");
        return;
    }

    menuToggle.addEventListener("click", function (event) {
        event.stopPropagation();

        sidebar.classList.toggle("active");

        console.log("Menu clicked:", sidebar.classList.contains("active"));
    });

    // Close sidebar after selecting a navigation link
    document.querySelectorAll(".navigation .nav-link").forEach(link => {
        link.addEventListener("click", function () {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove("active");
            }
        });
    });

});






// Deposit payment information

const paymentData = {

    btc: {
        name: "Bitcoin (BTC)",
        network: "Bitcoin Network",
        icon: "₿",
        color: "#f7931a",
        address: "bc1qtdw3xcy7mn65gv35yk9edw56wl6mr3ksx9pmdw",
        warning: "Only send BTC using the Bitcoin network. Sending another cryptocurrency may result in permanent loss of funds."
    },

    trx: {
        name: "TRON (TRX)",
        network: "TRON Network",
        icon: "T",
        color: "#e50924",
        address: "TVhxWvb77563b7CoLZTuw6uKtQaG7DRhVi",
        warning: "Only send TRX using the TRON network. Sending another cryptocurrency may result in permanent loss of funds."
    },

    trc20: {
        name: "USDT (TRC20)",
        network: "TRON Network",
        icon: "₮",
        color: "#26a17b",
        address: "TVhxWvb77563b7CoLZTuw6uKtQaG7DRhVi",
        warning: "Only send USDT using the TRC20 network. Do not send ERC20 or BEP20 tokens to this address."
    },

    erc20: {
        name: "USDT (ERC20)",
        network: "Ethereum Network",
        icon: "₮",
        color: "#26a17b",
        address: "0xbcC77E53a1a460FdA83787B9a873E57f5e5d613e",
        warning: "Only send USDT using the ERC20 network. Do not send TRC20 or BEP20 tokens to this address."
    },

    bep20: {
        name: "USDT (BEP20)",
        network: "BNB Smart Chain",
        icon: "₮",
        color: "#26a17b",
        address: "0xbcC77E53a1a460FdA83787B9a873E57f5e5d613e",
        warning: "Only send USDT using the BEP20 network. Do not send ERC20 or TRC20 tokens to this address."
    },

    // BNB

    bnb: {
        name: "BNB",
        network: "BNB Smart Chain",
        icon: "◆",
        color: "#f3ba2f",
        address: "0xbcC77E53a1a460FdA83787B9a873E57f5e5d613e",
        warning: "Send BNB only through BNB Smart Chain."
    },

    // Ethereum

    eth: {
        name: "Ethereum (ETH)",
        network: "Ethereum Network",
        icon: "♦",
        color: "#627eea",
        address: "0xbcC77E53a1a460FdA83787B9a873E57f5e5d613e",
        warning: "Send ETH only through the Ethereum Network."
    },

    // TON

    ton: {
        name: "TON",
        network: "TON Open Network",
        icon: "💎",
        color: "#0098ea",
        address: "UQCvxIFQ2c8R-MgyShlwhwFaZsIS2OKBDXJjAWl7-Flcwz6d",
        warning: "Send TON only through the TON Open Network."
    }

};


// Get HTML elements

const paymentOptions = document.querySelectorAll(".payment-option");

const selectedIcon = document.getElementById("selectedIcon");

const selectedName = document.getElementById("selectedName");

const selectedNetwork = document.getElementById("selectedNetwork");

const depositAddress = document.getElementById("depositAddress");

const warningText = document.getElementById("warningText");

const copyButton = document.getElementById("copyButton");

const copyMessage = document.getElementById("copyMessage");


// Switch payment method

paymentOptions.forEach(button => {

    button.addEventListener("click", function () {

        // Remove active class from all buttons

        paymentOptions.forEach(option => {
            option.classList.remove("active");
        });

        // Add active class to clicked button

        this.classList.add("active");

        // Get selected payment method

        const method = this.dataset.method;

        const payment = paymentData[method];

        // Update deposit information

        selectedIcon.textContent = payment.icon;

        selectedIcon.style.background = payment.color;

        selectedName.textContent = payment.name;

        selectedNetwork.textContent = payment.network;

        depositAddress.value = payment.address;

        warningText.textContent = payment.warning;

        // Clear previous copy notification

        copyMessage.textContent = "";

        copyButton.textContent = "▢ Copy";

        copyButton.classList.remove("copied");

    });

});


// Copy deposit address

copyButton.addEventListener("click", async function () {

    const address = depositAddress.value;

    if (!address || address.startsWith("YOUR_")) {

        copyMessage.textContent = "Please configure a valid wallet address first.";

        return;

    }

    try {

        await navigator.clipboard.writeText(address);

        copyMessage.textContent = "✓ Address copied successfully!";

        copyButton.textContent = "✓ Copied";

        copyButton.classList.add("copied");

    } catch (error) {

        // Fallback for browsers where Clipboard API is unavailable

        depositAddress.select();

        depositAddress.setSelectionRange(0, 99999);

        const copied = document.execCommand("copy");

        if (copied) {

            copyMessage.textContent = "✓ Address copied successfully!";

            copyButton.textContent = "✓ Copied";

            copyButton.classList.add("copied");

        } else {

            copyMessage.textContent = "Copy failed. Please copy the address manually.";

        }

    }

});






// Investment plan minimum amounts

const investmentPlans = {

    basic: {
        name: "Basic Plan",
        minimum: 100,
        rate: 9
    },

    standard: {
        name: "Standard Plan",
        minimum: 500,
        rate: 13
    },

    premium: {
        name: "Premium Plan",
        minimum: 3000,
        rate: 18
    },

    longterm: {
        name: "Long-term Plan",
        minimum: 10000,
        rate: 21
    }

};


// Get HTML elements

const investmentPlan = document.getElementById("investmentPlan");

const investmentAmount = document.getElementById("investmentAmount");

const minimumMessage = document.getElementById("minimumMessage");

const activateButton = document.getElementById("activateButton");

const investmentMessage = document.getElementById("investmentMessage");

const investmentModal = document.getElementById("investmentModal");

const confirmPlan = document.getElementById("confirmPlan");

const confirmAmount = document.getElementById("confirmAmount");

// const confirmMinimum = document.getElementById("confirmMinimum");
const confirmRate = document.getElementById("confirmRate");

const confirmProfit = document.getElementById("confirmProfit");

const confirmTotal = document.getElementById("confirmTotal");

const cancelInvestment = document.getElementById("cancelInvestment");

const confirmInvestment = document.getElementById("confirmInvestment");


// Get selected plan

function getSelectedPlan() {

    return investmentPlans[investmentPlan.value];

}


// Check investment amount

function checkInvestmentAmount() {

    const selectedPlan = getSelectedPlan();

    const amount = Number(investmentAmount.value);

    const minimum = selectedPlan.minimum;

    // Update minimum amount message

    minimumMessage.textContent =
        `Minimum investment amount: $${minimum.toLocaleString("en-US")}`;

    // Update input minimum

    investmentAmount.min = minimum;

    // Check whether amount is valid

    const validAmount =
        investmentAmount.value.trim() !== "" &&
        Number.isFinite(amount) &&
        amount >= minimum;

    // Enable or disable button

    activateButton.disabled = !validAmount;

    // Display helpful message

    if (investmentAmount.value.trim() === "") {

        investmentMessage.textContent =
            `Enter at least $${minimum.toLocaleString("en-US")} to continue.`;

    } else if (!validAmount) {

        investmentMessage.textContent =
            `Your selected plan requires a minimum investment of $${minimum.toLocaleString("en-US")}.`;

    } else {

        investmentMessage.textContent = "";

    }

}


// Listen for plan changes

investmentPlan.addEventListener("change", function () {

    checkInvestmentAmount();

});


// Listen for amount typing

investmentAmount.addEventListener("input", function () {

    checkInvestmentAmount();

});


// Open confirmation modal

// Open confirmation modal

activateButton.addEventListener("click", function () {

    const selectedPlan = getSelectedPlan();

    const amount = Number(investmentAmount.value);

    // Double-check the minimum amount

    if (!Number.isFinite(amount) ||
        amount < selectedPlan.minimum ||
        investmentAmount.value.trim() === "") {

        checkInvestmentAmount();

        return;

    }

    // Calculate estimated returns

    const profit = amount * (selectedPlan.rate / 100);

    const total = amount + profit;

    // Display investment information

    confirmPlan.textContent = selectedPlan.name;

    confirmAmount.textContent =
        "$" + amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    confirmRate.textContent = selectedPlan.rate + "%";

    confirmProfit.textContent =
        "$" + profit.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    confirmTotal.textContent =
        "$" + total.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    // Show modal

    investmentModal.classList.add("show");

});


// Confirm investment

confirmInvestment.addEventListener("click", function () {

    // Close modal

    investmentModal.classList.remove("show");

    // Display frontend demo message

    // investmentMessage.textContent =
    //     "Your investment details are ready for submission. Connect the PHP backend to process your request.";

    // investmentMessage.style.color = "#2ecc91";

});


// Initial validation

checkInvestmentAmount();










// Withdrawal payment methods

const withdrawalData = {

    btc: {
        name: "Bitcoin (BTC)",
        network: "Bitcoin Network",
        icon: "₿",
        color: "#f7931a",
        warning: "Make sure your receiving wallet supports the Bitcoin network. Sending to an incorrect address may result in permanent loss."
    },

    trx: {
        name: "TRON (TRX)",
        network: "TRON Network",
        icon: "T",
        color: "#e50924",
        warning: "Make sure your receiving wallet supports the TRON network before requesting your withdrawal."
    },

    trc20: {
        name: "USDT (TRC20)",
        network: "TRON Network",
        icon: "₮",
        color: "#26a17b",
        warning: "Make sure your receiving wallet supports USDT TRC20. Do not enter an ERC20 or BEP20 receiving address."
    },

    erc20: {
        name: "USDT (ERC20)",
        network: "Ethereum Network",
        icon: "₮",
        color: "#26a17b",
        warning: "Make sure your receiving wallet supports USDT ERC20. Do not enter a TRC20 or BEP20 receiving address."
    },

    bep20: {
        name: "USDT (BEP20)",
        network: "BNB Smart Chain",
        icon: "₮",
        color: "#26a17b",
        warning: "Make sure your receiving wallet supports USDT BEP20. Do not enter a TRC20 or ERC20 receiving address."
    }

};


// Get HTML elements

const withdrawOptions = document.querySelectorAll(".withdraw-option");

const wselectedIcon = document.getElementById("wselectedIcon");

const wselectedName = document.getElementById("wselectedName");

const wselectedNetwork = document.getElementById("wselectedNetwork");

const networkWarning = document.getElementById("networkWarning");

const withdrawMethod = document.getElementById("withdrawMethod");


// Select withdrawal method

withdrawOptions.forEach(button => {

    button.addEventListener("click", function () {

        // Remove active class from all options
        withdrawOptions.forEach(option => {
            option.classList.remove("active");
        });

        // Highlight selected option
        this.classList.add("active");

        // Get selected payment method
        const method = this.dataset.method;

        const payment = withdrawalData[method];

        if (!payment) return;

        // Update selected cryptocurrency icon
        wselectedIcon.textContent = payment.icon;
        wselectedIcon.style.background = payment.color;

        // Update cryptocurrency name
        wselectedName.textContent = payment.name;

        // Update network name
        wselectedNetwork.textContent = payment.network;

        // Update network warning
        networkWarning.textContent = payment.warning;

        // Update hidden withdrawal method
        withdrawMethod.value = method;

    });

});








/* =================================
   coNNex SETTINGS JAVASCRIPT
================================= */

(function () {

    "use strict";


    /* =========================
       SETTINGS TAB SWITCHING
    ========================= */

    const settingsTabs = document.querySelectorAll(
        ".settings-tab"
    );

    const profilePanel = document.getElementById(
        "cnxProfilePanel"
    );

    const securityPanel = document.getElementById(
        "cnxSecurityPanel"
    );


    settingsTabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            settingsTabs.forEach(function (item) {
                item.classList.remove("active");
            });

            tab.classList.add("active");

            const selectedTab = tab.dataset.settingsTab;

            profilePanel.classList.remove("active");
            securityPanel.classList.remove("active");

            if (selectedTab === "profile") {
                profilePanel.classList.add("active");
            }

            if (selectedTab === "security") {
                securityPanel.classList.add("active");
            }

        });

    });



    /* =========================
       MODAL OPEN / CLOSE
    ========================= */

    function openCnxModal(modalId) {

        const modal = document.getElementById(modalId);

        if (!modal) return;

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

    }


    function closeCnxModal(modalId) {

        const modal = document.getElementById(modalId);

        if (!modal) return;

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        const anotherModalOpen = document.querySelector(
            ".cnx-settings-modal.active"
        );

        if (!anotherModalOpen) {
            document.body.style.overflow = "";
        }

    }



    /* =========================
       EDIT PROFILE MODAL
    ========================= */

    const openEditProfile = document.getElementById(
        "cnxOpenEditProfile"
    );

    const editProfileForm = document.getElementById(
        "cnxEditProfileForm"
    );

    const profileName = document.getElementById(
        "cnxProfileName"
    );

    const profileUsername = document.getElementById(
        "cnxProfileUsername"
    );

    const profileEmail = document.getElementById(
        "cnxProfileEmail"
    );

    const accountName = document.getElementById(
        "cnxAccountName"
    );


    const editFullName = document.getElementById(
        "cnxEditFullName"
    );

    const editUsername = document.getElementById(
        "cnxEditUsername"
    );

    const editEmail = document.getElementById(
        "cnxEditEmail"
    );

    const emailPasswordGroup = document.getElementById(
        "cnxEmailPasswordGroup"
    );

    const emailCurrentPassword = document.getElementById(
        "cnxEmailCurrentPassword"
    );


    if (openEditProfile && editProfileForm) {

        openEditProfile.addEventListener("click", function () {

            editFullName.value = profileName.textContent.trim();

            editUsername.value = profileUsername.textContent.trim();

            editEmail.value = profileEmail.textContent.trim();

            emailCurrentPassword.value = "";

            emailPasswordGroup.hidden = true;

            openCnxModal("cnxEditProfileModal");

        });


        /* Show password field only when email changes */

        editEmail.addEventListener("input", function () {

            const originalEmail = profileEmail.textContent.trim();

            const emailHasChanged =
                editEmail.value.trim().toLowerCase() !==
                originalEmail.toLowerCase();

            emailPasswordGroup.hidden = !emailHasChanged;

            if (!emailHasChanged) {
                emailCurrentPassword.value = "";
            }

        });


        /* PROFILE FORM SUBMISSION */

        editProfileForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const fullName = editFullName.value.trim();

            const username = editUsername.value.trim();

            const email = editEmail.value.trim();

            const originalEmail = profileEmail.textContent.trim();

            const emailHasChanged =
                email.toLowerCase() !== originalEmail.toLowerCase();


            if (!fullName || !username || !email) {
                alert("Please complete all profile fields.");
                return;
            }


            if (emailHasChanged && !emailCurrentPassword.value.trim()) {

                alert(
                    "Please enter your current password to change your email."
                );

                emailCurrentPassword.focus();

                return;

            }


            /*
              FRONT-END DEMO ONLY.

              In the PHP/MySQL version:
              - Validate the current password on the server.
              - Check that the new email is not already registered.
              - Send a verification link/code to the new email.
              - Update the database only after successful verification.

              Never trust JavaScript alone for password verification.
            */

            alert(
                "Your profile form is ready. Actual profile updates will be enabled when PHP/MySQL is connected."
            );

        });

    }



    /* =========================
       CHANGE PASSWORD MODAL
    ========================= */

    const openPassword = document.getElementById(
        "cnxOpenPassword"
    );

    const changePasswordForm = document.getElementById(
        "cnxChangePasswordForm"
    );


    if (openPassword) {

        openPassword.addEventListener("click", function () {

            if (changePasswordForm) {
                changePasswordForm.reset();
            }

            openCnxModal("cnxPasswordModal");

        });

    }


    if (changePasswordForm) {

        changePasswordForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const currentPassword = document.getElementById(
                "cnxCurrentPassword"
            ).value;

            const newPassword = document.getElementById(
                "cnxNewPassword"
            ).value;

            const confirmPassword = document.getElementById(
                "cnxConfirmPassword"
            ).value;


            if (!currentPassword || !newPassword || !confirmPassword) {

                alert("Please complete all password fields.");

                return;

            }


            if (newPassword.length < 8) {

                alert("Your new password must contain at least 8 characters.");

                return;

            }


            if (newPassword !== confirmPassword) {

                alert("Your new passwords do not match.");

                return;

            }


            if (currentPassword === newPassword) {

                alert("Your new password must be different from your current password.");

                return;

            }


            /*
              FRONT-END DEMO ONLY.

              The PHP backend must verify the current password,
              securely hash the new password, and update the database.
            */

            alert(
                "Password update will be enabled when PHP/MySQL is connected."
            );

        });

    }



    /* =========================
       CLOSE BUTTONS
    ========================= */

    const closeButtons = document.querySelectorAll(
        "[data-close-modal]"
    );


    closeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const modalId = button.dataset.closeModal;

            closeCnxModal(modalId);

        });

    });



    /* Close when clicking outside modal content */

    document.querySelectorAll(
        ".cnx-settings-modal"
    ).forEach(function (modal) {

        modal.addEventListener("click", function (event) {

            if (event.target === modal) {

                closeCnxModal(modal.id);

            }

        });

    });



    /* Close modal with Escape key */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            document.querySelectorAll(
                ".cnx-settings-modal.active"
            ).forEach(function (modal) {

                closeCnxModal(modal.id);

            });

        }

    });


})();












document.addEventListener("DOMContentLoaded", function () {

    // ==================================
    // COUNTRY LIST (193 UN MEMBERS + 2)
    // ==================================

    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
        "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
        "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
        "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
        "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
        "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
        "Cameroon", "Canada", "Central African Republic", "Chad", "Chile",
        "China", "Colombia", "Comoros", "Republic of the Congo",
        "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus",
        "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti",
        "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
        "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
        "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia",
        "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
        "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
        "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
        "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan",
        "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
        "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
        "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
        "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
        "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
        "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
        "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
        "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
        "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
        "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
        "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
        "Saint Kitts and Nevis", "Saint Lucia",
        "Saint Vincent and the Grenadines", "Samoa", "San Marino",
        "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia",
        "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
        "Solomon Islands", "Somalia", "South Africa", "South Korea",
        "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
        "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania",
        "Thailand", "Timor-Leste", "Togo", "Tonga",
        "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
        "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
        "United Kingdom", "United States", "Uruguay", "Uzbekistan",
        "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
        "Zambia", "Zimbabwe"
    ];

    // ==================================
    // SEARCHABLE COUNTRY DROPDOWN
    // ==================================

    const countrySearch = document.getElementById("countrySearch");
    const countryDropdown = document.getElementById("countryDropdown");
    const countryInput = document.getElementById("country");

    if (countrySearch && countryDropdown && countryInput) {

        function showCountries(list) {
            countryDropdown.innerHTML = "";

            if (list.length === 0) {
                countryDropdown.innerHTML =
                    '<div class="country-empty">No country found</div>';
                countryDropdown.style.display = "block";
                return;
            }

            list.forEach(country => {
                const option = document.createElement("div");

                option.className = "country-option";
                option.textContent = country;

                option.addEventListener("click", function () {
                    countrySearch.value = country;
                    countryInput.value = country;
                    countryDropdown.style.display = "none";
                });

                countryDropdown.appendChild(option);
            });

            countryDropdown.style.display = "block";
        }

        countrySearch.addEventListener("focus", function () {
            showCountries(countries);
        });

        countrySearch.addEventListener("input", function () {
            const searchValue = this.value.toLowerCase().trim();

            // Clear previously selected country when user edits the search
            countryInput.value = "";

            const filteredCountries = countries.filter(country =>
                country.toLowerCase().includes(searchValue)
            );

            showCountries(filteredCountries);
        });

        document.addEventListener("click", function (event) {
            if (
                !countrySearch.contains(event.target) &&
                !countryDropdown.contains(event.target)
            ) {
                countryDropdown.style.display = "none";
            }
        });
    }

    // ==================================
    // FILE UPLOAD VALIDATION
    // ==================================

    function handleKycFile(inputId, nameId, allowedTypes) {
        const fileInput = document.getElementById(inputId);
        const fileName = document.getElementById(nameId);

        if (!fileInput || !fileName) return;

        fileInput.addEventListener("change", function () {

            const file = this.files[0];

            if (!file) {
                fileName.textContent = "No file selected";
                return;
            }

            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.type)) {
                alert("Invalid file format. Please select an allowed file.");
                this.value = "";
                fileName.textContent = "No file selected";
                return;
            }

            if (file.size > maxSize) {
                alert("File is too large. Maximum file size is 5MB.");
                this.value = "";
                fileName.textContent = "No file selected";
                return;
            }

            fileName.textContent = file.name;
        });
    }

    // Front of ID: JPG, PNG, PDF
    handleKycFile(
        "idFront",
        "frontName",
        ["image/jpeg", "image/png", "application/pdf"]
    );

    // Back of ID: JPG, PNG, PDF
    handleKycFile(
        "idBack",
        "backName",
        ["image/jpeg", "image/png", "application/pdf"]
    );

    // Selfie: JPG, PNG only
    handleKycFile(
        "idSelfie",
        "selfieName",
        ["image/jpeg", "image/png"]
    );

    // ==================================
    // KYC FORM SUBMISSION
    // ==================================

    const kycForm = document.getElementById("kycForm");

    if (kycForm) {
        kycForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const front = document.getElementById("idFront");
            const back = document.getElementById("idBack");
            const selfie = document.getElementById("idSelfie");
            const agreement = document.getElementById("kycAgreement");

            if (!countryInput || !countryInput.value) {
                alert("Please select your country.");
                countrySearch?.focus();
                return;
            }

            if (!front?.files.length) {
                alert("Please upload the front of your ID.");
                return;
            }

            if (!back?.files.length) {
                alert("Please upload the back of your ID.");
                return;
            }

            if (!selfie?.files.length) {
                alert("Please upload your selfie holding your ID.");
                return;
            }

            if (!agreement?.checked) {
                alert("Please confirm the declaration before submitting.");
                return;
            }

            alert("Your KYC information has been validated successfully!");

            // Front-end demo only.
            // Connect this form to your PHP/MySQL backend later.
        });
    }

});









// ==================================
// REFERRAL LINK
// ==================================

const referralCode = "CNX10025"; // Demo referral code

const referralLinkInput = document.getElementById("referralLink");
const copyReferralButton = document.getElementById("copyReferralLink");
const referralCopyMessage = document.getElementById("referralCopyMessage");

if (referralLinkInput) {

    const referralLink =
        `${window.location.origin}/signup.html?ref=${referralCode}`;

    referralLinkInput.value = referralLink;
}

if (copyReferralButton && referralLinkInput) {

    copyReferralButton.addEventListener("click", async function () {

        try {
            await navigator.clipboard.writeText(referralLinkInput.value);

            referralCopyMessage.textContent = "Referral link copied successfully!";

            copyReferralButton.innerHTML =
                '<i class="fas fa-check"></i> Copied!';

            setTimeout(() => {
                copyReferralButton.innerHTML =
                    '<i class="fas fa-copy"></i> Copy Link';

                referralCopyMessage.textContent = "";
            }, 2500);

        } catch (error) {
            referralLinkInput.select();
            referralCopyMessage.textContent =
                "Please copy the selected link manually.";
        }

    });
}







(function () {

    const transactions = [
        {
            id: "CNX-TXN-00125",
            type: "credit",
            description: "Deposit received into your account",
            amount: 500,
            method: "USDT TRC20",
            status: "successful",
            date: "20 Nov 2026",
            time: "10:45 AM"
        },
        {
            id: "CNX-TXN-00124",
            type: "investment",
            description: "Premium investment plan activated",
            amount: 3000,
            method: "Account Balance",
            status: "successful",
            date: "19 Nov 2026",
            time: "02:30 PM"
        },
        {
            id: "CNX-TXN-00123",
            type: "debit",
            description: "Withdrawal request submitted",
            amount: 150,
            method: "USDT TRC20",
            status: "pending",
            date: "18 Nov 2026",
            time: "11:20 AM"
        },
        {
            id: "CNX-TXN-00122",
            type: "credit",
            description: "Deposit payment confirmation",
            amount: 200,
            method: "Bitcoin",
            status: "failed",
            date: "17 Nov 2026",
            time: "09:15 AM"
        }
    ];

    const list = document.getElementById("transactionList");
    const search = document.getElementById("transactionSearch");
    const filter = document.getElementById("transactionFilter");
    const empty = document.getElementById("transactionEmpty");

    const modal = document.getElementById("transactionModal");

    if (!list || !modal) return;

    function formatAmount(transaction) {
        const sign = transaction.type === "credit" ? "+" : "-";
        return sign + "$" + transaction.amount.toLocaleString("en-US", {
            minimumFractionDigits: 2
        });
    }

    function renderTransactions() {

        const searchText = search.value.toLowerCase().trim();
        const selectedFilter = filter.value;

        const filtered = transactions.filter(transaction => {

            const matchesType =
                selectedFilter === "all" ||
                transaction.type === selectedFilter;

            const matchesSearch =
                transaction.type.includes(searchText) ||
                transaction.description.toLowerCase().includes(searchText) ||
                transaction.id.toLowerCase().includes(searchText) ||
                transaction.status.includes(searchText);

            return matchesType && matchesSearch;
        });

        list.innerHTML = "";

        empty.style.display = filtered.length ? "none" : "block";

        filtered.forEach(transaction => {

            const typeName =
                transaction.type.charAt(0).toUpperCase() +
                transaction.type.slice(1);

            const icon =
                transaction.type === "credit" ? "fa-arrow-down" :
                transaction.type === "debit" ? "fa-arrow-up" :
                "fa-chart-line";

            const statusClass =
                "status-" + transaction.status;

            const statusName =
                transaction.status.charAt(0).toUpperCase() +
                transaction.status.slice(1);

            const amountClass =
                transaction.type === "credit"
                    ? "amount-credit"
                    : "amount-debit";

            const item = document.createElement("div");

            item.className = "transaction-item";

            item.innerHTML = `
                <div class="transaction-left">

                    <div class="transaction-icon">
                        <i class="fas ${icon}"></i>
                    </div>

                    <div class="transaction-info">
                        <h4>${typeName}</h4>
                        <p>${transaction.description}</p>
                    </div>

                </div>

                <div class="transaction-right">

                    <span class="transaction-status ${statusClass}">
                        ${statusName}
                    </span>

                    <strong class="${amountClass}">
                        ${formatAmount(transaction)}
                    </strong>

                </div>
            `;

            item.addEventListener("click", () => {
                showTransactionDetails(transaction);
            });

            list.appendChild(item);
        });
    }

    function showTransactionDetails(transaction) {

        const typeName =
            transaction.type.charAt(0).toUpperCase() +
            transaction.type.slice(1);

        const statusName =
            transaction.status.charAt(0).toUpperCase() +
            transaction.status.slice(1);

        document.getElementById("detailType").textContent = typeName;
        document.getElementById("detailAmount").textContent =
            formatAmount(transaction);

        document.getElementById("detailStatus").textContent = statusName;
        document.getElementById("detailStatus").className =
            "transaction-status status-" + transaction.status;

        document.getElementById("detailId").textContent = transaction.id;
        document.getElementById("detailTransactionType").textContent = typeName;
        document.getElementById("detailDescription").textContent =
            transaction.description;
        document.getElementById("detailMethod").textContent =
            transaction.method;
        document.getElementById("detailDate").textContent = transaction.date;
        document.getElementById("detailTime").textContent = transaction.time;
        document.getElementById("detailFullStatus").textContent = statusName;

        modal.classList.add("active");
    }

    document.getElementById("closeTransactionModal")
        .addEventListener("click", () => {
            modal.classList.remove("active");
        });

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.classList.remove("active");
        }
    });

    document.getElementById("copyTransactionId")
        .addEventListener("click", async () => {

            const id = document.getElementById("detailId").textContent;

            try {
                await navigator.clipboard.writeText(id);
                alert("Transaction ID copied!");
            } catch (error) {
                alert("Unable to copy. Please copy the ID manually.");
            }
        });

    search.addEventListener("input", renderTransactions);
    filter.addEventListener("change", renderTransactions);

    renderTransactions();

})();











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








