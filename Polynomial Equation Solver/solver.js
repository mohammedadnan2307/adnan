var fx, fdx, results, displayMsg = "";
const preciseValue = 5;
const errorMsg = "As the slope is steeper, we could'nt find it! \nEnter a value which might be near one of the";

function controlFunction(coef, userChoice) {
    results = [];
    var n = coef.length - 1;
    if (userChoice === "1") {
        displayMsg = "The solutions are: "
        return solve(coef, n);
    } else if (userChoice === "2") {
        displayMsg = "Turning points are: "
        return solve(coef, n, "turningPt");
    } else if (userChoice === "3") {
        displayMsg = "The Equation is: "
        return generateEquation(coef, n + 1);
    } else if (userChoice === "4") {
        displayMsg = "Curve area is: "
        return curveArea(coef, n);
    } else if (userChoice === "5") {
        displayMsg = "Curve length is: "
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

function solve(coef, n, type = "root") {
    if (n <= 2) {
        if (n === 1) {
            degOne(coef[0], coef[1]);
        } else {
            degTwo(coef[0], coef[1], coef[2], type);
        }
    }
    else {
        let x, x2, limit = 500, counter = 0;
        x = analyze(coef, n);
        do {
            manipulator(coef, x, n);
            if (fdx === 0) {
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
                    if (type === "root") {
                        if (n % 2 === 0) {
                            return results;
                        } else {
                            x = Number(prompt(errorMsg + "Roots"));
                            continue;
                        }
                    } else {
                        if (n % 2 === 0) {
                            x = Number(prompt(errorMsg + "Turning Points"));
                            continue;
                        } else {
                            return results;
                        }
                    }
                }
            }
        }
        while (!checkFunc(fx, 0));
        results.push(roundPrecise(x));
        for (let i = 1; i < n; i++) {
            coef[i] = coef[i - 1] * x + coef[i];
        }
        solve(coef, n - 1, type);
    }
    return results;
}

function degTwo(a, b, c, type = "root") {
    if (type === "root") {
        let x1, x2, d;
        d = b * b - 4 * a * c;

        if (d >= 0) {
            x1 = (-b + Math.sqrt(d)) / (2 * a);
            x2 = (-b - Math.sqrt(d)) / (2 * a);
            results.push(roundPrecise(x1), roundPrecise(x2));
        }
    } else {
        let x = -b / 2 * a;
        results.push(roundPrecise(x));
    }
    return results;
}

function degOne(a, b) {
    let x = -(b / a);
    results.push(roundPrecise(x));
    return results;
}

function curveArea(coef, n) {
    var area, lowerArea = 0, higherArea = 0, valueOfHigherLimit = 0, valueOfLowerLimit = 0;
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

function curveLength(coef, n) {
    for (let i = 0; i < n; i++) {
        coef[i] = coef[i] * (n - i);
    }

    var lengthOfCurve, valueOfHigherLimit = 0, valueOfLowerLimit = 0, fx_a, fx_b, fx_ab;
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
        return ("x = " + coefList[0]);
    }
    else {
        for (let i = n - 1; i > 1; i--) {

            let loop = new Array(i), count = 0;
            loop2:
            while (true) {
                for (loop[count] = 0; loop[count] < n - (i - 1 - count); loop[count]++) {
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
                        count--;
                        break;
                    }
                }
                if (count !== 0) {
                    count--;
                    continue loop2;
                }
                else {
                    break;
                }
            }
        }

        var equation = "x^";
        equation.concat(n);

        for (let i = n, k = 1; i > 1; i--, k++) {
            let temp = coefList[n - i] * Math.pow(-1, k);

            if (temp >= 0) {
                equation.concat(" +", temp);
            } else {
                equation.concat(" ", temp);
            }

            if (i - 1 === 1) {
                equation.concat("x");
            } else {
                equation.concat("x^", i - 1);
            }
        }

        equation.concat(coefList[n - 1] * Math.pow(-1, n), " = 0");
        return equation;
    }
}