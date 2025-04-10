document.getElementById("visualize-button").addEventListener("click", async () => {
    const file = document.getElementById("audio-file").files[0];
    if (!file) {
      alert("Please upload a WAV file!");
      return;
    }
  
    const arrayBuffer = await file.arrayBuffer();
    const audioCtx = new AudioContext();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  
    visualizeAudio(audioBuffer, file);
  });
  
  function visualizeAudio(audioBuffer, file) {
    const canvas = document.getElementById("waveform");
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
    ctx.fillStyle = "#ff6b6b";
    normalizedData.forEach((value, i) => {
      ctx.fillRect(i, canvas.height - value * canvas.height, 1, value * canvas.height);
    });
  
    // 清除之前的播放按鈕（避免重複生成）
    const playbackControls = document.getElementById("playback-controls");
    playbackControls.innerHTML = '';
  
    // 增加播放按鈕，並確保只出現一次
    const playButton = document.createElement("button");
    playButton.innerText = "Play Audio";
    playButton.classList.add("play-button");
  
    playButton.addEventListener("click", () => {
      const audio = new Audio(URL.createObjectURL(file));
      audio.play();
    });
  
    playbackControls.appendChild(playButton);
  }
  