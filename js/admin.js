document.addEventListener("DOMContentLoaded", async () => {
    await loadCurrentBalance();
});

// Function to load and display current balance
const loadCurrentBalance = async () => {
    try {
        const data = await loadUserData();
        if (data && data.users.length > 0) {
            const balance = data.users[0].balance;
            document.getElementById("balance").value = balance;
        }
    } catch (error) {
        console.error("Error loading balance:", error);
        document.getElementById("status-message").textContent = "Failed to load balance";
    }
};

// Event listener for form submission
document.getElementById("balance-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const newBalance = document.getElementById("new-balance").value;
    if (newBalance === "") {
        document.getElementById("status-message").textContent = "Please enter a valid balance";
        return;
    }

    try {
        const data = await loadUserData();
        if (data && data.users.length > 0) {
            data.users[0].balance = Number(newBalance); // Update balance
            await updateUserData(data); // Save updated data to JSONbin
            
            document.getElementById("balance").value = newBalance;
            document.getElementById("status-message").textContent = "Balance updated successfully!";
            document.getElementById("status-message").classList.add("text-success");
        }
    } catch (error) {
        console.error("Error updating balance:", error);
        document.getElementById("status-message").textContent = "Failed to update balance";
        document.getElementById("status-message").classList.add("text-danger");
    }
});
