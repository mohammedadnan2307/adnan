var fx = 0, fdx = 0, results[];
const errorMsg = "As the slope is steeper, we could'nt find it! Enter a value which might be near one of the";

function manipulator(coef, x, n, calc_fdx = false) { // Calculates f(x) and f'(x) values
    fx = fdx = 0;
    for (let i = 0; i <= n; i++) {
        fx += coef[i] * (Math.pow(x, n - i));
    }
    if (calc_fdx == true) {
        for (let i = 0; i < n; i++) {
            fdx += (n - i) * coef[i] * Math.pow(x, n - i - 1);
        }
    }
}

function analyze(coef, n) {  // Calculates average root value
    var averageRoot = -(coef[1] / coef[0]) / n;
    return averageRoot;
}

function solve(coef, n, type = "root") {
    if (n <= 2) {
        if (n === 1) {
            degOne(coef[0], coef[1]);
        }
        else {
            degTwo(coef[0], coef[1], coef[2], type);
        }
    }
    else {
        let x, limit = 500, counter = 0;
        x = analyze(coef, n);
        do {
            manipulator(coef, x, n);
            if (fdx === 0) {
                x += 0.1;
                continue;
            }
            x = x - (fx / fdx);
            counter++;
            if (counter === limit) {
                if (type == "root") {
                    if (n % 2 === 0) {
                        return results;
                    }
                    else {
                        x = number(prompt(errorMsg + "Roots"));
                        continue;
                    }
                }
                else {
                    if (n % 2 === 0) {
                        x = number(prompt(errorMsg + "Turning Points"));
                        continue;
                    }
                    else {
                        return results;
                    }
                }
            }
        } while (fx != 0);
        results.push(x);
        for (let i = 1; i < n; i++) {
            coef[i] = coef[i - 1] * x + coef[i];
        }
        solve(coef, n - 1, type);
    }
    return results;
}

function degTwo(a, b, c, type = "root")
{
    if (type == "root") {
        let x1, x2, d;
        d = (b * b) - (4 * a * c);
        if (d >= 0) {
            x1 = (-b + Math.sqrt(d)) / (2 * a);
            x2 = (-b - Math.sqrt(d)) / (2 * a);
            results.push(x1, x2);
        }
    }
    else {
        let x = -b / 2 * a;
        results.push(x);
    }
    return results;
}

function degOne(a, b)
{
    let x = -(b / a);
    results.push(x);
    return results;
}

function curveArea(coef, n) {
    Next_attempt_for_area:
    var area, lowerArea = 0, higherArea = 0, valueOfHigherLimit, valueOfLowerLimit;
    valueOfLowerLimit = number(prompt("Enter the value lower limit of the interval"));
    valueOfHigherLimit = number(prompt("Enter the value higher limit of the interval"));
    var x = valueOfLowerLimit;
    for (let i = 0; i <= n; i++)
    {
        lowerArea += ((coef[i] * Math.pow(x, n + 1 - i)) / (n + 1 - i));
    }
    x = valueOfHigherLimit;
    for (let i = 0; i <= n; i++)
    {
        higherArea += ((coef[i] * Math.pow(x, n + 1 - i)) / (n + 1 - i));
    }
    area = higherArea - lowerArea;
    return area;
}

function curveLength(coef, n) {
    var lengthOfCurve, valueOfHigherLimit, valueOfLowerLimit, fx_a, fx_b, fx_ab;
    valueOfLowerLimit = number(prompt("Enter the value of lower limit of the interval"));
    valueOfHigherLimit = number(prompt("Enter the value of higher limit of the interval"));
    var x = valueOfLowerLimit, sum = 0;
    for (let i = 0; i < n; i++)
    {
        sum += coef[i] * Math.pow(x, n - i - 1);
    }
    fx_a = Math.sqrt(1 + Math.pow(sum, 2));
    x = valueOfHigherLimit;
    sum = 0;
    for (let i = 0; i < n; i++)
    {
        sum += coef[i] * Math.pow(x, n - i - 1);
    }
    fx_b = Math.sqrt(1 + Math.pow(sum, 2));
    x = (valueOfHigherLimit + valueOfLowerLimit) / 2;
    sum = 0;
    for (let i = 0; i < n; i++)
    {
        sum += coef[i] * Math.pow(x, n - i - 1);
    }
    fx_ab = Math.sqrt(1 + Math.pow(sum, 2));
    lengthOfCurve = ((valueOfHigherLimit - valueOfLowerLimit) / 6) * (fx_a + (4 * fx_ab) + fx_b);
    return lengthOfCurve;
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
    if (n == 1) {
        return coefList;
    }
    else {
        for (let i = n - 1; i > 1; i--) {
            var loop = new Array(i), count = 0;
            for (loop[count] = 0; loop[count] < n - (i - 1 - count); loop[count]++) {
                again:
                count++;
                for (loop[count] = loop[count - 1] + 1; loop[count] < n - (i - 1 - count); loop[count]++) {
                    if (count === i - 1) {
                        var product = 1, k;
                        for (let j = 0; j < i; j++)
                        {
                            k = loop[j];
                            product *= root[k];
                        }
                        coefList[i - 1] += product;
                    }
                    else {
                        continue again;
                    }
                }
                again_:
                count--;
            }
            if (count != 0) {
                continue again_;
            }
        }
        var equation = "x^";
        equation.concat(n);
        for (let i = n, k = 1; i > 1; i--, k++) {
            let temp = coefList[n - i] * pow(-1, k);
            if (temp >= 0) {
                equation.concat(" +", temp);
            }
            else {
                equation.concat(" ", temp);
            }
            if (i - 1 == 1) {
                equation.concat("x");
            }
            else {
                equation.concat("x^", i - 1);
            }
        }
        equation.concat(coefList[n - 1] * pow(-1, n), " = 0");
        return equation;
    }
}