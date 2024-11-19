const BASE_JSON_BIN_URL = process.env.BASE_JSON_BIN_URL;
const BIN_ID = process.env.BIN_ID;
const MASTER_KEY = process.env.MASTER_KEY;

const loadUserData = async () => {
    try {
        const response = await axios.get(BASE_JSON_BIN_URL + "/" + BIN_ID + "/latest", {
            headers: {
                'X-Master-Key': MASTER_KEY
            }
        });
        // console.log(response.data.record.users[0].username);
        return response.data.record;
    } catch (error) {
        console.log(error);
    }
}

const updateUserData = async (newBalance) => {
    try {
        const response = await axios.put(`${BASE_JSON_BIN_URL}/${BIN_ID}`, newBalance, {
            headers: {
              "Content-Type": "application/json",
              "X-Master-Key": MASTER_KEY
            }
        });
        
        return response.data;

    } catch(e) {
        console.log(e);
    }
}

const displayUserBalance = async () => {
    try {
        const data = await loadUserData();
        if (data && data.users.length > 0) {
            const balance = data.users[0].balance;
            document.getElementById("balance-display").textContent = balance;
        }
    } catch (error) {
        console.log("Error loading balance:", error);
        document.getElementById("balance-display").textContent = "Error";
    }
};

const resetBalance = async () => {
    try {
      const data = await loadUserData();
      if (data && data.users.length > 0) {
        data.users[0].balance = 100; // Set balance to 100
        await updateUserData(data); // Save the updated data to JSONbin
        displayUserBalance(); // Update the displayed balance on the page
        alert("Game reset! Balance has been set to $100.");
      }
    } catch (error) {
      console.error("Error resetting balance:", error);
      alert("Failed to reset balance. Please try again.");
    }
};