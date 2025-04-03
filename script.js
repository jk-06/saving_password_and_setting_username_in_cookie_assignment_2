const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');

// a function to store in the local storage
function store(key, value) {
  localStorage.setItem(key, value);
}

// a function to retrieve from the local storage
function retrieve(key) {
  return localStorage.getItem(key);
}

function getRandomArbitrary(min, max) {
  let cached;
  cached = Math.random() * (max - min) + min;
  cached = Math.floor(cached);
  return cached;
}

// a function to clear the local storage
function clear() {
  localStorage.clear();
}

// a function to generate sha256 hash of the given string
async function sha256(message) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

async function getSHA256Hash() {
  let cached = retrieve('sha256');
  if (cached) {
    return cached;
  }

  cached = await sha256(getRandomArbitrary(MIN, MAX));
  store('sha256', cached);
  return cached;
}

async function main() {
  sha256HashView.innerHTML = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

async function test() {
  const pin = pinInput.value;

  if (pin.length !== 3) {
    resultView.innerHTML = '💡 not 3 digits';
    resultView.classList.remove('hidden');
    return;
  }

  const sha256HashView = document.getElementById('sha256-hash');
  const hasedPin = await sha256(pin);

  if (hasedPin === sha256HashView.innerHTML) {
    resultView.innerHTML = '🎉 success';
    resultView.classList.add('success');
  } else {
    resultView.innerHTML = '❌ failed';
  }
  resultView.classList.remove('hidden');
}

// ensure pinInput only accepts numbers and is 3 digits long
pinInput.addEventListener('input', (e) => {
  const { value } = e.target;
  pinInput.value = value.replace(/\D/g, '').slice(0, 3);
});

// attach the test function to the button
document.getElementById('check').addEventListener('click', test);

async function bruteForceSHA256() {
  const targetHash = document.getElementById('sha256-hash').innerText; 
  if (!targetHash) {
      console.log("No hash found. Make sure the page is loaded.");
      return;
  }

  console.log("🔍 Brute-force started...");

  for (let num = 100; num <= 999; num++) {
      let hash = await sha256(num.toString()); 
      if (hash === targetHash) {
          console.log(`Found the number! It's: ${num}`);
          document.getElementById('result').innerHTML = `The original number is: <b>${num}</b>`;
          document.getElementById('result').classList.remove('hidden');
          return;
      }
  }

  console.log("❌ No match found (which shouldn't happen)");
}


main();

document.getElementById('brute-force').addEventListener('click', bruteForceSHA256);

