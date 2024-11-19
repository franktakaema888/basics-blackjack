const loginButton = document.getElementById("login-button");
// const hardCodeUsername = "admin";
// const hardCodePassword = "password";


loginButton.addEventListener("click", async function(e) {
    e.preventDefault();

    const data = await loadUserData();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // console.log("Login Button Pressed");
    // console.log(`Username: ${username}`);
    // console.log(`Password: ${password}`);
    // console.log(data);

    if (data && data.users.length > 0) {
        const dbUsername = data.users[0].username;
        const dbPassword = data.users[0].password;

        if (username === dbUsername && password === dbPassword) {
            console.log("Login Successful");
            window.location.href = "./admin.html";
        };
    }
});