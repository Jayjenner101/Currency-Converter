const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
const result = document.querySelector(".result");
const exchangeRate = document.getElementById("exchangeRate");

// Swap currencies
swapBtn.addEventListener("click", () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
});

// Convert currency
convertBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        result.textContent = "0.00";
        exchangeRate.textContent = "Please enter a valid amount.";
        return;
    }

    result.textContent = "Converting...";
    exchangeRate.textContent = "Fetching live exchange rates...";

    try {
        const response = await fetch(
            `https://open.er-api.com/v6/latest/${fromCurrency.value}`
        );

        const data = await response.json();

        if (data.result !== "success") {
            throw new Error("Failed to fetch exchange rates.");
        }

        const rate = data.rates[toCurrency.value];
        const converted = amount * rate;

        result.textContent = converted.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        exchangeRate.textContent =
            `1 ${fromCurrency.value} = ${rate.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6
            })} ${toCurrency.value}`;

    } catch (error) {
        console.error(error);
        result.textContent = "Error";
        exchangeRate.textContent =
            "Unable to fetch exchange rates. Check your internet connection.";
    }
});

// Convert automatically when currency changes
fromCurrency.addEventListener("change", () => convertBtn.click());
toCurrency.addEventListener("change", () => convertBtn.click());