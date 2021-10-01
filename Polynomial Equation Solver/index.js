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

var userOption = "none", userChoice, coef, coefInput, result;

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
        document.getElementById("graph").style.display = "none";
        coefInput = [...coef];
        result = controlFunction(coef, userChoice);
        if (result.length === 0) {
            displayMsg = "No Solution";
        }
        if (userChoice == 3) {
            let n = result.length;
            coefInput = [1,...result];
            ReactDOM.render( React.createElement("div", null, React.createElement("h2", null, displayMsg), React.createElement("p", null, React.createElement("span", null, "x", React.createElement("sup", null, n)), result.map((value, index) => {
                n--;
                return React.createElement(Terms, {
                    key: index,
                    coef: value,
                    power: n
                });
            }), React.createElement("span", null, " = 0")), React.createElement("button", { className: "btn btn-outline-dark", id: "graph-btn" }, "Plot Graph")), document.getElementById("result"));
        }
        else {
            ReactDOM.render( React.createElement("div", null, React.createElement("h2", null, displayMsg), result.length > 1 ? result.map(value => {
                return React.createElement("p", null, value);
            }) : React.createElement("p", null, result), React.createElement("button", { className: "btn btn-outline-dark", id: "graph-btn" }, "Plot Graph")), document.getElementById("result"));
        }
    }
}

document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "graph-btn") {

        /* generate equation in required format */
        var inputEquation = '', n = coefInput.length;
        for (let i = 0; i < n; i++) {
            if (coefInput[i] !== 0) {
                if (coefInput[i] > 0) {
                    inputEquation += '+';
                }
                inputEquation += coefInput[i];
                inputEquation += 'x^';
                inputEquation += (n - i - 1);
            }
        }
        document.getElementById("graph").style.display = "block";

        /* graph display size */
        let width = 650, height = 650;
        if (screen.width < 1024) {
            let contentsBounds = document.body.getBoundingClientRect();
            width = 800;
            height = 500;
            let ratio = contentsBounds.width / width;
            width *= ratio;
            height *= ratio;
        }

        /* calculate domain of x 
        let xLower = -50, xUpper = 50, nSamples = 5000;
        if (userChoice == 3) {
            coef.sort();
            xLower = coef[0];
            xLower -= 0.5 * Math.abs(xLower);
            xUpper = coef[coef.length - 1];
            xUpper += 0.5 * Math.abs(xUpper);
        }
        if (userChoice == 1) {
            result.sort();
            xLower = result[0];
            xLower -= 0.5 * Math.abs(xLower);
            xUpper = result[result.length - 1];
            xUpper += 0.5 * Math.abs(xUpper);
        }*/

        let roots = [];
        if (userChoice == 3) {
            for (let i = 0; i < coef.length; i++) {
                roots.push([coef[i], 0]);
            }
        }
        else if (userChoice == 1) {
            for (let i = 0; i < result.length; i++) {
                roots.push([result[i], 0]);
            }
        }

        functionPlot({
            target: '#graph',
            tip: {
                xLine: true,
                yLine: true
                },
            width,
            height,
            //xAxis: { domain: [xLower, xUpper] },
            grid: true,
            data: [
                {
                    fn: inputEquation,
                    color: 'black',
                    sampler: 'builtIn',
                    graphType: 'polyline'
                },
                {
                    points: roots,
                    fnType: 'points',
                    graphType: 'scatter',
                    color: '#000000'
                }
            ]
        })
    }
});