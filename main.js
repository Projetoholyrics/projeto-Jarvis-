const { app, BrowserWindow } = require("electron");

function criarJanela() {
  const win = new BrowserWindow({
    width: 900,
    height: 700
  });

  win.loadFile("public/index.html");
}

app.whenReady().then(criarJanela);
