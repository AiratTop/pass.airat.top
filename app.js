const PASSWORD = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  special: "!@#$%&*",
  ambiguous: new Set(["0", "O", "o", "1", "l", "I"]),
};

const ui = {
  tabs: Array.from(document.querySelectorAll(".tab")),
  panels: {
    password: document.querySelector("#panel-password"),
    passphrase: document.querySelector("#panel-passphrase"),
    username: document.querySelector("#panel-username"),
  },
  password: {
    output: document.querySelector("#passwordOutput"),
    outputWrap: document.querySelector("#passwordOutputWrap"),
    refresh: document.querySelector("#passwordRefresh"),
    copy: document.querySelector("#passwordCopy"),
    status: document.querySelector("#passwordStatus"),
    error: document.querySelector("#passwordError"),
    length: document.querySelector("#passwordLength"),
    includeUpper: document.querySelector("#includeUpper"),
    includeLower: document.querySelector("#includeLower"),
    includeNumbers: document.querySelector("#includeNumbers"),
    includeSpecial: document.querySelector("#includeSpecial"),
    minNumbers: document.querySelector("#minNumbers"),
    minSpecial: document.querySelector("#minSpecial"),
    avoidAmbiguous: document.querySelector("#avoidAmbiguous"),
  },
  passphrase: {
    output: document.querySelector("#passphraseOutput"),
    outputWrap: document.querySelector("#passphraseOutputWrap"),
    refresh: document.querySelector("#passphraseRefresh"),
    copy: document.querySelector("#passphraseCopy"),
    status: document.querySelector("#passphraseStatus"),
    words: document.querySelector("#passphraseWords"),
    separator: document.querySelector("#passphraseSeparator"),
    capitalize: document.querySelector("#passphraseCapitalize"),
    includeNumber: document.querySelector("#passphraseNumber"),
  },
  username: {
    output: document.querySelector("#usernameOutput"),
    outputWrap: document.querySelector("#usernameOutputWrap"),
    refresh: document.querySelector("#usernameRefresh"),
    copy: document.querySelector("#usernameCopy"),
    status: document.querySelector("#usernameStatus"),
    type: document.querySelector("#usernameType"),
    capitalize: document.querySelector("#usernameCapitalize"),
    includeNumber: document.querySelector("#usernameNumber"),
  },
};

const state = {
  messageTimers: new Map(),
};

function randomInt(max) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

function pickRandom(source) {
  return source[randomInt(source.length)];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function setStatus(target, message) {
  const existing = state.messageTimers.get(target);
  if (existing) {
    clearTimeout(existing);
  }
  target.textContent = message;
  if (!message) {
    return;
  }
  const timer = setTimeout(() => {
    target.textContent = "";
  }, 2400);
  state.messageTimers.set(target, timer);
}

function copyText(text, statusNode, label) {
  if (!text) {
    return;
  }
  const message = label ? `${label} copied.` : "Copied to clipboard.";
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => setStatus(statusNode, message))
      .catch(() => setStatus(statusNode, "Copy failed."));
    return;
  }

  const fallback = document.createElement("textarea");
  fallback.value = text;
  fallback.setAttribute("readonly", "");
  fallback.style.position = "absolute";
  fallback.style.left = "-9999px";
  document.body.appendChild(fallback);
  fallback.select();
  try {
    document.execCommand("copy");
    setStatus(statusNode, message);
  } catch (err) {
    setStatus(statusNode, "Copy failed.");
  }
  document.body.removeChild(fallback);
}

function filteredSet(source, avoidAmbiguous) {
  if (!avoidAmbiguous) {
    return source;
  }
  return source
    .split("")
    .filter((char) => !PASSWORD.ambiguous.has(char))
    .join("");
}

function clampNumber(value, min, max) {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
}

function updateMinInputs() {
  const numbersEnabled = ui.password.includeNumbers.checked;
  const specialEnabled = ui.password.includeSpecial.checked;

  ui.password.minNumbers.disabled = !numbersEnabled;
  if (!numbersEnabled) {
    ui.password.minNumbers.value = "0";
  }

  ui.password.minSpecial.disabled = !specialEnabled;
  if (!specialEnabled) {
    ui.password.minSpecial.value = "0";
  }
}

function buildPassword() {
  const length = clampNumber(parseInt(ui.password.length.value, 10), 5, 128);
  ui.password.length.value = `${length}`;

  const avoidAmbiguous = ui.password.avoidAmbiguous.checked;
  const sets = [];
  const required = [];

  const upper = filteredSet(PASSWORD.upper, avoidAmbiguous);
  const lower = filteredSet(PASSWORD.lower, avoidAmbiguous);
  const numbers = filteredSet(PASSWORD.numbers, avoidAmbiguous);
  const special = filteredSet(PASSWORD.special, avoidAmbiguous);

  if (ui.password.includeUpper.checked && upper) {
    sets.push(upper);
    required.push(pickRandom(upper));
  }
  if (ui.password.includeLower.checked && lower) {
    sets.push(lower);
    required.push(pickRandom(lower));
  }

  if (ui.password.includeNumbers.checked && numbers) {
    sets.push(numbers);
    const minNumbers = clampNumber(
      parseInt(ui.password.minNumbers.value, 10),
      0,
      128
    );
    ui.password.minNumbers.value = `${minNumbers}`;
    for (let i = 0; i < minNumbers; i += 1) {
      required.push(pickRandom(numbers));
    }
  }

  if (ui.password.includeSpecial.checked && special) {
    sets.push(special);
    const minSpecial = clampNumber(
      parseInt(ui.password.minSpecial.value, 10),
      0,
      128
    );
    ui.password.minSpecial.value = `${minSpecial}`;
    for (let i = 0; i < minSpecial; i += 1) {
      required.push(pickRandom(special));
    }
  }

  if (!sets.length) {
    ui.password.error.textContent = "Select at least one character set.";
    return "";
  }

  if (required.length > length) {
    ui.password.error.textContent = "Increase length or lower minimums.";
    return "";
  }

  ui.password.error.textContent = "";

  const pool = sets.join("");
  const output = required.slice();
  const remaining = length - required.length;

  for (let i = 0; i < remaining; i += 1) {
    output.push(pickRandom(pool));
  }

  return shuffle(output).join("");
}

function buildPassphrase() {
  const words = clampNumber(parseInt(ui.passphrase.words.value, 10), 3, 20);
  ui.passphrase.words.value = `${words}`;

  const separator = ui.passphrase.separator.value;
  const capitalize = ui.passphrase.capitalize.checked;
  const includeNumber = ui.passphrase.includeNumber.checked;

  if (!Array.isArray(window.WORDS) || window.WORDS.length === 0) {
    return "wordlist missing";
  }

  const result = [];
  for (let i = 0; i < words; i += 1) {
    let word = pickRandom(window.WORDS);
    if (capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    result.push(word);
  }

  if (includeNumber) {
    const index = randomInt(result.length);
    const value = (randomInt(90) + 10).toString();
    result[index] = `${result[index]}${value}`;
  }

  return result.join(separator);
}

function buildUsername() {
  const type = ui.username.type.value;
  const capitalize = ui.username.capitalize.checked;
  const includeNumber = ui.username.includeNumber.checked;

  if (!Array.isArray(window.WORDS) || window.WORDS.length === 0) {
    return "wordlist missing";
  }

  const count = type === "double" ? 2 : 1;
  const words = [];

  for (let i = 0; i < count; i += 1) {
    let word = pickRandom(window.WORDS);
    if (capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    words.push(word);
  }

  let username = words.join("");
  if (includeNumber) {
    const value = randomInt(10000).toString().padStart(4, "0");
    username = `${username}${value}`;
  }

  return username;
}

function refreshPassword() {
  const next = buildPassword();
  ui.password.output.textContent = next || "";
}

function refreshPassphrase() {
  const next = buildPassphrase();
  ui.passphrase.output.textContent = next || "";
}

function refreshUsername() {
  const next = buildUsername();
  ui.username.output.textContent = next || "";
}

function setActiveTab(next) {
  ui.tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === next;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  Object.entries(ui.panels).forEach(([key, panel]) => {
    panel.classList.toggle("is-active", key === next);
  });
}

function bindEvents() {
  ui.tabs.forEach((tab) => {
    tab.addEventListener("click", () => setActiveTab(tab.dataset.tab));
  });

  ui.password.refresh.addEventListener("click", refreshPassword);
  ui.password.copy.addEventListener("click", () => {
    copyText(ui.password.output.textContent, ui.password.status, "Password");
  });
  ui.password.outputWrap.addEventListener("click", (event) => {
    if (event.target.closest("button")) {
      return;
    }
    copyText(ui.password.output.textContent, ui.password.status, "Password");
  });

  ui.passphrase.refresh.addEventListener("click", refreshPassphrase);
  ui.passphrase.copy.addEventListener("click", () => {
    copyText(ui.passphrase.output.textContent, ui.passphrase.status, "Passphrase");
  });
  ui.passphrase.outputWrap.addEventListener("click", (event) => {
    if (event.target.closest("button")) {
      return;
    }
    copyText(ui.passphrase.output.textContent, ui.passphrase.status, "Passphrase");
  });

  ui.username.refresh.addEventListener("click", refreshUsername);
  ui.username.copy.addEventListener("click", () => {
    copyText(ui.username.output.textContent, ui.username.status, "Username");
  });
  ui.username.outputWrap.addEventListener("click", (event) => {
    if (event.target.closest("button")) {
      return;
    }
    copyText(ui.username.output.textContent, ui.username.status, "Username");
  });

  const passwordInputs = [
    ui.password.length,
    ui.password.includeUpper,
    ui.password.includeLower,
    ui.password.includeNumbers,
    ui.password.includeSpecial,
    ui.password.minNumbers,
    ui.password.minSpecial,
    ui.password.avoidAmbiguous,
  ];

  passwordInputs.forEach((input) => {
    input.addEventListener("input", () => {
      updateMinInputs();
      refreshPassword();
    });
  });

  const passphraseInputs = [
    ui.passphrase.words,
    ui.passphrase.separator,
    ui.passphrase.capitalize,
    ui.passphrase.includeNumber,
  ];

  passphraseInputs.forEach((input) => {
    input.addEventListener("input", refreshPassphrase);
  });

  const usernameInputs = [
    ui.username.type,
    ui.username.capitalize,
    ui.username.includeNumber,
  ];

  usernameInputs.forEach((input) => {
    input.addEventListener("input", refreshUsername);
  });
}

updateMinInputs();
bindEvents();
refreshPassword();
refreshPassphrase();
refreshUsername();
