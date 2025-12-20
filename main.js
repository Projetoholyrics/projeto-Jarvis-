// =======================
// HOTWORD (EI JARVIS)
// =======================
require("./hotword");

const { app, BrowserWindow, ipcMain } = require("electron");
const { exec } = require("child_process");

let win;

// =======================
// CRIAR JANELA
// =======================
function criarJanela() {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    show: true,
    webPreferences: {
      nodeIntegration: true,     // 🔥 NECESSÁRIO
      contextIsolation: false    // 🔥 NECESSÁRIO
    }
  });

  win.loadFile("public/index.html");
}

app.whenReady().then(criarJanela);

// =======================
// HOTWORD → ATIVA JARVIS
// =======================
app.on("jarvis-hotword", () => {
  if (win) {
    win.show();
    win.webContents.send("jarvis-ativar");
  }
});

// =======================
// EXECUÇÃO DE COMANDOS DO WINDOWS
// =======================
ipcMain.on("executar-comando", (event, comando) => {
  console.log("🖥️ Executando:", comando);

  exec(comando, (error) => {
    if (error) {
      console.error("❌ Erro ao executar comando:", error);
    }
  });
});
const { ipcMain } = require("electron");
const { exec } = require("child_process");

ipcMain.on("executar-comando", (event, comando) => {
  exec(comando);
});
const { ipcMain } = require("electron");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const pastasParaBuscar = [
  process.env.USERPROFILE + "\\Documents",
  process.env.USERPROFILE + "\\Downloads",
  process.env.USERPROFILE + "\\Desktop"
];

ipcMain.on("abrir-arquivo", (event, nomeArquivo) => {
  let encontrado = false;

  for (const pasta of pastasParaBuscar) {
    const arquivos = fs.readdirSync(pasta);

    for (const arquivo of arquivos) {
      if (
        arquivo.toLowerCase().includes(nomeArquivo.toLowerCase())
      ) {
        const caminhoCompleto = path.join(pasta, arquivo);
        exec(`start "" "${caminhoCompleto}"`);
        encontrado = true;
        return;
      }
    }
  }

  if (!encontrado) {
    event.reply("arquivo-nao-encontrado", nomeArquivo);
  }
});
