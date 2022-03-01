const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

const handleStart = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 200, height: 200 },
  });
  video.srcObject = stream;
  //srcObject 라는 곳에다가 stream정보를 저장하고 있다.
  //srcObject는 video가 가질 수 있는 혹은 주는 무엇인가를 의미한다.
  video.play();
};

startBtn.addEventListener("click", handleStart);
