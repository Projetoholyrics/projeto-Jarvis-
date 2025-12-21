const output = document.getElementById("output");
const input = document.getElementById("commandInput");
const circle = document.getElementById("circle");
const statusText = document.getElementById("status");


// =======================
// ESTADOS
// =======================
let jarvisAtivo = false;
let modoConversa = false;
let memoria = [];
let estadoJarvis = "neutro";
let protocoloAtivo = false;
let protocoloEtapa = 0;
let humorJarvis = "neutro"; // neutro | irônico | sério
let ultimoComando = "";

// =======================
// MEMÓRIA
// =======================
function salvarMemoria(texto) {
  memoria.push(texto);
  if (memoria.length > 10) memoria.shift();
}

// =======================
// ESTADO VISUAL
// =======================
function setState(state) {
  circle.classList.remove("idle", "listening", "speaking");

  if (state === "idle") {
    circle.classList.add("idle");
    statusText.innerText = "INATIVO";
  }
  if (state === "listening") {
    circle.classList.add("listening");
    statusText.innerText = "OUVINDO";
  }
  if (state === "speaking") {
    circle.classList.add("speaking");
    statusText.innerText = "FALANDO";
  }
}

// =======================
// VOZ
// =======================
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";

  setState("speaking");
  speechSynthesis.speak(utterance);

  utterance.onend = () => setState("idle");
}
function responderComPersonalidade(textoBase) {
  const respostas = {
    neutro: [
      textoBase,
      textoBase + ", senhor."
    ],
    ironico: [
      textoBase + ". Como sempre.",
      textoBase + ". Naturalmente.",
      textoBase + ". Estou impressionado, senhor."
    ],
    serio: [
      textoBase + ". Executando.",
      textoBase + ". Confirmado."
    ]
  };

  const lista = respostas[humorJarvis] || respostas.neutro;
  const respostaFinal = lista[Math.floor(Math.random() * lista.length)];

  speak(respostaFinal);
}
function avaliarHumor(command) {
  if (command.includes("de novo") || command.includes("rápido")) {
    humorJarvis = "ironico";
  } 
  else if (command.includes("urgente") || command.includes("agora")) {
    humorJarvis = "serio";
  } 
  else {
    humorJarvis = "neutro";
  }
}

// =======================
// RECONHECIMENTO
// =======================
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "pt-BR";
recognition.continuous = true;

recognition.onresult = (event) => {
  setState("listening");

  function abrirArquivo(nome) {
  ipcRenderer.send("abrir-arquivo", nome);
}

  const command =
    event.results[event.results.length - 1][0].transcript.toLowerCase();

  input.value = command;

  if (!jarvisAtivo && command.includes("ei jarvis")) {
    jarvisAtivo = true;
    modoConversa = true;
    speak("Sim, senhor. Estou ouvindo.");
    return;
  }

  if (jarvisAtivo) processCommand();
};

recognition.onend = () => recognition.start();
window.onload = () => recognition.start();

// =======================
// COMANDOS
// =======================

function processCommand() {
 
  const command = input.value.toLowerCase();
  if (!command) return;
if (command.includes("ativar protocolo")) {
  iniciarProtocoloJarvis();
  return;
}
if (protocoloAtivo) {
  speak("Protocolo em execução. Aguarde.");
  return;
}

  salvarMemoria(command);

  // -------- SISTEMA --------
  if (command.includes("hora")) {
    speak("Agora são " + new Date().toLocaleTimeString());
  }

  else if (command.includes("dia")) {
    speak("Hoje é " + new Date().toLocaleDateString());
  }
// -------- PESQUISA NA INTERNET --------
else if (
  command.includes("pesquise") ||
  command.includes("pesquisar") ||
  command.includes("buscar") ||
  command.includes("procure")
) {
  let termo = command
    .replace("pesquise", "")
    .replace("pesquisar", "")
    .replace("buscar", "")
    .replace("procure", "")
    .replace("no google", "")
    .trim();

  if (termo.length === 0) {
    speak("O que exatamente devo pesquisar, senhor?");
    return;
  }

  speak("Pesquisando sobre " + termo + ", senhor.");
  window.open(
    "https://www.google.com/search?q=" + encodeURIComponent(termo),
    "_blank"
  );
}
// -------- ABRIR ARQUIVO PELO NOME --------
else if (
  command.includes("abrir arquivo") ||
  command.includes("abrir o arquivo") ||
  command.includes("abrir")
) {
  let nome = command
    .replace("abrir arquivo", "")
    .replace("abrir o arquivo", "")
    .replace("abrir", "")
    .trim();

  if (nome.length === 0) {
    speak("Qual arquivo devo abrir, senhor?");
    return;
  }
ipcRenderer.on("arquivo-nao-encontrado", (event, nome) => {
  speak("Não encontrei nenhum arquivo com o nome " + nome + ", senhor.");
});

  speak("Procurando o arquivo " + nome + ", senhor.");
  abrirArquivo(nome);
}

  else if (command.includes("quem é você")) {
    speak("Sou JARVIS, senhor. Seu assistente pessoal.");
  }

  else if (command.includes("encerrar")) {
    jarvisAtivo = false;
    modoConversa = false;
    speak("Conversa encerrada.");
  }

  // -------- PROGRAMAS --------
  else if (command.includes("abrir bloco de notas")) {
    speak("Abrindo o Bloco de Notas, senhor.");
    executarNoWindows("notepad");
  }

  else if (command.includes("abrir calculadora")) {
    speak("Abrindo a calculadora, senhor.");
    executarNoWindows("calc");
  }

  else if (command.includes("abrir downloads")) {
    speak("Abrindo a pasta Downloads, senhor.");
    executarNoWindows("explorer %USERPROFILE%\\Downloads");
  }

  // -------- INTERNET --------
  else if (command.includes("abrir youtube")) {
    speak("Abrindo o YouTube, senhor.");
    window.open("https://www.youtube.com", "_blank");
  }

  else if (command.includes("abrir google")) {
    speak("Abrindo o Google, senhor.");
    window.open("https://www.google.com", "_blank");
  }
// -------- PESQUISA NO YOUTUBE --------
else if (
  command.includes("youtube") &&
  (
    command.includes("pesquise") ||
    command.includes("pesquisar") ||
    command.includes("buscar") ||
    command.includes("procure")
  )
) {
  let termo = command
    .replace("pesquise", "")
    .replace("pesquisar", "")
    .replace("buscar", "")
    .replace("procure", "")
    .replace("no youtube", "")
    .replace("youtube", "")
    .trim();

  if (termo.length === 0) {
    speak("O que deseja pesquisar no YouTube, senhor?");
    return;
  }

  speak("Pesquisando no YouTube sobre " + termo + ", senhor.");
  window.open(
    "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(termo),
    "_blank"
  );
}

  // -------- FALLBACK --------
  else {
    speak("Comando recebido, senhor.");
  }
}

// =======================
// BOTÕES
// =======================
document.getElementById("btnFalar").onclick = () => {
  recognition.start();
};

document.getElementById("btnExecutar").onclick = () => {
  jarvisAtivo = true;
  processCommand();
};
function iniciarProtocoloJarvis() {
  protocoloAtivo = true;
  protocoloEtapa = 0;

  setState("speaking");
  speak("Iniciando protocolos J.A.R.V.I.S.");

  setTimeout(() => {
    speak("Sistemas online.");
  }, 2500);

  setTimeout(() => {
    speak("Análise de ambiente concluída.");
  }, 5200);

  setTimeout(() => {
    speak("Todos os módulos operacionais.");
  }, 8200);

  setTimeout(() => {
    speak("Às suas ordens, senhor.");
    protocoloAtivo = false;
    jarvisAtivo = true;
    setState("idle");
  }, 11000);
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("Service Worker registrado com sucesso"))
    .catch((err) => console.log("Erro no Service Worker", err));
}
