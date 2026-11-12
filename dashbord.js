// Dashboard page navigation
const pageDetails = {
    dashboard: {
        title: "Dashboard",
        subtitle: "Welcome back! Here's an overview of your account."
    },

    invest: {
        title: "Invest",
        subtitle: "Explore and manage your investments."
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










