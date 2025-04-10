async function visualizeAudio() {
    const file1 = document.getElementById("audio-file-1").files[0];
    const file2 = document.getElementById("audio-file-2").files[0];
    
    if (!file1 || !file2) {
      alert("Please upload two audio files!");
      return;
    }
  
    const arrayBuffer1 = await file1.arrayBuffer();
    const arrayBuffer2 = await file2.arrayBuffer();
    const audioCtx = new AudioContext();
    const audioBuffer1 = await audioCtx.decodeAudioData(arrayBuffer1);
    const audioBuffer2 = await audioCtx.decodeAudioData(arrayBuffer2);
  
    visualizeSingleAudio(audioBuffer1, file1, "waveform1");
  
    visualizeSingleAudio(audioBuffer2, file2, "waveform2");
  }
  
  function visualizeSingleAudio(audioBuffer, file, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    const rawData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(rawData.length / canvas.width);
    const normalizedData = new Array(canvas.width).fill(0);
  
    for (let i = 0; i < canvas.width; i++) {
      const blockStart = i * blockSize;
      let sum = 0;
  
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[blockStart + j]);
      }
  
      normalizedData[i] = sum / blockSize;
    }
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = canvasId === "waveform1" ? "#ff6b6b" : "#6c5ce7";
    normalizedData.forEach((value, i) => {
      ctx.fillRect(i, canvas.height - value * canvas.height, 1, value * canvas.height);
    });
  
    // Play buttons
    const playbackControls = document.getElementById("playback-controls");
    playbackControls.innerHTML = '';
  
    const playButton = document.createElement("button");
    playButton.innerText = `Play ${canvasId === "waveform1" ? "Audio 1" : "Audio 2"}`;
    playButton.classList.add("play-button");
  
    playButton.addEventListener("click", () => {
      const audio = new Audio(URL.createObjectURL(file));
      audio.play();
    });
  
    playbackControls.appendChild(playButton);
  }
  