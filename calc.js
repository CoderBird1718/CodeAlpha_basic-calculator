/* ================================================================
   VRINDAVAN CALC — Calculator Logic
   calc.js
   ================================================================ */

"use strict";

/* ── DOM refs ── */
const exprEl   = document.getElementById("expression");
const previewEl= document.getElementById("preview");
const historyEl= document.getElementById("history");
const calcEl   = document.getElementById("calculator");
const themeBtn = document.getElementById("themeToggle");
const themeIcon= document.getElementById("themeIcon");

/* ── State ── */
let state = {
  current:    "0",      
  operator:   null,    
  operand:    null,     
  justEvaled: false,    
  history:    "",      
};

/* ── Theme ── */
let isDark = true;
themeBtn.addEventListener("click", () => {
  isDark = !isDark;
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  themeIcon.textContent = isDark ? "🌙" : "☀️";
});

/* ================================================================
   CORE CALCULATOR FUNCTIONS
================================================================ */

function inputDigit(digit) {
  if (state.justEvaled) {
    state.current  = digit;
    state.justEvaled = false;
  } else {
    state.current = state.current === "0" ? digit : state.current + digit;
  }
  // Max 15 chars
  if (state.current.length > 15) state.current = state.current.slice(0, 15);
  render();
}

function inputDecimal() {
  if (state.justEvaled) { state.current = "0."; state.justEvaled = false; render(); return; }
  if (!state.current.includes(".")) state.current += ".";
  render();
}

function inputOperator(op) {
  const cur = parseFloat(state.current);

  // Chain operations: calculate on the fly
  if (state.operator && !state.justEvaled) {
    const result = calculate(state.operand, cur, state.operator);
    if (result === null) { triggerError(); return; }
    state.operand  = result;
    state.current  = formatResult(result);
    state.history  = `${formatResult(state.operand)} ${opSymbol(op)}`;
  } else {
    state.operand = cur;
    state.history = `${formatResult(cur)} ${opSymbol(op)}`;
  }

  state.operator   = op;
  state.justEvaled = true;
  clearPreview();
  highlightOp(op);
  render();
}

function evaluate() {
  if (!state.operator || state.operand === null) return;

  const cur  = parseFloat(state.current);
  const result = calculate(state.operand, cur, state.operator);

  if (result === null) { triggerError(); return; }

  // Update history
  state.history = `${formatResult(state.operand)} ${opSymbol(state.operator)} ${formatResult(cur)} =`;

  state.current    = formatResult(result);
  state.operand    = null;
  state.operator   = null;
  state.justEvaled = true;

  clearPreview();
  clearOpHighlight();

  // Flash animation
  exprEl.classList.remove("result-flash");
  void exprEl.offsetWidth;
  exprEl.classList.add("result-flash");

  render();
}

function calculate(a, b, op) {
  switch (op) {
    case "add":      return a + b;
    case "subtract": return a - b;
    case "multiply": return a * b;
    case "divide":
      if (b === 0) return null;
      return a / b;
  }
  return null;
}

function clearAll() {
  state = { current: "0", operator: null, operand: null, justEvaled: false, history: "" };
  clearPreview();
  clearOpHighlight();
  render();
}

function toggleSign() {
  const n = parseFloat(state.current);
  if (isNaN(n)) return;
  state.current = formatResult(-n);
  render();
  updatePreview();
}

function applyPercent() {
  const n = parseFloat(state.current);
  if (isNaN(n)) return;
  state.current = formatResult(n / 100);
  render();
  updatePreview();
}

/* ================================================================
   RENDER
================================================================ */

function render() {
  exprEl.textContent = state.current;
  historyEl.textContent = state.history || "\u00a0";

  // Adaptive font size
  const len = state.current.length;
  exprEl.classList.remove("sm", "xs", "xxs");
  if      (len > 14) exprEl.classList.add("xxs");
  else if (len > 10) exprEl.classList.add("xs");
  else if (len > 7)  exprEl.classList.add("sm");

  // AC label
  document.querySelectorAll("[data-action='clear']").forEach(b => {
    b.textContent = (state.current !== "0" || state.operand) ? "C" : "AC";
  });
}

function updatePreview() {
  if (!state.operator || state.operand === null || state.justEvaled) {
    clearPreview(); return;
  }
  const cur = parseFloat(state.current);
  if (isNaN(cur)) { clearPreview(); return; }
  const r = calculate(state.operand, cur, state.operator);
  if (r === null) {
    previewEl.textContent = "Cannot ÷ 0";
    previewEl.classList.add("show", "err");
  } else {
    previewEl.textContent = "= " + formatResult(r);
    previewEl.classList.remove("err");
    previewEl.classList.add("show");
  }
}

function clearPreview() {
  previewEl.textContent = "";
  previewEl.classList.remove("show", "err");
}

/* ── Format numbers nicely ── */
function formatResult(n) {
  if (isNaN(n) || !isFinite(n)) return "Error";
  // Avoid floating point noise
  let s = parseFloat(n.toPrecision(12)).toString();
  // Cap length
  if (s.length > 15) s = parseFloat(n.toExponential(6)).toString();
  return s;
}

/* ── Operator symbols ── */
function opSymbol(op) {
  return { add: "+", subtract: "−", multiply: "×", divide: "÷" }[op] || op;
}

/* ── Highlight active op button ── */
function highlightOp(op) {
  clearOpHighlight();
  document.querySelectorAll(`.btn-op[data-action="${op}"]`).forEach(b => b.classList.add("active-op"));
}
function clearOpHighlight() {
  document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active-op"));
}

/* ── Error shake ── */
function triggerError() {
  state.current = "Error";
  render();
  previewEl.textContent = "Division by zero ✗";
  previewEl.classList.add("show", "err");
  calcEl.classList.remove("shake");
  void calcEl.offsetWidth;
  calcEl.classList.add("shake");
  setTimeout(() => {
    state.current = "0";
    state.operator = null;
    state.operand = null;
    state.justEvaled = false;
    render();
    clearPreview();
  }, 1800);
}

/* ================================================================
   BUTTON CLICK HANDLER
================================================================ */

document.querySelector(".btn-grid").addEventListener("click", e => {
  const btn = e.target.closest(".btn");
  if (!btn) return;

  rippleEffect(btn, e);
  btn.classList.remove("flash");
  void btn.offsetWidth;
  btn.classList.add("flash");

  const action = btn.dataset.action;
  const value  = btn.dataset.value;

  if (value !== undefined) {
    inputDigit(value);
    updatePreview();
    return;
  }

  switch (action) {
    case "clear":    clearAll(); break;
    case "sign":     toggleSign(); break;
    case "percent":  applyPercent(); break;
    case "decimal":  inputDecimal(); updatePreview(); break;
    case "divide":
    case "multiply":
    case "subtract":
    case "add":      inputOperator(action); break;
    case "equals":   evaluate(); break;
  }
});

/* ================================================================
   RIPPLE EFFECT
================================================================ */

function rippleEffect(btn, e) {
  const rect = btn.getBoundingClientRect();
  const r = document.createElement("span");
  r.className = "ripple";
  const size = Math.max(rect.width, rect.height);
  r.style.cssText = `
    width: ${size}px; height: ${size}px;
    left:  ${e.clientX - rect.left  - size / 2}px;
    top:   ${e.clientY - rect.top   - size / 2}px;
  `;
  btn.appendChild(r);
  r.addEventListener("animationend", () => r.remove());
}

/* ================================================================
   KEYBOARD SUPPORT
================================================================ */

const keyMap = {
  "0":"0","1":"1","2":"2","3":"3","4":"4",
  "5":"5","6":"6","7":"7","8":"8","9":"9",
  "+":"add", "-":"subtract", "*":"multiply", "x":"multiply",
  "/":"divide",
  "Enter":"equals", "=":"equals",
  "Backspace":"backspace",
  "Escape":"clear", "Delete":"clear",
  ".":"decimal", ",":"decimal",
  "%":"percent",
};

document.addEventListener("keydown", e => {
  // Ignore if typing in input fields
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

  const mapped = keyMap[e.key];
  if (!mapped && e.key !== "Backspace") return;

  e.preventDefault();

  if (e.key === "Backspace") {
    handleBackspace();
    flashKey("backspace");
    return;
  }

  if ("0123456789".includes(mapped)) {
    inputDigit(mapped);
    updatePreview();
    flashKey(mapped);
    return;
  }

  switch (mapped) {
    case "add":
    case "subtract":
    case "multiply":
    case "divide":
      inputOperator(mapped);
      flashKey(mapped);
      break;
    case "equals":
      evaluate();
      flashKey("equals");
      break;
    case "clear":
      clearAll();
      flashKey("clear");
      break;
    case "decimal":
      inputDecimal();
      updatePreview();
      flashKey("decimal");
      break;
    case "percent":
      applyPercent();
      flashKey("percent");
      break;
  }
});

function handleBackspace() {
  if (state.justEvaled || state.current === "0") return;
  state.current = state.current.length > 1 ? state.current.slice(0, -1) : "0";
  render();
  updatePreview();
}

function flashKey(key) {
  // Find matching button and flash it
  let btn =
    document.querySelector(`[data-value="${key}"]`) ||
    document.querySelector(`[data-action="${key}"]`);
  if (!btn) return;
  btn.classList.remove("flash");
  void btn.offsetWidth;
  btn.classList.add("flash");
}

/* ── Remove shake class after animation ── */
calcEl.addEventListener("animationend", e => {
  if (e.animationName === "shake") calcEl.classList.remove("shake");
});
exprEl.addEventListener("animationend", e => {
  if (e.animationName === "resultPop") exprEl.classList.remove("result-flash");
});

/* ── Initial render ── */
render();