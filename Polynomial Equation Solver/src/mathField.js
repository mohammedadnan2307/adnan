/* MathQuill */

var mathFieldSpan = document.getElementById('coefInput');
var latexFormat = "";

var MQ = MathQuill.getInterface(2); // for backcompat
var mathField = MQ.MathField(mathFieldSpan, {
    spaceBehavesLikeTab: true, // configurable
    handlers: {
        edit: function () { // useful event handlers
            latexFormat = mathField.latex(); // simple API
        }
    }
});

/* Math Field & Errors */

var userOption = "none", userChoice, coef;

function inputError(errMsg) {
    alert(errMsg);
}

function termsToCoef(terms) {
    let powers = [], coefArray = [];
    for (let i = 0; i < terms.length; i++) {
        let notConst = false, term = terms[i];
        for (let j = 0; j < term.length; j++) {
            if ((term[j] == 'x') || (term[j] == 'X')) {
                notConst = true;
                if (j == term.length - 1) {
                    powers.push(1);
                }
                else {
                    j += 2;
                    let num = "", curlyBraces = 0;
                    if (term[j] == '{') {
                        j++;
                        curlyBraces = -1;
                    }
                    while (j < term.length) {
                        if ((term[j].charCodeAt(0) < 48) || (term[j].charCodeAt(0) > 57)) {
                            if (term[j].charCodeAt(0) == 125) {
                                curlyBraces *= -1;
                            }
                            else {
                                inputError("Invalid Exponent");
                                return false;
                            }
                        }
                        num += term[j];
                        j++;
                    }
                    if ((Number.isNaN(Number(parseInt(num))) === true) || (curlyBraces === -1)) {
                        inputError("Invalid Exponent");
                        return false;
                    }
                    else {
                        powers.push(parseInt(num));
                    }
                }
                term = term.split("x");
                let coefValue;
                if (Number.isNaN(parseInt(term[0])) === true) {
                    coefValue = 1;
                    if (term[0] == '-') {
                        coefValue *= -1;
                    }
                }
                else {
                    coefValue = Number(term[0]);
                }
                coefArray.push(coefValue);
            }
        }
        if (notConst == false) {
            powers.push(0);
            coefArray.push(Number(term));
        }
    }
    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
    if (findDuplicates(powers).length > 0) {
        inputError("Multilpe usage of an exponent");
        return false;
    }
    let maxDegree = Math.max(...powers), sortedCoef;
    sortedCoef = new Array(maxDegree + 1).fill(0);
    for (let i = 0; i < powers.length; i++) {
        let pos = maxDegree - powers[i];
        sortedCoef[pos] = coefArray[i];
    }
    return sortedCoef;
}

function submitFunc() {
    if (userOption === "none") {
        inputError("Choose an Option");
        return false;
    }
    if (userChoice == 3) {
        var userInput = latexFormat;
        userInput = userInput.trim();
        if (userInput.length === 0) {
            return false;
        }
        userInput = userInput.split(",");
        coef = [];
        for (let i = 0; i < userInput.length; i++) {
            if (Number.isNaN(Number(userInput[i])) === true) {
                inputError("Invalid Roots");
                return false;
            }
            else {
                coef.push(Number(userInput[i]));
            }
        }
        return true;
    }
    else {
        let term = "", terms = [], acceptedCharacters = [120, 43, 45, 88, 123, 125, 46, 94];
        for (let i = 0; i < latexFormat.length; i++) {
            let asciiValue = latexFormat[i].charCodeAt(0);
            if ((acceptedCharacters.includes(asciiValue)) || ((asciiValue >= 48) && (asciiValue <= 57))) {
                if ((asciiValue === 43) || (asciiValue === 45)) {
                    terms.push(term);
                    term = "";
                }
                if (i === latexFormat.length - 1) {
                    term += latexFormat[i];
                    terms.push(term);
                }
                term += latexFormat[i];
            }
            else {
                inputError("Invalid Equation");
                return false;
            }
        }
        coef = termsToCoef(terms);
        if (coef === false) {
            return false;
        }
        return true;
    }
}

/* Plot Graph */

function plotFunctionEquation(coefArray) {
    let equation = '', n = coefArray.length;
    for (let i = 0; i < n; i++) {
        if (coefArray[i] !== 0) {
            if (coefArray[i] > 0) {
                equation += '+';
            }
            equation += coefArray[i];
            equation += 'x^';
            equation += (n - i - 1);
        }
    }
    return equation;
}

var showTangent = false;
document.addEventListener("click", function (e) {

    if (e.target && e.target.id === "graph-btn") {

        var fxEquation = plotFunctionEquation(coefInput), fdxEquation = plotFunctionEquation(derivativeCalculator(coefInput));
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

        /* To plot points on the graph */
        let plotPoints = [];
        if (userChoice == 3) {
            for (let i = 0; i < coef.length; i++) {
                plotPoints.push([coef[i], 0]);
            }
        }
        else if (userChoice == 1) {
            for (let i = 0; i < result.length; i++) {
                plotPoints.push([result[i], 0]);
            }
        }
        else if (userChoice == 2) {
            for (let i = 0; i < result.length; i++) {
                manipulator(coef, result[i], coef.length - 1);
                plotPoints.push([result[i], fx]);
            }
        }

        let additionalGraph = {
            fn: fxEquation,
            range: [valueOfLowerLimit, valueOfHigherLimit]
        }, tip = {
            xLine: true,
            yLine: true,
        }, data = [
            {
                fn: fxEquation,
                color: 'black',
                sampler: 'builtIn',
                graphType: 'polyline'
            },
            {
                points: plotPoints,
                fnType: 'points',
                graphType: 'scatter',
                color: '#000000'
            }
        ];

        if (userChoice == 4) {
            additionalGraph.closed = true;
            additionalGraph.color = '#2980B9';
            data.push(additionalGraph);
        }
        else if (userChoice == 5) {
            additionalGraph.color = '#FF0000';
            additionalGraph.sampler = 'builtIn';
            additionalGraph.graphType = 'polyline';
            data.push(additionalGraph);
        }
        if (showTangent === true) {
            tip.renderer = function (x, y) {
                let fdxValue = functionPlot.$eval.builtIn({ fn: fdxEquation }, 'fn', { x });
                return `(${roundPrecise(x, 3)}, ${roundPrecise(y, 3)}) Slope: ${roundPrecise(fdxValue, 3)}`;
            };
            data[0].derivative = {
                fn: fdxEquation,
                updateOnMouseMove: true
            }
        }

        let options = {
            target: '#graph',
            tip,
            width,
            height,
            grid: true,
            data
        };
        functionPlot(options);
        ReactDOM.render(React.createElement("button", { className: "btn btn-outline-dark", id: "tangent-btn" }, "Show Tangent"), document.getElementById("tangent"));
        document.getElementById("tangent").style.display = "inline-block";

    } else if (e.target && e.target.id === "tangent-btn") {
        showTangent = !showTangent;
        let btnName;
        if (showTangent === true) {
            btnName = "Hide Tangent";
        } else {
            btnName = "Show Tangent";
        }
        document.querySelector("#tangent-btn").textContent = btnName;
        document.getElementById("graph-btn").click();
    }
});