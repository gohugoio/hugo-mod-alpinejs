// packages/intersect/src/index.js
function src_default(Alpine) {
  Alpine.directive("intersect", Alpine.skipDuringClone((el, { value, expression, modifiers }, { evaluateLater, cleanup }) => {
    let evaluate = evaluateLater(expression);
    let threshold = getThreshold(modifiers);
    let options = {
      rootMargin: getRootMargin(modifiers),
      threshold,
      root: modifiers.includes("parent") ? el.parentElement : null
    };
    if (modifiers.includes("dwell")) {
      observeForDwell(el, value, modifiers, evaluate, cleanup, options, threshold);
      return;
    }
    let observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting === (value === "leave"))
          return;
        evaluate();
        modifiers.includes("once") && observer.disconnect();
      });
    }, options);
    observer.observe(el);
    cleanup(() => {
      observer.disconnect();
    });
  }));
}
function observeForDwell(el, value, modifiers, evaluate, cleanup, options, threshold) {
  let dwellTimeout;
  let lastEntry;
  let hasEvaluated = false;
  let isConfirmingDwell = false;
  let duration = getDwellDuration(modifiers);
  let observer;
  let clearDwellTimeout = () => {
    clearTimeout(dwellTimeout);
    dwellTimeout = void 0;
  };
  let completeDwell = () => {
    isConfirmingDwell = false;
    if (!lastEntry || document.hidden || !meetsDwellThreshold(lastEntry, value, threshold))
      return;
    hasEvaluated = true;
    evaluate();
    if (modifiers.includes("once")) {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  };
  let observe = () => {
    observer && observer.disconnect();
    observer = new IntersectionObserver(handleEntries, options);
    observer.observe(el);
  };
  let confirmDwell = () => {
    dwellTimeout = void 0;
    if (document.hidden)
      return;
    let pendingEntries = observer.takeRecords();
    if (pendingEntries.some((entry) => !meetsDwellThreshold(entry, value, threshold))) {
      handleEntries(pendingEntries);
      return;
    }
    isConfirmingDwell = true;
    lastEntry = void 0;
    observe();
  };
  let beginDwell = () => {
    if (dwellTimeout !== void 0 || hasEvaluated || document.hidden || !lastEntry)
      return;
    if (!meetsDwellThreshold(lastEntry, value, threshold))
      return;
    dwellTimeout = setTimeout(confirmDwell, duration);
  };
  let handleEntries = (entries) => {
    entries.forEach((entry) => {
      lastEntry = entry;
      if (!meetsDwellThreshold(entry, value, threshold)) {
        clearDwellTimeout();
        hasEvaluated = false;
        isConfirmingDwell = false;
        return;
      }
      if (isConfirmingDwell) {
        completeDwell();
        return;
      }
      beginDwell();
    });
  };
  let handleVisibilityChange = () => {
    if (document.hidden) {
      clearDwellTimeout();
      lastEntry = void 0;
      hasEvaluated = false;
      isConfirmingDwell = false;
      observer.disconnect();
      return;
    }
    observe();
  };
  observe();
  document.addEventListener("visibilitychange", handleVisibilityChange);
  cleanup(() => {
    clearDwellTimeout();
    observer.disconnect();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  });
}
function meetsDwellThreshold(entry, value, threshold) {
  let meetsThreshold = threshold === 0 ? entry.isIntersecting : entry.isIntersecting && entry.intersectionRatio >= threshold;
  return value === "leave" ? !meetsThreshold : meetsThreshold;
}
function getDwellDuration(modifiers) {
  let rawDuration = modifiers[modifiers.indexOf("dwell") + 1] || "";
  let match = rawDuration.match(/^([0-9]+)(ms)?$/);
  return match ? Number(match[1]) : 250;
}
function getThreshold(modifiers) {
  if (modifiers.includes("full"))
    return 0.99;
  if (modifiers.includes("half"))
    return 0.5;
  if (!modifiers.includes("threshold"))
    return 0;
  let threshold = modifiers[modifiers.indexOf("threshold") + 1];
  if (threshold === "100")
    return 1;
  if (threshold === "0")
    return 0;
  return Number(`.${threshold}`);
}
function getLengthValue(rawValue) {
  let match = rawValue.match(/^(-?[0-9]+)(px|%)?$/);
  return match ? match[1] + (match[2] || "px") : void 0;
}
function getRootMargin(modifiers) {
  const key = "margin";
  const fallback = "0px 0px 0px 0px";
  const index = modifiers.indexOf(key);
  if (index === -1)
    return fallback;
  let values = [];
  for (let i = 1; i < 5; i++) {
    values.push(getLengthValue(modifiers[index + i] || ""));
  }
  values = values.filter((v) => v !== void 0);
  return values.length ? values.join(" ").trim() : fallback;
}

// packages/intersect/builds/module.js
var module_default = src_default;
export {
  module_default as default,
  src_default as intersect
};
