/* OVERLAY FUNCTIONS */

function openNav() {
    if ((screen.width >= 768) && (screen.width <= 1300)) {
        document.getElementById("myNav").style.width = "50%";
    }
    else {
        document.getElementById("myNav").style.width = "100%";
    }
}
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

/* POLYNOMIAL & RELATED  */

var userOption = "none", userChoice, coef, result;

for (let i = 0; i < document.querySelectorAll(".dropdown-item").length; i++) {
    document.querySelectorAll(".dropdown-item")[i].addEventListener("click", function () {
        userOption = this.textContent;
        userChoice = this.id;
        document.querySelector("#dropdownMenu2").textContent = userOption;
        if (userChoice == 3) {
            document.querySelector("#coefInput").setAttribute("placeholder", "Enter roots seperated by comma's");
        }
        else {
            document.querySelector("#coefInput").setAttribute("placeholder", "Enter co-efficients seperated by comma's");
        }
    });
}

document.querySelector("body").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        triggerSubmit();
    }
});

document.querySelector(".go").addEventListener("click", function () {
    triggerSubmit();
});

function inputError() {
    alert("Invalid Input");
}

function submitFunc() {
    if (userOption === "none") {
        alert("Choose an Option");
        return false;
    }
    else {
        var userInput = document.querySelector("#coefInput").value;
        userInput = userInput.trim();
        if (userInput.length === 0) {
            return false;
        }
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

function Terms(props) {
    var power = props.power, coef = props.coef, x = "x";
    if (power === 1) {
        power = null;
    } else if (power === 0) {
        x = null;
        power = null;
    }

    if (coef > 0) {
        if (coef === 1) {
            return React.createElement("span", null, " + ", x, React.createElement("sup", null, power));
        } else {
            return React.createElement("span", null, " + ", coef, x, React.createElement("sup", null, power));
        }
    } else if (coef < 0) {
        if (coef === -1) {
            return React.createElement("span", null, " - ", x, React.createElement("sup", null, power));
        } else {
            return React.createElement("span", null, " - ", Math.abs(coef), x, React.createElement("sup", null, power));
        }
    } else {
        return null;
    }
}


function triggerSubmit() {
    if (submitFunc()) {
        result = controlFunction(coef, userChoice);
        if (result.length === 0) {
            displayMsg = "No Solution";
        }
        if (userChoice == 3) {
            let n = result.length;
            ReactDOM.render( React.createElement("div", null, React.createElement("h2", null, displayMsg), React.createElement("p", null, React.createElement("span", null, "x", React.createElement("sup", null, n)), result.map((value, index) => {
                n--;
                return React.createElement(Terms, {
                    key: index,
                    coef: value,
                    power: n
                });
            }), React.createElement("span", null, " = 0"))), document.getElementById("result"));
        }
        else {
            ReactDOM.render( React.createElement("div", null, React.createElement("h2", null, displayMsg), result.length > 1 ? result.map(value => {
                return React.createElement("p", null, value);
            }) : React.createElement("p", null, result)), document.getElementById("result"));
        }
    }
}