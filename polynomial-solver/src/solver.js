var fx, fdx, valueOfHigherLimit = 0, valueOfLowerLimit = 0, results = [], displayMsg = "";
const preciseValue = 5;
const errorMsg = "Oops, as the slope is steeper, we couldn't find it! \nEnter a value which might be near one of the";

function derivativeCalculator(coefArray) {
    let n = coefArray.length - 1;
    let derivative = new Array(n);
    for (let i = 0; i < n; i++) {
        derivative[i] = coefArray[i] * (n - i);
    }
    return derivative;
}

function controlFunction(coef, userChoice) {
    results = [];
    let n = coef.length - 1;
    if (userChoice === "1") {
        displayMsg = "The roots are: ";
        return solve(coef, n);
    } else if (userChoice === "2") {
        displayMsg = "Turning points are: ";
        return solve(derivativeCalculator(coef), n - 1);
    } else if (userChoice === "3") {
        displayMsg = "The Equation is: ";
        return generateEquation(coef, n + 1);
    } else if (userChoice === "4") {
        displayMsg = "Curve area is: ";
        return curveArea(coef, n);
    } else if (userChoice === "5") {
        displayMsg = "Curve length is: ";
        return curveLength(coef, n);
    }
}

function roundPrecise(n, decimalPlaces = preciseValue) {
    const factorOfTen = Math.pow(10, decimalPlaces);
    return (Math.round(n * factorOfTen) / factorOfTen);
}

function checkFunc(a, b, n = 4) {
    let p = a.toFixed(n);
    let q = b.toFixed(n);
    if (p === q) {
        return true;
    } else {
        return false;
    }
}

function manipulator(coef, x, n) {
    fx = fdx = 0;
    for (let i = 0; i <= n; i++) {
        fx += coef[i] * Math.pow(x, n - i);
    }
    for (let i = 0; i < n; i++) {
        fdx += (n - i) * coef[i] * Math.pow(x, n - i - 1);
    }
}

function analyze(coef, n) {
    var averageRoot = -(coef[1] / coef[0]) / n;
    return averageRoot;
}

function solve(coef, n) {
    if (n <= 2) {
        if (n === 1) {
            degOne(coef[0], coef[1]);
        } else {
            degTwo(coef[0], coef[1], coef[2]);
        }
    }
    else {
        let x, x2, limit = 500, counter = 0;
        x = analyze(coef, n);
        do {
            manipulator(coef, x, n);
            if (checkFunc(Math.abs(fdx), 0, 3)) {
                x += 0.1;
                continue;
            }
            x2 = x - (fx / fdx);
            if (checkFunc(x2, x)) {
                break;
            }
            else {
                x = x2;
                counter++;

                if (counter === limit) {
                    if (userChoice === "1") {
                        if (n % 2 === 0) {
                            return results;
                        } else {
                            let response = prompt(errorMsg + "Roots");
                            if (response) {
                                x = Number(response);
                                counter = 0;
                                continue;
                            }
                            else {
                                return results;
                            }
                        }
                    } else {
                        if (n % 2 === 0) {
                            let response = prompt(errorMsg + "Turning Points");
                            if (response) {
                                x = Number(response);
                                counter = 0;
                                continue;
                            }
                            else {
                                return results;;
                            }
                        } else {
                            return results;
                        }
                    }
                }
            }
        }
        while (!checkFunc(Math.abs(fx), 0));
        results.push(roundPrecise(x));
        for (let i = 1; i < n; i++) {
            coef[i] = coef[i - 1] * x + coef[i];
        }
        solve(coef, n - 1);
    }
    return results;
}

function degTwo(a, b, c) {
    let x1, x2, d;
    d = b * b - 4 * a * c;
    if (d >= 0) {
        x1 = (-b + Math.sqrt(d)) / (2 * a);
        x2 = (-b - Math.sqrt(d)) / (2 * a);
        results.push(roundPrecise(x1), roundPrecise(x2));
    }
    return results;
}

function degOne(a, b) {
    let x = -(b / a);
    results.push(roundPrecise(x));
    return results;
}

function curveArea(coef, n) {
    var area, lowerArea = 0, higherArea = 0;
    valueOfLowerLimit = Number(prompt("Enter the value lower limit of the interval"));
    valueOfHigherLimit = Number(prompt("Enter the value higher limit of the interval"));
    var x = valueOfLowerLimit;
    for (let i = 0; i <= n; i++) {
        lowerArea += coef[i] * Math.pow(x, n + 1 - i) / (n + 1 - i);
    }
    x = valueOfHigherLimit;
    for (let i = 0; i <= n; i++) {
        higherArea += coef[i] * Math.pow(x, n + 1 - i) / (n + 1 - i);
    }
    area = higherArea - lowerArea;
    return roundPrecise(area);
}

/* Curve Length returns approximate value ---> Needs Improvisation */
function curveLength(coef, n) {
    for (let i = 0; i < n; i++) {
        coef[i] = coef[i] * (n - i);
    }

    var lengthOfCurve, fx_a, fx_b, fx_ab;
    valueOfLowerLimit = Number(prompt("Enter the value of lower limit of the interval"));
    valueOfHigherLimit = Number(prompt("Enter the value of higher limit of the interval"));
    var x = valueOfLowerLimit, sum = 0;

    for (let i = 0; i < n; i++) {
        sum += coef[i] * Math.pow(x, n - i - 1);
    }

    fx_a = Math.sqrt(1 + Math.pow(sum, 2));
    x = valueOfHigherLimit;
    sum = 0;

    for (let i = 0; i < n; i++) {
        sum += coef[i] * Math.pow(x, n - i - 1);
    }

    fx_b = Math.sqrt(1 + Math.pow(sum, 2));
    x = (valueOfHigherLimit + valueOfLowerLimit) / 2;
    sum = 0;

    for (let i = 0; i < n; i++) {
        sum += coef[i] * Math.pow(x, n - i - 1);
    }

    fx_ab = Math.sqrt(1 + Math.pow(sum, 2));
    lengthOfCurve = (valueOfHigherLimit - valueOfLowerLimit) / 6 * (fx_a + 4 * fx_ab + fx_b);
    return roundPrecise(lengthOfCurve);
}

function generateEquation(roots, n) {

    var coefList = [];
    for (let i = 0; i < n - 1; i++) {
        coefList.push(0);
    }
    coefList.push(1);

    for (let i = 0; i < n; i++) {
        coefList[0] += roots[i];
        coefList[n - 1] *= roots[i];
    }

    if (n === 1) {
        return [-1 * roots[0]];
    }
    else {
        for (let i = n - 1; i > 1; i--) {
            let loop = new Array(i), count = 0;
            loop[count] = 0;
            loop2:
            while (true) {
                while (loop[count] < n - (i - 1 - count)) {
                    loop1:
                    while (true) {
                        count++;
                        for (loop[count] = loop[count - 1] + 1; loop[count] < n - (i - 1 - count); loop[count]++) {
                            if (count === i - 1) {
                                let product = 1, k;
                                for (let j = 0; j < i; j++) {
                                    k = loop[j];
                                    product *= roots[k];
                                }
                                coefList[i - 1] += product;
                            } else {
                                continue loop1;
                            }
                        }
                        break;
                    }
                    count--;
                    loop[count]++;
                }
                if (count !== 0) {
                    count--;
                    loop[count]++;
                    continue loop2;
                }
                break;
            }
        }

        for (let i = 0; i < n; i++) {
            coefList[i] = roundPrecise(coefList[i]);
            coefList[i] = coefList[i] * Math.pow(-1, i + 1);
        }
        return coefList;
    }
}