/* NAVIGATION FUNCTIONS */

function openNav() {
    document.getElementById("myNav").style.width = "100%";
}
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

/* SUBMISSION & RELATED  */

var userOption = "none", userChoice, coef, result;

for (let i = 0; i < document.querySelectorAll(".dropdown-item").length; i++) {
    document.querySelectorAll(".dropdown-item")[i].addEventListener("click", function () {
        userOption = this.textContent;
        userChoice = this.id;
        document.querySelector("#dropdownMenu2").textContent = userOption;
    });
}

function inputError() { }

function submitFunc() {
    if (userOption === "none") {
        alert("Choose an Option");
        return false;
    }
    else {
        var userInput = document.querySelector("#coefInput").value;
        userInput = userInput.trim();
        userInput = userInput.split(",");
        coef = [];
        for (let i = 0; i < userInput.length; i++) {
            if (Number.isNaN(Number(userInput[i])) === true) {
                inputError();
                return false;
            }
            else {
                coef.push(Number(userInput[i]));
            }
        }
        return true;
    }
}

function triggerSubmit() {
    if (submitFunc()) {
        result = controlFunction(coef, userChoice);
        ReactDOM.render(React.createElement("div", null, React.createElement("h2", null, "Result: "), result.map(value => {
            return React.createElement("span", { className: "results" }, value);
        })), document.getElementById("result"));
        console.log(result);
    }
}

document.querySelector("body").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        triggerSubmit();
    }
});
document.querySelector(".go").addEventListener("click", function () {
    triggerSubmit();
});