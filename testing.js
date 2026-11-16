// Deposit payment information

const paymentData = {

    btc: {
        name: "Bitcoin (BTC)",
        network: "Bitcoin Network",
        icon: "₿",
        color: "#f7931a",
        address: "YOUR_BTC_WALLET_ADDRESS",
        warning: "Only send BTC using the Bitcoin network. Sending another cryptocurrency may result in permanent loss of funds."
    },

    trx: {
        name: "TRON (TRX)",
        network: "TRON Network",
        icon: "T",
        color: "#e50924",
        address: "YOUR_TRX_WALLET_ADDRESS",
        warning: "Only send TRX using the TRON network. Sending another cryptocurrency may result in permanent loss of funds."
    },

    trc20: {
        name: "USDT (TRC20)",
        network: "TRON Network",
        icon: "₮",
        color: "#26a17b",
        address: "YOUR_USDT_TRC20_ADDRESS",
        warning: "Only send USDT using the TRC20 network. Do not send ERC20 or BEP20 tokens to this address."
    },

    erc20: {
        name: "USDT (ERC20)",
        network: "Ethereum Network",
        icon: "₮",
        color: "#26a17b",
        address: "YOUR_USDT_ERC20_ADDRESS",
        warning: "Only send USDT using the ERC20 network. Do not send TRC20 or BEP20 tokens to this address."
    },

    bep20: {
        name: "USDT (BEP20)",
        network: "BNB Smart Chain",
        icon: "₮",
        color: "#26a17b",
        address: "YOUR_USDT_BEP20_ADDRESS",
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