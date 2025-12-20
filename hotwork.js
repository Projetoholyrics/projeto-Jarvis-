const vosk = require("vosk");
const mic = require("mic");
const { app } = require("electron");
const path = require("path");

const MODEL_PATH = path.join(__dirname, "models/vosk-pt");

vosk.setLogLevel(0);
const model = new vosk.Model(MODEL_PATH);

const recognizer = new vosk.Recognizer({
  model,
  sampleRate: 16000
});

const micInstance = mic({
  rate: "16000",
  channels: "1",
  debug: false
});

const micInputStream = micInstance.getAudioStream();

micInputStream.on("data", data => {
  if (recognizer.acceptWaveform(data)) {
    const result = recognizer.result().text;
    console.log("🎧 Ouvi:", result);

    if (result.includes("ei jarvis")) {
      console.log("🔥 HOTWORD DETECTADA");
      app.emit("jarvis-hotword");
    }
  }
});

micInputStream.on("error", err => {
  console.error("Erro no microfone:", err);
});

micInstance.start();
console.log("🟢 JARVIS escutando em segundo plano...");
