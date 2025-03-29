let recorder;
let audioStream;

document.getElementById('record').onclick = async () => {
  audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  const input = audioContext.createMediaStreamSource(audioStream);
  recorder = new Recorder(input);
  recorder.record();

  document.getElementById('status').innerText = 'Запись...';
};

document.getElementById('stop').onclick = () => {
  recorder.stop();
  audioStream.getAudioTracks()[0].stop();
  recorder.exportWAV(async (blob) => {
    document.getElementById('status').innerText = 'Отправка...';

    const formData = new FormData();
    formData.append('audio', blob);

    const response = await fetch('http://localhost:5000/api/speech', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    document.getElementById('status').innerText = 'Готово!';
    document.getElementById('result').innerText = result.text;
    document.getElementById('translation').innerText = result.translation;
    document.getElementById('audio').src = `data:audio/wav;base64,${result.voice}`;
  });
};
