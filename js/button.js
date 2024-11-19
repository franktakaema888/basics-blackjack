var gameButtons = document.querySelector("#game-buttons");
var output = document.querySelector("#output-div");
var submitButton = document.querySelector("#submit-button");
var hitButton = document.querySelector("#hit-button");
var standButton = document.querySelector("#stand-button");
const resetButton = document.getElementById("reset-button");

function updateButtonVisibility(gameOver) {
    if (gameOver) {
        gameButtons.style.display = 'none';
        submitButton.style.display = 'inline-block';
        submitButton.textContent = 'New Game';
    } else {
        gameButtons.style.display = 'block';
        submitButton.style.display = 'none';
    }
}

submitButton.addEventListener("click", async function (e) {
    e.preventDefault();
    var result = main('start');
    output.innerHTML = result.output;
    updateButtonVisibility(result.gameOver);
});

hitButton.addEventListener("click", function (){
    console.log("Hit Button Pressed");
    var result = main('hit');
    output.innerHTML = result.output;
    updateButtonVisibility(result.gameOver);
});

standButton.addEventListener("click", function () {
    console.log("Stand Button Pressed");
    var result = main('stand');
    output.innerHTML = result.output;
    updateButtonVisibility(result.gameOver);
});

resetButton.addEventListener("click", () => {
  resetBalance();
});
