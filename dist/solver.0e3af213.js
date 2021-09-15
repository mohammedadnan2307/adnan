// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"Polynomial Equation Solver/solver.js":[function(require,module,exports) {
var fx,
    fdx,
    results,
    displayMsg = "";
var preciseValue = 5;
var errorMsg = "As the slope is steeper, we could'nt find it! \nEnter a value which might be near one of the";

function controlFunction(coef, userChoice) {
  results = [];
  var n = coef.length - 1;

  if (userChoice === "1") {
    displayMsg = "The solutions are: ";
    return solve(coef, n);
  } else if (userChoice === "2") {
    displayMsg = "Turning points are: ";
    return solve(coef, n, "turningPt");
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

function roundPrecise(n) {
  var decimalPlaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : preciseValue;
  var factorOfTen = Math.pow(10, decimalPlaces);
  return Math.round(n * factorOfTen) / factorOfTen;
}

function checkFunc(a, b) {
  var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;
  var p = a.toFixed(n);
  var q = b.toFixed(n);

  if (p === q) {
    return true;
  } else {
    return false;
  }
}

function manipulator(coef, x, n) {
  fx = fdx = 0;

  for (var i = 0; i <= n; i++) {
    fx += coef[i] * Math.pow(x, n - i);
  }

  for (var _i = 0; _i < n; _i++) {
    fdx += (n - _i) * coef[_i] * Math.pow(x, n - _i - 1);
  }
}

function analyze(coef, n) {
  var averageRoot = -(coef[1] / coef[0]) / n;
  return averageRoot;
}

function solve(coef, n) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "root";

  if (n <= 2) {
    if (n === 1) {
      degOne(coef[0], coef[1]);
    } else {
      degTwo(coef[0], coef[1], coef[2], type);
    }
  } else {
    var x,
        x2,
        limit = 500,
        counter = 0;
    x = analyze(coef, n);

    do {
      manipulator(coef, x, n);

      if (fdx === 0) {
        x += 0.1;
        continue;
      }

      x2 = x - fx / fdx;

      if (checkFunc(x2, x)) {
        break;
      } else {
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
    } while (!checkFunc(fx, 0));

    results.push(roundPrecise(x));

    for (var i = 1; i < n; i++) {
      coef[i] = coef[i - 1] * x + coef[i];
    }

    solve(coef, n - 1, type);
  }

  return results;
}

function degTwo(a, b, c) {
  var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "root";

  if (type === "root") {
    var x1, x2, d;
    d = b * b - 4 * a * c;

    if (d >= 0) {
      x1 = (-b + Math.sqrt(d)) / (2 * a);
      x2 = (-b - Math.sqrt(d)) / (2 * a);
      results.push(roundPrecise(x1), roundPrecise(x2));
    }
  } else {
    var x = -b / 2 * a;
    results.push(roundPrecise(x));
  }

  return results;
}

function degOne(a, b) {
  var x = -(b / a);
  results.push(roundPrecise(x));
  return results;
}

function curveArea(coef, n) {
  var area,
      lowerArea = 0,
      higherArea = 0,
      valueOfHigherLimit = 0,
      valueOfLowerLimit = 0;
  valueOfLowerLimit = Number(prompt("Enter the value lower limit of the interval"));
  valueOfHigherLimit = Number(prompt("Enter the value higher limit of the interval"));
  var x = valueOfLowerLimit;

  for (var i = 0; i <= n; i++) {
    lowerArea += coef[i] * Math.pow(x, n + 1 - i) / (n + 1 - i);
  }

  x = valueOfHigherLimit;

  for (var _i2 = 0; _i2 <= n; _i2++) {
    higherArea += coef[_i2] * Math.pow(x, n + 1 - _i2) / (n + 1 - _i2);
  }

  area = higherArea - lowerArea;
  return roundPrecise(area);
}

function curveLength(coef, n) {
  for (var i = 0; i < n; i++) {
    coef[i] = coef[i] * (n - i);
  }

  var lengthOfCurve,
      valueOfHigherLimit = 0,
      valueOfLowerLimit = 0,
      fx_a,
      fx_b,
      fx_ab;
  valueOfLowerLimit = Number(prompt("Enter the value of lower limit of the interval"));
  valueOfHigherLimit = Number(prompt("Enter the value of higher limit of the interval"));
  var x = valueOfLowerLimit,
      sum = 0;

  for (var _i3 = 0; _i3 < n; _i3++) {
    sum += coef[_i3] * Math.pow(x, n - _i3 - 1);
  }

  fx_a = Math.sqrt(1 + Math.pow(sum, 2));
  x = valueOfHigherLimit;
  sum = 0;

  for (var _i4 = 0; _i4 < n; _i4++) {
    sum += coef[_i4] * Math.pow(x, n - _i4 - 1);
  }

  fx_b = Math.sqrt(1 + Math.pow(sum, 2));
  x = (valueOfHigherLimit + valueOfLowerLimit) / 2;
  sum = 0;

  for (var _i5 = 0; _i5 < n; _i5++) {
    sum += coef[_i5] * Math.pow(x, n - _i5 - 1);
  }

  fx_ab = Math.sqrt(1 + Math.pow(sum, 2));
  lengthOfCurve = (valueOfHigherLimit - valueOfLowerLimit) / 6 * (fx_a + 4 * fx_ab + fx_b);
  return roundPrecise(lengthOfCurve);
}

function generateEquation(roots, n) {
  var coefList = [];

  for (var i = 0; i < n - 1; i++) {
    coefList.push(0);
  }

  coefList.push(1);

  for (var _i6 = 0; _i6 < n; _i6++) {
    coefList[0] += roots[_i6];
    coefList[n - 1] *= roots[_i6];
  }

  if (n === 1) {
    return "x = " + coefList[0];
  } else {
    for (var _i7 = n - 1; _i7 > 1; _i7--) {
      var loop = new Array(_i7),
          count = 0;

      loop2: while (true) {
        for (loop[count] = 0; loop[count] < n - (_i7 - 1 - count); loop[count]++) {
          loop1: while (true) {
            count++;

            for (loop[count] = loop[count - 1] + 1; loop[count] < n - (_i7 - 1 - count); loop[count]++) {
              if (count === _i7 - 1) {
                var product = 1,
                    k = void 0;

                for (var j = 0; j < _i7; j++) {
                  k = loop[j];
                  product *= roots[k];
                }

                coefList[_i7 - 1] += product;
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
        } else {
          break;
        }
      }
    }

    var equation = "x^";
    equation.concat(n);

    for (var _i8 = n, _k = 1; _i8 > 1; _i8--, _k++) {
      var temp = coefList[n - _i8] * Math.pow(-1, _k);

      if (temp >= 0) {
        equation.concat(" +", temp);
      } else {
        equation.concat(" ", temp);
      }

      if (_i8 - 1 === 1) {
        equation.concat("x");
      } else {
        equation.concat("x^", _i8 - 1);
      }
    }

    equation.concat(coefList[n - 1] * Math.pow(-1, n), " = 0");
    return equation;
  }
}
},{}],"C:/Users/Admin/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60773" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/Admin/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","Polynomial Equation Solver/solver.js"], null)
//# sourceMappingURL=/solver.0e3af213.js.map