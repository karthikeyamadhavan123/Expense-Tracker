// Input validation and form submission
document.getElementById("transaction-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;

    let errorMessage = "";

    if (!description) {
        errorMessage += "Please enter a description. ";
    }
    if (isNaN(amount)) {
        errorMessage += "Please enter a valid amount. ";
    }
    if (!date) {
        errorMessage += "Please select a valid date. ";
    }
    if (!category) {
        errorMessage += "Please select a category. ";
    }

    if (errorMessage) {
        alert(errorMessage); // You can replace this with a custom UI error display
    } else {
        const transaction = {
            description,
            amount,
            date,
            category
        };
        addTransaction(transaction);
        resetForm();
    }
});

// Add transaction to local storage
function addTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    renderTransactions();
    updateSummary();
}

// Render transactions from local storage
function renderTransactions() {
    const transactionsList = document.getElementById("transactions");
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    transactionsList.innerHTML = '';

    transactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${transaction.description}</span>
            <span>${transaction.category}</span>
            <span>${transaction.date}</span>
            <span>$${transaction.amount.toFixed(2)}</span>
            <button onclick="deleteTransaction(${index})">Delete</button>
            <button onclick="editTransaction(${index})">Edit</button>
        `;
        transactionsList.appendChild(li);
    });
}

// Delete transaction
function deleteTransaction(index) {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
    updateSummary();
}

// Edit transaction
function editTransaction(index) {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const transaction = transactions[index];

    document.getElementById("description").value = transaction.description;
    document.getElementById("amount").value = transaction.amount;
    document.getElementById("date").value = transaction.date;
    document.getElementById("category").value = transaction.category;

    document.getElementById("submit-btn").innerText = "Update Transaction";
    document.getElementById("submit-btn").onclick = function() {
        updateTransaction(index);
    };
}

// Update existing transaction
function updateTransaction(index) {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    transactions[index] = {
        description: document.getElementById("description").value,
        amount: parseFloat(document.getElementById("amount").value),
        date: document.getElementById("date").value,
        category: document.getElementById("category").value
    };

    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
    updateSummary();
    resetForm();

    document.getElementById("submit-btn").innerText = "Add Transaction";
    document.getElementById("submit-btn").onclick = null;
}

// Reset form after submission
function resetForm() {
    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("date").value = "";
    document.getElementById("category").value = "";
}

// Update the income, expense, and net balance summary
function updateSummary() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(transaction => {
        if (transaction.amount > 0) {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += Math.abs(transaction.amount);
        }
    });

    document.getElementById("total-income").innerText = `$${totalIncome.toFixed(2)}`;
    document.getElementById("total-expenses").innerText = `$${totalExpenses.toFixed(2)}`;
    document.getElementById("net-income").innerText = `$${(totalIncome - totalExpenses).toFixed(2)}`;
}

// Filter transactions by category
function filterTransactions() {
    const filterCategory = document.getElementById("filter-category").value;
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    const filteredTransactions = transactions.filter(transaction => {
        return filterCategory === "" || transaction.category === filterCategory;
    });

    const transactionsList = document.getElementById("transactions");
    transactionsList.innerHTML = '';

    filteredTransactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${transaction.description}</span>
            <span>${transaction.category}</span>
            <span>${transaction.date}</span>
            <span>$${transaction.amount.toFixed(2)}</span>
            <button onclick="deleteTransaction(${index})">Delete</button>
            <button onclick="editTransaction(${index})">Edit</button>
        `;
        transactionsList.appendChild(li);
    });
}

// Export transactions to JSON file
function exportTransactions() {
    let transactions = localStorage.getItem("transactions") || "[]";
    let blob = new Blob([transactions], { type: "application/json" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "transactions.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Import transactions from JSON file
function importTransactions(event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        let transactions = JSON.parse(e.target.result);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        renderTransactions();
        updateSummary();
    };
    reader.readAsText(file);
}

// Event listener for filter button
document.getElementById("filter-btn").addEventListener("click", filterTransactions);

// Initialize app
window.onload = function() {
    renderTransactions();
    updateSummary();
};