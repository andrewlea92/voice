let recorder;
let audioChunks = [];

document.getElementById("record").addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = (e) => audioChunks.push(e.data);
  recorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioURL = URL.createObjectURL(audioBlob);
    addRecording(audioURL);
    audioChunks = [];
  };

  recorder.start();
  toggleButtons("recording");
});

document.getElementById("pause").addEventListener("click", () => {
  if (recorder.state === "recording") {
    recorder.pause();
  } else if (recorder.state === "paused") {
    recorder.resume();
  }
});

document.getElementById("stop").addEventListener("click", () => {
  recorder.stop();
  toggleButtons("stopped");
});

function addRecording(audioURL) {
  const list = document.getElementById("audio-list");
  const listItem = document.createElement("li");
  const audioElement = document.createElement("audio");
  audioElement.src = audioURL;
  audioElement.controls = true;
  listItem.appendChild(audioElement);
  list.appendChild(listItem);
}

function toggleButtons(state) {
  const recordButton = document.getElementById("record");
  const pauseButton = document.getElementById("pause");
  const stopButton = document.getElementById("stop");

  if (state === "recording") {
    recordButton.disabled = true;
    pauseButton.disabled = false;
    stopButton.disabled = false;
  } else if (state === "stopped") {
    recordButton.disabled = false;
    pauseButton.disabled = true;
    stopButton.disabled = true;
  }
}
