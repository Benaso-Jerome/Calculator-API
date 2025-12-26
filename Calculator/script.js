const BASE_URL = "https://newton.now.sh/api/v2/simplify/";
const mainDisplay = document.getElementById('mainDisplay');
const historyDisplay = document.getElementById('history');
const errorContainer = document.getElementById('errorContainer');
const loading = document.getElementById('loading');
const calcBtn = document.getElementById('calcBtn');

let currentInput = "";


function append(value) {
    if (currentInput === "0" && value !== ".") currentInput = "";
    currentInput += value;
    updateUI();
}

function clearDisplay() {
    currentInput = "";
    historyDisplay.textContent = "";
    mainDisplay.textContent = "0";
    errorContainer.classList.add('hidden');
}

function updateUI() {
    mainDisplay.textContent = currentInput || "0";
}


async function fetchResult(expression) {

    const cleanExpr = encodeURIComponent(expression.trim());

    const response = await fetch(`${BASE_URL}${cleanExpr}`);
    if (!response.ok) throw new Error("API Failure");

    return await response.json();
}


async function handleCalculation() {
    if (!currentInput) return;


    loading.classList.remove('hidden');
    loading.textContent = "Computing...";
    calcBtn.disabled = true;
    errorContainer.classList.add('hidden');

    try {
        const data = await fetchResult(currentInput);

        if (data.result === "error" || data.result === null) {
            showError("Invalid Syntax");
        } else {
            historyDisplay.textContent = currentInput;
            currentInput = data.result.toString();
            updateUI();
        }
    } catch (err) {
        showError("Failed API call");
    } finally {
        loading.classList.add('hidden');
        calcBtn.disabled = false;
    }
}

function showError(msg) {
    errorContainer.textContent = msg;
    errorContainer.classList.remove('hidden');
    mainDisplay.textContent = "Error";
}

