// =======================
// ELEMENTOS DA TELA
// =======================
const output = document.getElementById("output");
const input = document.getElementById("commandInput");
const circle = document.getElementById("circle");
let jarvisAtivo = false;
let memoria = [];
let modoConversa = false;

// =======================
// SPEECH RECOGNITION
// =======================
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Seu navegador não suporta reconhecimento de voz.");
}

const recognition = new SpeechRecognition();
recognition.lang = "pt-BR";
recognition.continuous = false;
recognition.interimResults = false;

// =======================
// ESTADO DO CÍRCULO
// =======================
function setState(state) {
  circle.className = "circle " + state;
}
function salvarMemoria(texto) {
  memoria.push(texto);
  if (memoria.length > 10) memoria.shift();
}

// =======================
// BOTÃO FALAR
// =======================
function startListening() {
  try {
    window.speechSynthesis.cancel();
    setState("listening");
    recognition.start();
  } catch (e) {
    console.error("Erro ao iniciar microfone", e);
  }
}
recognition.onresult = (event) => {
  recognition.stop();
recognition.onend = () => {
  iniciarEscutaGlobal();
};

  const command = event.results[0][0].transcript
    .toLowerCase()
    .replace(/[?.!,]/g, "");

  input.value = command;

  // ATIVAÇÃO
  if (!jarvisAtivo && command.includes("ei jarvis")) {
    jarvisAtivo = true;
    modoConversa = true;
    speak("Sim, senhor. Estou ouvindo.");
    return;
  }

  // SE NÃO ESTIVER ATIVO, IGNORA
  if (!jarvisAtivo && !modoConversa) return;

  processCommand();
};


// Depois de executar o comando
jarvisAtivo = false;


// =======================
// FALAR
// =======================
function speak(text) {
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";

  setState("speaking");
  output.innerText = text;

 circle.style.boxShadow = "0 0 40px #00e5ff";

utterance.onend = () => {
  circle.style.boxShadow = "0 0 20px #00e5ff";
  setState("idle");
};

  window.speechSynthesis.speak(utterance);
}

// =======================
// IA
// =======================
async function askIA(message) {
  try {
    const response = await fetch("http://localhost:3000/ia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    speak(data.reply || "Não obtive resposta.");
  } catch (e) {
    speak("Erro ao acessar a inteligência artificial.");
  }
}

function processCommand() {
  if (!input.value) return;

  const command = input.value
    .toLowerCase()
    .replace(/[?.!,]/g, "");

  if (command.includes("jarvis")) {
    speak("Olá, senhor.");
  }

  else if (command.includes("que horas")) {
    speak("Agora são " + new Date().toLocaleTimeString());
  }

  else if (command.includes("que dia é hoje")) {
    speak("Hoje é " + new Date().toLocaleDateString());
  }

  else if (command.includes("seu nome")) {
    speak("Meu nome é JARVIS, uma inteligência artificial criada e programada por Davi Samuel");
  }

  else if (command.includes("abrir youtube")) {
    speak("Abrindo o YouTube.");
    window.open("https://youtube.com");
  }

  else if (command.includes("encerrar conversa")) {
  modoConversa = false;
  jarvisAtivo = false;
  speak("Conversa encerrada.");
  return;
}

  else {
    askIA(command);
  }

  jarvisAtivo = false;
  input.value = "";
}
async function askIA(message) {
  try {
    const response = await fetch("http://localhost:3000/ia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    speak(data.reply);

    salvarMemoria("Usuário: " + message);
    salvarMemoria("JARVIS: " + data.reply);

  } catch (e) {
    speak("Erro ao acessar a inteligência artificial.");
  }
}
function iniciarEscutaGlobal() {
  try {
    recognition.start();
    console.log("🎧 JARVIS escutando...");
  } catch (e) {
    console.log("Reconhecimento já iniciado");
  }
}

window.onload = () => {
  iniciarEscutaGlobal();
};
