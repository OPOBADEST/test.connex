// ==========================================
// coNNex ADMIN - INVESTMENT MANAGEMENT
// FRONT-END DEMO
// ==========================================


// ==========================================
// DEMO INVESTORS
// Later, these will come from the database.
// ==========================================

const DEMO_USERS = [
    {
        id: "USR001",
        name: "John David",
        username: "johndavid"
    },
    {
        id: "USR002",
        name: "James Michael",
        username: "jamesm"
    },
    {
        id: "USR003",
        name: "Sarah Williams",
        username: "sarahw"
    },
    {
        id: "USR004",
        name: "Daniel Smith",
        username: "danielsmith"
    },
    {
        id: "USR005",
        name: "Mary Johnson",
        username: "maryj"
    },
    {
        id: "USR006",
        name: "David Anderson",
        username: "davidand"
    },
    {
        id: "USR007",
        name: "Grace Thompson",
        username: "gracet"
    },
    {
        id: "USR008",
        name: "Michael Brown",
        username: "michaelb"
    }
];


// ==========================================
// INVESTMENT PLAN SETTINGS
// ==========================================

const PLAN_CONFIG = {
    basic: {
        name: "Basic Plan",
        durationLabel: "24 hours",
        unit: "hours",
        value: 24
    },

    standard: {
        name: "Standard Plan",
        durationLabel: "7 days",
        unit: "days",
        value: 7
    },

    premium: {
        name: "Premium Plan",
        durationLabel: "30 days",
        unit: "days",
        value: 30
    },

    longterm: {
        name: "Long-term Plan",
        durationLabel: "6 months",
        unit: "months",
        value: 6
    }
};


const MINIMUM_INVESTMENT = 100;

const STORAGE_KEY = "connex_demo_investments";


// ==========================================
// HTML ELEMENTS
// ==========================================

const investmentForm =
    document.getElementById("investmentForm");

const customerSearch =
    document.getElementById("customerSearch");

const customerInput =
    document.getElementById("customer");

const customerResults =
    document.getElementById("customerResults");

const selectedCustomer =
    document.getElementById("selectedCustomer");

const planInput =
    document.getElementById("plan");

const amountInput =
    document.getElementById("amount");

const investmentRows =
    document.getElementById("investmentRows");

const clearButton =
    document.getElementById("clearDemo");


// ==========================================
// LOAD AND SAVE INVESTMENTS
// ==========================================

function loadInvestments() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );

        return Array.isArray(saved) ? saved : [];

    } catch (error) {
        return [];
    }
}


let investments = loadInvestments();


function saveInvestments() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(investments)
    );
}


// ==========================================
// INVESTOR SEARCH
// ==========================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}


function showInvestorResults(searchTerm = "") {

    const search = searchTerm
        .trim()
        .toLowerCase();

    const matches = DEMO_USERS.filter(user => {

        return (
            user.name.toLowerCase().includes(search) ||
            user.username.toLowerCase().includes(search)
        );

    });


    customerResults.innerHTML = "";


    if (matches.length === 0) {

        customerResults.innerHTML = `
            <div class="no-customer">
                No investor found.
            </div>
        `;

        customerResults.hidden = false;

        return;
    }


    matches.forEach(user => {

        const option = document.createElement("button");

        option.type = "button";
        option.className = "customer-option";

        option.innerHTML = `
            <span class="customer-avatar">
                ${escapeHTML(user.name.charAt(0).toUpperCase())}
            </span>

            <span class="customer-info">
                <strong>${escapeHTML(user.name)}</strong>
                <small>@${escapeHTML(user.username)}</small>
            </span>
        `;

        option.addEventListener("click", () => {
            selectInvestor(user);
        });

        customerResults.appendChild(option);

    });


    customerResults.hidden = false;
}


function selectInvestor(user) {

    // Store the investor's unique ID.
    customerInput.value = user.id;

    // Show the selected investor in the search field.
    customerSearch.value =
        `${user.name} (@${user.username})`;

    selectedCustomer.textContent =
        `Selected investor: ${user.name}`;

    customerResults.hidden = true;
}


// Search as the admin types.

customerSearch.addEventListener("input", () => {

    // Clear previous selection if the search changes.
    customerInput.value = "";

    selectedCustomer.textContent =
        "Please select an investor from the results.";

    showInvestorResults(customerSearch.value);

});


// Show available investors when the field is focused.

customerSearch.addEventListener("focus", () => {

    if (!customerInput.value) {
        showInvestorResults(customerSearch.value);
    }

});


// Hide results when clicking outside the search area.

document.addEventListener("click", event => {

    if (!event.target.closest(".investor-field")) {
        customerResults.hidden = true;
    }

});


// ==========================================
// DATE CALCULATIONS
// ==========================================

function calculateEndDate(startTime, plan) {

    const endDate = new Date(startTime);

    if (plan.unit === "hours") {

        endDate.setHours(
            endDate.getHours() + plan.value
        );

    } else if (plan.unit === "days") {

        endDate.setDate(
            endDate.getDate() + plan.value
        );

    } else if (plan.unit === "months") {

        // Add calendar months and clamp to the
        // last valid day of the destination month.

        const originalDay = endDate.getDate();

        endDate.setDate(1);

        endDate.setMonth(
            endDate.getMonth() + plan.value
        );

        const lastDay = new Date(
            endDate.getFullYear(),
            endDate.getMonth() + 1,
            0
        ).getDate();

        endDate.setDate(
            Math.min(originalDay, lastDay)
        );
    }

    return endDate.getTime();
}


// ==========================================
// FORMATTING HELPERS
// ==========================================

function formatDate(timestamp) {

    if (!timestamp) {
        return "—";
    }

    return new Date(timestamp).toLocaleString(
        "en-US",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}


function formatMoney(amount) {

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);

}


function getRemainingTime(endTime) {

    const difference = endTime - Date.now();

    if (difference <= 0) {
        return "Completed";
    }

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );


    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    return `${hours}h ${minutes}m ${seconds}s`;
}


// ==========================================
// DETERMINE INVESTMENT STATUS
// ==========================================

function getInvestmentStatus(investment) {

    if (!investment.startedAt) {
        return "Pending";
    }

    if (Date.now() >= investment.endsAt) {
        return "Completed";
    }

    return "In Progress";
}


// ==========================================
// RENDER INVESTMENTS
// ==========================================

function renderInvestments() {

    if (investments.length === 0) {

        investmentRows.innerHTML = `
            <tr class="empty-row">
                <td colspan="8">
                    No investment records yet.
                    Add one using the form above.
                </td>
            </tr>
        `;

        return;
    }


    investmentRows.innerHTML = "";


    investments.forEach(investment => {

        const status = getInvestmentStatus(investment);

        const row = document.createElement("tr");


        let countdownHTML = "Waiting for activation";

        let adminHTML = "";


        // PENDING INVESTMENT

        if (status === "Pending") {

            adminHTML = `
                <button
                    class="activate-button"
                    data-action="activate"
                    data-id="${escapeHTML(investment.id)}"
                    type="button"
                >
                    Activate
                </button>
            `;

        }


        // ACTIVE INVESTMENT

        else if (status === "In Progress") {

            const totalDuration =
                investment.endsAt - investment.startedAt;

            const elapsed =
                Date.now() - investment.startedAt;

            const progress = Math.min(
                100,
                Math.max(
                    0,
                    (elapsed / totalDuration) * 100
                )
            );

            countdownHTML = `
                <div class="countdown">
                    ${getRemainingTime(investment.endsAt)}
                </div>

                <div class="progress-track">
                    <div
                        class="progress-fill"
                        style="width: ${progress}%"
                    ></div>
                </div>

                <small>${Math.floor(progress)}% completed</small>
            `;

        }


        // COMPLETED INVESTMENT

        else if (status === "Completed") {

            countdownHTML = `
                <span class="completed-text">
                    Investment completed
                </span>
            `;

        }


        adminHTML += `
            <button
                class="delete-button"
                data-action="delete"
                data-id="${escapeHTML(investment.id)}"
                type="button"
            >
                Delete
            </button>
        `;


        row.innerHTML = `

            <td>
                <strong>${escapeHTML(investment.customerName)}</strong>
                <small>@${escapeHTML(investment.username)}</small>
            </td>

            <td>
                ${escapeHTML(investment.planName)}
                <small>${escapeHTML(investment.durationLabel)}</small>
            </td>

            <td>
                ${formatMoney(investment.amount)}
            </td>

            <td>
                ${formatDate(investment.startedAt)}
            </td>

            <td>
                ${formatDate(investment.endsAt)}
            </td>

            <td>
                <span class="status-badge ${status.toLowerCase().replace(" ", "-")}">
                    ${status}
                </span>
            </td>

            <td>
                ${countdownHTML}
            </td>

            <td>
                ${adminHTML}
            </td>

        `;


        investmentRows.appendChild(row);

    });

}


// ==========================================
// ADD NEW INVESTMENT
// ==========================================

investmentForm.addEventListener("submit", event => {

    event.preventDefault();


    const customerId = customerInput.value;

    const investor = DEMO_USERS.find(
        user => user.id === customerId
    );


    if (!investor) {

        alert("Please search for and select a valid investor.");

        customerSearch.focus();

        return;
    }


    const planKey = planInput.value;

    const plan = PLAN_CONFIG[planKey];

    const amount = Number(amountInput.value);


    if (!plan) {

        alert("Please select a valid investment plan.");

        return;
    }


    if (
        !Number.isFinite(amount) ||
        amount < MINIMUM_INVESTMENT
    ) {

        alert(
            "Please enter the minimum investment amount of $100 USD."
        );

        amountInput.focus();

        return;
    }


    const newInvestment = {

        id: Date.now().toString(),

        customerId: investor.id,

        customerName: investor.name,

        username: investor.username,

        planKey: planKey,

        planName: plan.name,

        durationLabel: plan.durationLabel,

        amount: amount,

        startedAt: null,

        endsAt: null

    };


    // Save as pending.
    // Countdown does not start until activation.

    investments.unshift(newInvestment);

    saveInvestments();

    renderInvestments();


    investmentForm.reset();

    customerInput.value = "";

    selectedCustomer.textContent =
        "No investor selected.";

    customerResults.hidden = true;


    alert(
        "Investment added successfully as Pending."
    );

});


// ==========================================
// ACTIVATE / DELETE INVESTMENTS
// ==========================================

investmentRows.addEventListener("click", event => {

    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }


    const investmentId = button.dataset.id;

    const action = button.dataset.action;


    const investment = investments.find(
        item => item.id === investmentId
    );

    if (!investment) {
        return;
    }


    // ACTIVATE INVESTMENT

    if (action === "activate") {

        if (investment.startedAt) {
            return;
        }


        const confirmed = confirm(
            `Activate this investment for ${investment.customerName}?`
        );

        if (!confirmed) {
            return;
        }


        const plan = PLAN_CONFIG[investment.planKey];

        const startTime = Date.now();


        investment.startedAt = startTime;

        investment.endsAt = calculateEndDate(
            startTime,
            plan
        );


        saveInvestments();

        renderInvestments();

        alert("Investment activated successfully.");

    }


    // DELETE INVESTMENT

    if (action === "delete") {

        const confirmed = confirm(
            "Are you sure you want to delete this investment?"
        );

        if (!confirmed) {
            return;
        }


        investments = investments.filter(
            item => item.id !== investmentId
        );


        saveInvestments();

        renderInvestments();

    }

});


// ==========================================
// CLEAR ALL DEMO RECORDS
// ==========================================

clearButton.addEventListener("click", () => {

    const confirmed = confirm(
        "Are you sure you want to clear all investment records?"
    );

    if (!confirmed) {
        return;
    }


    investments = [];

    saveInvestments();

    renderInvestments();

});


// ==========================================
// AUTOMATIC COUNTDOWN REFRESH
// ==========================================

renderInvestments();

setInterval(() => {

    renderInvestments();

}, 1000);