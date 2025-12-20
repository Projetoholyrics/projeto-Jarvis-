require("./hotword");
const { app, BrowserWindow } = require("electron");

let win;

function criarJanela() {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    show: true
  });

  win.loadFile("public/index.html");
}

app.whenReady().then(criarJanela);

// RECEBE HOTWORD
app.on("jarvis-hotword", () => {
  if (win) {
    win.show();
    win.webContents.send("jarvis-ativar");
  }
});
