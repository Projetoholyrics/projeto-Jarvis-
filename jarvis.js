const output = document.getElementById("output");
const input = document.getElementById("commandInput");
const circle = document.getElementById("circle");


// VOZ
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "pt-BR";

function setState(state) {
  circle.className = "circle " + state;
}

// FALAR COM JARVIS
function startListening() {
  setState("listening");
  recognition.start();
}

recognition.onresult = (event) => {
  const command = event.results[0][0].transcript;
  input.value = command;
  processCommand();
};

recognition.onend = () => {
  setState("idle");
};

// PROCESSAR COMANDO
function processCommand() {
  const command = input.value.toLowerCase();
  let response = "Não entendi o comando.";

  if (command.includes("olá") || command.includes("JARVIS TA AI ")) {
    response = "PRO SENHOR SEMPRE.";
  }
  else if (command.includes("que horas são agora?")) {
    response = "Agora são " + new Date().toLocaleTimeString();
  }
  else if (command.includes("que dia é hoje ?")) {
    response = "Hoje é " + new Date().toLocaleDateString();
  }
  else if (command.includes("qual é o seu nome")) {
    response = "Meu nome é JARVIS.";
  }
else if (command.includes("Jarvis, abra o youtube")) {
    response = "Claro Senhor .";
  }

  speak(response);
  input.value = "";
}

// JARVIS FALA
function speak(text) {
  setState("speaking");
  output.innerText = text;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";

  utterance.onend = () => {
    setState("idle");
  };

  speechSynthesis.speak(utterance);
}
async function askIA(message) {
  const response = await fetch("http://localhost:3000/ia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  speak(data.reply);
}
async function askIA(message) {
  setState("speaking");

  const response = await fetch("http://localhost:3000/ia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  speak(data.reply);
}
function processCommand() {
  const command = input.value.toLowerCase();
  let response = "";

  // COMANDOS FIXOS
  if (command.includes("olá") || command.includes("oi")) {
    response = "Olá, Davi. Estou operacional.";
  }

  else if (command.includes("hora")) {
    response = "Agora são " + new Date().toLocaleTimeString();
  }

  else if (command.includes("data")) {
    response = "Hoje é " + new Date().toLocaleDateString();
  }

  else if (command.includes("abrir youtube")) {
    speak("Abrindo o YouTube");
    window.open("https://youtube.com");
    return;
  }

  else if (command.includes("abrir google")) {
    speak("Abrindo o Google");
    window.open("https://google.com");
    return;
  }

  // SE NÃO FOR COMANDO → IA
  else {
    askIA(command);
    input.value = "";
    return;
  }

  speak(response);
  input.value = "";
}
