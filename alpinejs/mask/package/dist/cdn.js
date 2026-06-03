(() => {
  // packages/mask/src/index.js
  function src_default(Alpine) {
    Alpine.directive("mask", (el, { value, expression }, { effect, evaluateLater, cleanup }) => {
      let templateFn = () => expression;
      let lastInputValue = "";
      queueMicrotask(() => {
        if (["function", "dynamic"].includes(value)) {
          let evaluator = evaluateLater(expression);
          effect(() => {
            templateFn = (input) => {
              let result;
              Alpine.dontAutoEvaluateFunctions(() => {
                evaluator((value2) => {
                  result = typeof value2 === "function" ? value2(input) : value2;
                }, { scope: {
                  // These are "magics" we'll make available to the x-mask:function:
                  "$input": input,
                  "$money": formatMoney.bind({ el })
                } });
              });
              return result;
            };
            processInputValue(el, false);
          });
        } else {
          processInputValue(el, false);
        }
        if (el._x_model) {
          if (el._x_model.get() !== el.value) {
            if (!(el._x_model.get() === null && el.value === "")) {
              el._x_model.set(el.value);
            }
          }
          let updater = el._x_forceModelUpdate;
          el._x_forceModelUpdate = (value2) => {
            value2 = String(value2);
            let template = templateFn(value2);
            if (template && template !== "false") {
              value2 = formatInput(template, value2);
            }
            lastInputValue = value2;
            updater(value2);
            el._x_model.set(value2);
          };
        }
      });
      const controller = new AbortController();
      cleanup(() => {
        controller.abort();
      });
      el.addEventListener("input", () => processInputValue(el), {
        signal: controller.signal,
        // Setting this as a capture phase listener to ensure it runs
        // before wire:model or x-model added as a latent binding...
        capture: true
      });
      el.addEventListener("blur", () => processInputValue(el, false), { signal: controller.signal });
      function processInputValue(el2, shouldRestoreCursor = true) {
        let input = el2.value;
        let template = templateFn(input);
        if (!template || template === "false")
          return false;
        if (lastInputValue.length - el2.value.length === 1) {
          return lastInputValue = el2.value;
        }
        let setInput = () => {
          lastInputValue = el2.value = formatInput(template, input);
        };
        if (shouldRestoreCursor) {
          restoreCursorPosition(el2, template, () => {
            setInput();
          });
        } else {
          setInput();
        }
      }
    }).before("model");
  }
  function restoreCursorPosition(el, template, callback) {
    let cursorPosition = el.selectionStart;
    let unformattedValue = el.value;
    callback();
    let beforeLeftOfCursorBeforeFormatting = unformattedValue.slice(0, cursorPosition);
    let newPosition = formatInput(
      template,
      beforeLeftOfCursorBeforeFormatting
    ).length;
    el.setSelectionRange(newPosition, newPosition);
  }
  var regexes = {
    "9": /[0-9]/,
    "a": /[a-zA-Z]/,
    "*": /[a-zA-Z0-9]/
  };
  function formatInput(template, input) {
    let templateMark = 0;
    let inputMark = 0;
    let output = "";
    while (templateMark < template.length && inputMark < input.length) {
      let templateChar = template[templateMark];
      let inputChar = input[inputMark];
      if (templateChar in regexes) {
        if (regexes[templateChar].test(inputChar)) {
          output += inputChar;
          templateMark++;
        }
        inputMark++;
      } else {
        output += templateChar;
        templateMark++;
        if (templateChar === input[inputMark])
          inputMark++;
      }
    }
    return output;
  }
  function formatMoney(input, delimiter = ".", thousands, precision = 2) {
    if (input === "-")
      return "-";
    if (/^\D+$/.test(input))
      return "9";
    if (thousands === null || thousands === void 0) {
      thousands = delimiter === "," ? "." : ",";
    }
    let addThousands = (input2, thousands2) => {
      let output = "";
      let counter = 0;
      for (let i = input2.length - 1; i >= 0; i--) {
        if (input2[i] === thousands2)
          continue;
        if (counter === 3) {
          output = input2[i] + thousands2 + output;
          counter = 0;
        } else {
          output = input2[i] + output;
        }
        counter++;
      }
      return output;
    };
    let minus = input.startsWith("-") ? "-" : "";
    let strippedInput = input.replaceAll(new RegExp(`[^0-9\\${delimiter}]`, "g"), "");
    let template = Array.from({ length: strippedInput.split(delimiter)[0].length }).fill("9").join("");
    template = `${minus}${addThousands(template, thousands)}`;
    if (precision > 0 && input.includes(delimiter))
      template += `${delimiter}` + "9".repeat(precision);
    queueMicrotask(() => {
      if (this.el.value.endsWith(delimiter))
        return;
      if (this.el.value[this.el.selectionStart - 1] === delimiter) {
        this.el.setSelectionRange(this.el.selectionStart - 1, this.el.selectionStart - 1);
      }
    });
    return template;
  }

  // packages/mask/builds/cdn.js
  document.addEventListener("alpine:init", () => {
    window.Alpine.plugin(src_default);
  });
})();
