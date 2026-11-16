/* ===============================
   PAGE NAVIGATION
================================ */

const pageTitles = {

    home: [
        "Admin overview",
        "Manage your platform from one place."
    ],

    users: [
        "Manage users",
        "View and manage customer accounts."
    ],

    admins: [
        "Administrators",
        "Manage administrator accounts and access."
    ],

    investments: [
        "Manage investments",
        "Review customer investment records."
    ]

};


function showPage(page) {

    // Hide all pages
    document.querySelectorAll(".page-section").forEach(section => {

        section.classList.toggle(
            "active",
            section.id === page
        );

    });


    // Update sidebar active state
    document.querySelectorAll(".nav-link").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.page === page
        );

    });


    // Update page heading
    document.getElementById("page-title").textContent =
        pageTitles[page][0];

    document.getElementById("page-subtitle").textContent =
        pageTitles[page][1];

}


/* Sidebar navigation */

document.querySelectorAll("[data-page]").forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.page);

    });

});


/* Overview management cards */

document.querySelectorAll("[data-go]").forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.go);

    });

});


/* ===============================
   MODAL ELEMENTS
================================ */

const backdrop = document.getElementById("modal-backdrop");

const modalTitle = document.getElementById("modal-title");

const modalDescription = document.getElementById("modal-description");

const formFields = document.getElementById("form-fields");


/* ===============================
   FORM FIELD GENERATORS
================================ */

function field(label, name, type = "text", full = false) {

    return `
        <div class="field ${full ? "full" : ""}">

            <label for="${name}">${label}</label>

            <input
                id="${name}"
                name="${name}"
                type="${type}"
                placeholder="Enter ${label.toLowerCase()}"
            >

        </div>
    `;

}


function selectField(label, name, options, full = false) {

    return `
        <div class="field ${full ? "full" : ""}">

            <label for="${name}">${label}</label>

            <select id="${name}" name="${name}">

                ${options.map(option => `
                    <option>${option}</option>
                `).join("")}

            </select>

        </div>
    `;

}


/* ===============================
   OPEN ADD / EDIT MODAL
================================ */

function openModal(type, editName = "") {

    const editing = Boolean(editName);

    let fields = "";


    /* USER FORM */

    if (type === "user") {

        modalTitle.textContent =
            editing ? "Edit user" : "Add user";

        modalDescription.textContent =
            "Customer account details.";

        fields = `
            <div class="field-grid">

                ${field("Full name", "full-name")}

                ${field("Username", "username")}

                ${field("Email address", "email", "email", true)}

                ${selectField(
                    "Account status",
                    "status",
                    ["Active", "Pending", "Suspended"],
                    true
                )}

            </div>
        `;

    }


    /* ADMINISTRATOR FORM */

    else if (type === "admin") {

        modalTitle.textContent =
            editing ? "Edit administrator" : "Add administrator";

        modalDescription.textContent =
            "Administrator account and access status.";

        fields = `
            <div class="field-grid">

                ${field("Full name", "full-name")}

                ${field("Username", "username")}

                ${field("Email address", "email", "email", true)}

                ${selectField(
                    "Administrator status",
                    "status",
                    ["Active", "Invited", "Suspended"],
                    true
                )}

            </div>
        `;

    }


    /* INVESTMENT FORM */

    else {

        modalTitle.textContent =
            editing ? "Edit investment" : "Create investment";

        modalDescription.textContent =
            "Investment record details. Configure real rules in your backend.";

        fields = `
            <div class="field-grid">

                ${field("Customer name", "customer")}

                ${selectField(
                    "Investment plan",
                    "plan",
                    ["Basic", "Standard", "Premium", "Long-term"]
                )}

                ${field(
                    "Investment amount (USD)",
                    "amount",
                    "number"
                )}

                ${selectField(
                    "Investment status",
                    "status",
                    ["Pending", "In Progress", "Completed"],
                    true
                )}

            </div>
        `;

    }


    formFields.innerHTML = fields;


    // Put the selected record name in the first field during edit preview
    if (editing) {

        const firstInput = formFields.querySelector("input");

        if (firstInput) {
            firstInput.value = editName;
        }

    }


    backdrop.classList.add("open");

}


/* ===============================
   CLOSE MODAL
================================ */

function closeModal() {

    backdrop.classList.remove("open");

}


document.querySelectorAll("[data-modal]").forEach(button => {

    button.addEventListener("click", () => {

        openModal(button.dataset.modal);

    });

});


(document.getElementById("close-modal").addEventListener(
    "click",
    closeModal
));


document.getElementById("cancel-modal").addEventListener(
    "click",
    closeModal
);


backdrop.addEventListener("click", event => {

    if (event.target === backdrop) {

        closeModal();

    }

});


/* ===============================
   FORM SUBMISSION PREVIEW
================================ */

document.getElementById("preview-form").addEventListener(
    "submit",
    event => {

        event.preventDefault();

        alert(
            "This is a frontend preview. The form is not connected to a database, so no record has been saved."
        );

        closeModal();

    }
);


/* ===============================
   EDIT AND DELETE BUTTONS
================================ */

document.addEventListener("click", event => {

    const edit = event.target.closest("[data-edit]");

    const remove = event.target.closest("[data-delete]");


    // EDIT BUTTON
    if (edit) {

        const tableId = edit.closest("table").id;

        let type;

        if (tableId === "users-table") {

            type = "user";

        }

        else if (tableId === "admins-table") {

            type = "admin";

        }

        else {

            type = "investment";

        }


        openModal(type, edit.dataset.edit);

    }


    // DELETE BUTTON
    if (remove) {

        alert(
            `Delete action preview for ${remove.dataset.delete}. No record has been deleted because this is a frontend demo.`
        );

    }

});


/* ===============================
   TABLE SEARCH
================================ */

document.querySelectorAll("[data-search]").forEach(input => {

    input.addEventListener("input", () => {

        const table = document.getElementById(
            input.dataset.search
        );

        const query = input.value.toLowerCase();


        table.querySelectorAll("tbody tr").forEach(row => {

            row.hidden = !row.innerText
                .toLowerCase()
                .includes(query);

        });

    });

});
