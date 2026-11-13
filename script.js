// Current active algorithm state
let currentTab = "caesar";

// Roman Urdu Guide Content for each algorithm
const guides = {
  caesar: {
    title: "Caesar Cipher Kya Hai?",
    badge: "Classic Substitution",
    desc: "Yeh tareeqa Julius Caesar ne apne khufiya paighamat bhejne ke liye istemal kiya tha. Is mein har letter (A-Z) ko aik khas number (Shift) ke mutabiq aage ya peeche khiskaya jata hai. Maslan agar Shift 3 ho to 'A' ban jata hai 'D'.",
    usage:
      "Istemal: Yeh aaj kal sirf seekhne ke liye istemal hota hai kyunke sirf 25 shifts check karke isay aasani se tora ja sakta hai.",
  },
  vigenere: {
    title: "Vigenère Cipher Kya Hai?",
    badge: "Polyalphabetic Cipher",
    desc: "Caesar cipher ko mazboot banane ke liye Vigenère cipher banaya gaya. Is mein aik number ke bajaye aik poora lafz (Keyword) istemal hota hai. Keyword ke har letter ke mutabiq alag-alag shift lagta hai.",
    usage:
      'Istemal: Sadiyon tak isay "na-qabil-e-taskheer" samjha jata raha, lekin frequency analysis se isay bhi tora ja sakta hai.',
  },
  base64: {
    title: "Base64 Encoding Kya Hai?",
    badge: "Data Encoding",
    desc: "Base64 kisi bhi text ya binary data ko 64 aam characters (A-Z, a-z, 0-9, +, /) mein tabdeel karta hai taake data internet par bina kharab hue safar kar sake.",
    usage:
      "Istemal: Emails mein files bhejne aur web development mein images ya tokens ko text format mein dikhane ke liye.",
  },
  sha256: {
    title: "SHA-256 Hashing Kya Hai?",
    badge: "One-Way Cryptographic Hash",
    desc: 'Hashing encryption se mukhtalif hai kyunke yeh "One-Way" hoti hai—yani hash se wapas asal text nahi banaya ja sakta. Choti si tabdeeli se bhi poora hash badal jata hai (Avalanche Effect).',
    usage:
      "Istemal: Passwords ko database mein mehfooz rakhne, Bitcoin/Blockchain, aur files ki integrity check karne ke liye.",
  },
  aes: {
    title: "AES-GCM (256-bit) Kya Hai?",
    badge: "Military-Grade Encryption",
    desc: "AES (Advanced Encryption Standard) duniya ka sab se zyada istemal hone wala modern encryption algorithm hai. Is mein aapke password se PBKDF2 ke zariye aik mazboot key banayi jati hai aur random IV (Salt) ke sath data lock kiya jata hai.",
    usage:
      "Istemal: WhatsApp chats, Online Banking, Wi-Fi (WPA3), aur Government secrets ko mehfooz rakhne ke liye.",
  },
};

// Initialize on Window Load
window.onload = function () {
  updateCaesarShift(3);
  processCrypto("encrypt");
};

// Switch Tabs Function
function switchTab(tabId) {
  currentTab = tabId;
  hideError();

  // Update Tab Button Styles
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove(
      "active-tab",
      "bg-emerald-500/15",
      "border-emerald-500",
      "text-white",
      "shadow-lg",
      "shadow-emerald-500/10",
    );
    btn.classList.add(
      "bg-cyber-card",
      "border-cyber-border",
      "text-gray-400",
      "hover:text-gray-200",
      "hover:border-gray-600",
    );
  });

  const activeBtn = document.getElementById(`tab-${tabId}`);
  activeBtn.classList.remove(
    "bg-cyber-card",
    "border-cyber-border",
    "text-gray-400",
    "hover:text-gray-200",
    "hover:border-gray-600",
  );
  activeBtn.classList.add(
    "active-tab",
    "bg-emerald-500/15",
    "border-emerald-500",
    "text-white",
    "shadow-lg",
    "shadow-emerald-500/10",
  );

  // Update Guide Box
  const guide = guides[tabId];
  document.getElementById("guide-title").textContent = guide.title;
  document.getElementById("guide-badge").textContent = guide.badge;
  document.getElementById("guide-desc").textContent = guide.desc;
  document.getElementById("guide-usage").innerHTML =
    `<i class="fa-solid fa-circle-info mr-1"></i> ${guide.usage}`;

  // Show/Hide Control Panels
  document
    .querySelectorAll(".ctrl-panel")
    .forEach((panel) => panel.classList.add("hidden"));
  document.getElementById(`ctrl-${tabId}`).classList.remove("hidden");

  // Adjust Action Buttons & Swap based on mode
  const btnEncryptText = document.getElementById("btn-encrypt-text");
  const btnDecrypt = document.getElementById("btn-decrypt");
  const btnSwap = document.getElementById("btn-swap");
  const freqCard = document.getElementById("frequency-card");

  if (tabId === "sha256") {
    btnEncryptText.textContent = "Generate Hash";
    btnDecrypt.classList.add("hidden");
    btnSwap.classList.add("hidden");
    document
      .getElementById("action-buttons")
      .classList.replace("grid-cols-2", "grid-cols-1");
    freqCard.classList.add("hidden");
    generateSHA256();
  } else {
    btnDecrypt.classList.remove("hidden");
    btnSwap.classList.remove("hidden");
    document
      .getElementById("action-buttons")
      .classList.replace("grid-cols-1", "grid-cols-2");

    if (tabId === "base64") {
      btnEncryptText.textContent = "Encode (Base64)";
      document.getElementById("btn-decrypt-text").textContent = "Decode (Text)";
    } else {
      btnEncryptText.textContent = "Encrypt Karein";
      document.getElementById("btn-decrypt-text").textContent =
        "Decrypt Karein";
    }

    // Show Frequency Analysis for Classic Ciphers
    if (tabId === "caesar" || tabId === "vigenere") {
      freqCard.classList.remove("hidden");
    } else {
      freqCard.classList.add("hidden");
    }
    processCrypto("encrypt");
  }
}

// Handle Live Input Typing
function handleInputChange() {
  const text = document.getElementById("input-text").value;
  document.getElementById("char-count").textContent =
    `Characters: ${text.length}`;
  hideError();

  if (currentTab === "sha256") {
    generateSHA256();
  } else if (
    currentTab === "caesar" ||
    currentTab === "vigenere" ||
    currentTab === "base64"
  ) {
    processCrypto("encrypt");
  }
}

// Update Caesar Shift Slider & Preview
function updateCaesarShift(val) {
  const shift = parseInt(val);
  document.getElementById("caesar-shift-val").textContent = shift;

  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let shifted = "";
  for (let i = 0; i < 26; i++) {
    shifted += alpha[(i + shift) % 26] + " ";
  }
  document.getElementById("caesar-preview-map").textContent = shifted.trim();

  if (currentTab === "caesar") {
    processCrypto("encrypt");
  }
}

// Main Process Dispatcher
async function processCrypto(mode) {
  hideError();
  const input = document.getElementById("input-text").value;
  let result = "";

  try {
    if (!input.trim() && currentTab !== "sha256") {
      setOutput("", "Khali input");
      updateFrequencyChart("");
      return;
    }

    if (currentTab === "caesar") {
      const shift = parseInt(document.getElementById("caesar-shift").value);
      result = caesarCipher(input, shift, mode === "decrypt");
      setOutput(
        result,
        mode === "encrypt"
          ? `Encrypted (Shift +${shift})`
          : `Decrypted (Shift -${shift})`,
      );
      updateFrequencyChart(result);
    } else if (currentTab === "vigenere") {
      const key = document
        .getElementById("vigenere-key")
        .value.replace(/[^a-zA-Z]/g, "");
      if (!key) {
        showError(
          "Meherbani karke Vigenère keyword mein kam az kam aik English letter likhein.",
        );
        return;
      }
      result = vigenereCipher(input, key, mode === "decrypt");
      setOutput(
        result,
        mode === "encrypt"
          ? `Encrypted (Key: ${key.toUpperCase()})`
          : `Decrypted (Key: ${key.toUpperCase()})`,
      );
      updateFrequencyChart(result);
    } else if (currentTab === "base64") {
      if (mode === "encrypt") {
        // UTF-8 safe Base64 encoding
        result = btoa(unescape(encodeURIComponent(input)));
        setOutput(result, "Base64 Encoded");
      } else {
        result = decodeURIComponent(escape(atob(input.trim())));
        setOutput(result, "Base64 Decoded");
      }
    } else if (currentTab === "sha256") {
      await generateSHA256();
    } else if (currentTab === "aes") {
      const password = document.getElementById("aes-password").value;
      if (!password) {
        showError(
          "AES encryption/decryption ke liye password likhna zaroori hai.",
        );
        return;
      }
      if (mode === "encrypt") {
        setOutput("Encrypting...", "Processing...");
        result = await aesEncrypt(input, password);
        setOutput(result, "AES-GCM 256-bit Encrypted");
      } else {
        setOutput("Decrypting...", "Processing...");
        result = await aesDecrypt(input.trim(), password);
        setOutput(result, "AES-GCM Decrypted Successfully");
      }
    }
  } catch (err) {
    if (currentTab === "base64") {
      showError("Invalid Base64 string! Yeh sahi Base64 code nahi hai.");
    } else if (currentTab === "aes") {
      showError(
        "Decryption nakam! Ya to password ghalat hai ya encrypted code kharab ho chuka hai.",
      );
    } else {
      showError("Kuch ghalat ho gaya: " + err.message);
    }
    setOutput("", "Error");
  }
}

// 1. Caesar Cipher Algorithm
function caesarCipher(str, shift, decrypt = false) {
  if (decrypt) shift = (26 - shift) % 26;
  return str.replace(/[a-zA-Z]/g, function (char) {
    const base = char <= "Z" ? 65 : 97;
    return String.fromCharCode(
      ((char.charCodeAt(0) - base + shift) % 26) + base,
    );
  });
}

// 2. Vigenère Cipher Algorithm
function vigenereCipher(str, key, decrypt = false) {
  key = key.toUpperCase();
  let keyIndex = 0;
  return str.replace(/[a-zA-Z]/g, function (char) {
    const base = char <= "Z" ? 65 : 97;
    let shift = key.charCodeAt(keyIndex % key.length) - 65;
    if (decrypt) shift = (26 - shift) % 26;
    keyIndex++;
    return String.fromCharCode(
      ((char.charCodeAt(0) - base + shift) % 26) + base,
    );
  });
}

// 3. SHA-256 Hashing using Web Crypto API
async function generateSHA256() {
  const input = document.getElementById("input-text").value;
  const msgBuffer = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  setOutput(hashHex, "SHA-256 Hash (256-bit Hex)");
}

// 4. Modern AES-GCM Encryption using Web Crypto API (PBKDF2 + Salt + IV)
async function aesEncrypt(plainText, password) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Derive key from password
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(plainText),
  );

  // Combine Salt (16B) + IV (12B) + Ciphertext into single Base64 string
  const combined = new Uint8Array(
    salt.length + iv.length + encrypted.byteLength,
  );
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  return btoa(String.fromCharCode(...combined));
}

// 5. Modern AES-GCM Decryption
async function aesDecrypt(base64Cipher, password) {
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const binaryStr = atob(base64Cipher);
  const combined = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    combined[i] = binaryStr.charCodeAt(i);
  }

  if (combined.length < 29) throw new Error("Ciphertext chota hai");

  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const ciphertext = combined.slice(28);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    ciphertext,
  );

  return dec.decode(decrypted);
}

// Frequency Analysis Chart Builder
function updateFrequencyChart(text) {
  const chart = document.getElementById("freq-chart");
  const counts = {};
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let char of alpha) counts[char] = 0;

  let maxCount = 0;
  const upper = text.toUpperCase();
  for (let char of upper) {
    if (counts.hasOwnProperty(char)) {
      counts[char]++;
      if (counts[char] > maxCount) maxCount = counts[char];
    }
  }

  chart.innerHTML = "";
  for (let char of alpha) {
    const count = counts[char];
    const heightPercent =
      maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
    const barWrapper = document.createElement("div");
    barWrapper.className =
      "flex flex-col items-center justify-end h-full flex-1 min-w-[14px] group";
    barWrapper.title = `${char}: ${count} baar`;

    barWrapper.innerHTML = `
                    <div class="w-full bg-gray-800 rounded-t-sm flex items-end h-20 overflow-hidden">
                        <div class="w-full bg-gradient-to-t from-emerald-500 to-cyan-400 transition-all duration-300 rounded-t-sm" style="height: ${heightPercent}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-gray-400 group-hover:text-white mt-1">${char}</span>
                `;
    chart.appendChild(barWrapper);
  }
}

// Password Strength Checker for AES
function checkPasswordStrength(pwd) {
  const bar = document.getElementById("password-strength-bar");
  const label = document.getElementById("password-strength-label");
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (pwd.length === 0) {
    bar.style.width = "0%";
    label.textContent = "Strength: Khali";
    label.className =
      "text-xs font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400";
  } else if (score <= 2) {
    bar.style.width = "30%";
    bar.className = "h-full bg-rose-500 transition-all duration-300";
    label.textContent = "Strength: Kamzor (Weak)";
    label.className =
      "text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300";
  } else if (score <= 4) {
    bar.style.width = "65%";
    bar.className = "h-full bg-amber-500 transition-all duration-300";
    label.textContent = "Strength: Darmiyana (Medium)";
    label.className =
      "text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300";
  } else {
    bar.style.width = "100%";
    bar.className = "h-full bg-emerald-500 transition-all duration-300";
    label.textContent = "Strength: Mazboot (Strong)";
    label.className =
      "text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300";
  }
}

function togglePasswordVisibility() {
  const pwdInput = document.getElementById("aes-password");
  const icon = document.getElementById("eye-icon");
  if (pwdInput.type === "password") {
    pwdInput.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    pwdInput.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

// Helper Functions
function setOutput(text, status) {
  document.getElementById("output-text").value = text;
  document.getElementById("output-status").textContent = status;
  document.getElementById("output-length").textContent =
    `Length: ${text.length}`;
}

function showError(msg) {
  const box = document.getElementById("error-box");
  document.getElementById("error-msg").textContent = msg;
  box.classList.remove("hidden");
}

function hideError() {
  document.getElementById("error-box").classList.add("hidden");
}

function copyOutput() {
  const out = document.getElementById("output-text");
  if (!out.value) return;
  out.select();
  document.execCommand("copy");

  const copyText = document.getElementById("copy-text");
  copyText.textContent = "Copied!";
  setTimeout(() => {
    copyText.textContent = "Copy";
  }, 1500);
}

function swapText() {
  const input = document.getElementById("input-text");
  const output = document.getElementById("output-text");
  if (!output.value) return;
  input.value = output.value;
  document.getElementById("char-count").textContent =
    `Characters: ${input.value.length}`;
  processCrypto("decrypt");
}

function loadSampleText() {
  const samples = [
    "Cyber security mein cryptography ka kirdar sab se ahem hai.",
    "Secret Mission: Raat 12 baje purane pul ke paas milna hai.",
    "Pakistan Zindabad! Digital security seekhna har developer ke liye zaroori hai.",
  ];
  const randomSample = samples[Math.floor(Math.random() * samples.length)];
  document.getElementById("input-text").value = randomSample;
  handleInputChange();
}

function clearAll() {
  document.getElementById("input-text").value = "";
  setOutput("", "Saaf kar diya gaya");
  document.getElementById("char-count").textContent = "Characters: 0";
  hideError();
  updateFrequencyChart("");
}
