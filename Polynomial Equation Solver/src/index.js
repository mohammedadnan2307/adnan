var coefInput, result;

window.onload = function () {
    let inputField = document.querySelector("#coefInput");
    if (inputField) {
        inputField.focus();

        // Simulate an Enter key press
        let enterEvent = new KeyboardEvent("keypress", {
            key: "Enter",
            keyCode: 13,
            code: "Enter",
            which: 13,
            bubbles: true
        });
        inputField.dispatchEvent(enterEvent);
    }
};

for (let i = 0; i < document.querySelectorAll(".dropdown-item").length; i++) {

    document.querySelectorAll(".dropdown-item")[i].addEventListener("click", function () {
        userOption = this.textContent;
        userChoice = this.id;
        document.querySelector("#dropdownMenu2").textContent = userOption;
        if (userChoice == 3) {
            document.querySelector("#coefInput").setAttribute("placeholder", "Enter roots separated by comma");
        }
        else {
            document.querySelector("#coefInput").setAttribute("placeholder", "Enter the equation");
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

function Terms(props) {
    var power = props.power, coef = props.coef, x = "x";
    if (power === 1) {
        power = null;
    } else if (power === 0) {
        x = null;
        power = null;
    }
    
    if (coef > 0) {
        if (coef === 1 && power !== null) {
            return React.createElement("span", null, " + ", x, React.createElement("sup", null, power));
        } else {
            return React.createElement("span", null, " + ", coef, x, React.createElement("sup", null, power));
        }
    } else if (coef < 0) {
        if (coef === -1 && power !== null) {
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
        document.getElementById("graph").style.display = "none";
        document.getElementById("tangent").style.display = "none";
        coefInput = [...coef];
        result = controlFunction(coef, userChoice);
        if (result.length === 0) {
            displayMsg = "No Solution";
        }
        if (userChoice == 3) {
            let n = result.length;
            coefInput = [1, ...result];
            ReactDOM.render(React.createElement("div", null, React.createElement("h2", null, displayMsg), React.createElement("p", null, React.createElement("span", null, "x", n !== 1 ? React.createElement("sup", null, n) : null), result.map((value, index) => {
                n--;
                return React.createElement(Terms, {
                    key: index,
                    coef: value,
                    power: n
                });
            }), React.createElement("span", null, " = 0")), React.createElement("button", { className: "btn btn-outline-dark", id: "graph-btn" }, "Plot Graph")), document.getElementById("result"));
        }
        else {
            ReactDOM.render(React.createElement("div", null, React.createElement("h2", null, displayMsg), result.length > 1 ? result.map(value => {
                return React.createElement("p", null, value);
            }) : React.createElement("p", null, result), React.createElement("button", { className: "btn btn-outline-dark", id: "graph-btn" }, "Plot Graph")), document.getElementById("result"));
        }
    }
}