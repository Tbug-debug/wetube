import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    //ffmpeg의 core 파일 오류로 인한 추가작업
    log: true,
  });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");
  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const mp4Url = URL.createObjectURL(mp4Blob);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "My recording.mp4";
  // a 링크에 다운로드 property를 추가였다.
  document.body.appendChild(a);
  a.click();
};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  //여기서는 EventLinstener를 추가,제거 하고 있다.
  recorder = new MediaRecorder(stream);
  //MediaRecorder한테 stream의 정보를 넘겨준다.
  recorder.ondataavailable = (event) => {
    //ondataavailable은 녹화가 멈추면 발생되는 event이다.
    //여기 event는 유저가 video 파일을 다운로드 받을 수 있게끔 도와주는 event이다.
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    // 미리보기를 없앴다.
    video.src = videoFile;
    // 미리보기 대신에 자신이 찍은 영상을 보여주게 만들었다.
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    //마이크나 카메라와 같은 미디어 장비들에 접근을 시켜준다.
    audio: false,
    video: { width: 200, height: 200 },
  });
  video.srcObject = stream;
  //srcObject 라는 곳에다가 stream정보를 저장하고 있다.
  //srcObject는 video가 가질 수 있는 혹은 주는 무엇인가를 의미한다.
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
