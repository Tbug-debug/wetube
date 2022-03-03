import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
//ffmpeg는 영상을 변환해서 오디오 파일로 만들거나, 포맷을 변환해 주는 도구이다.
const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);

  actionBtn.innerText = "Transcoding...";

  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    //ffmpeg의 core 파일 오류로 인한 추가작업
    log: true,
  });
  await ffmpeg.load();
  //ffmpeg를 불러오는 작업을 하고 있다.
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  //ffmpeg의 가상 시스템에(녹화한 영상의 정보를 입력하여) recording.webm 파일을 만들고 있다.
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );
  //ffmpeg의 명령어를 실행시키고 있다.

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumFile = ffmpeg.FS("readFile", files.thumb);
  //만들어진 파일을 read하고 있다.
  //만들어진 파일은 Unit8Array의 binary 형태로 만들어진다.

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumBlob = new Blob([thumFile.buffer], { type: "image/jpg" });
  //binary 형태의 data를 주면서 blob(mp4/jpg형태로)을 만들고 있다.

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumUrl = URL.createObjectURL(thumBlob);
  //blob을 가지고 URL을 만들고 있다.

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumUrl, "MyThumbnail.jpg");
  //만들어지 URL을 통해 다운로드를 하고 있다.

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumUrl);
  URL.revokeObjectURL(videoFile);
  //이전에 있던 파일들을 없애고 있다.

  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart);
};

const handleStart = () => {
  actionBtn.innerText = "Recording";
  actionBtn.disabled = true;
  actionBtn.removeEventListener("click", handleStart);
  //여기서는 EventLinstener를 추가,제거 하고 있다.
  recorder = new MediaRecorder(stream);
  //MediaRecorder한테 stream의 정보를 넘겨준다.
  recorder.ondataavailable = (event) => {
    //ondataavailable은 녹화가 멈추면 발생되는 event이다.
    //여기 event는 유저가 video 파일을 다운로드 받을 수 있게끔 도와주는 event이다.
    videoFile = URL.createObjectURL(event.data);
    //녹화를 끝내면 URL이 형성된다.
    video.srcObject = null;
    // 미리보기를 없앴다.
    video.src = videoFile;
    // 미리보기 대신에 자신이 찍은 영상을 보여주게 만들었다.
    video.loop = true;
    video.play();
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    //마이크나 카메라와 같은 미디어 장비들에 접근을 시켜준다.
    audio: false,
    video: {
      width: 1024,
      height: 576,
    },
  });
  video.srcObject = stream;
  //srcObject 라는 곳에다가 stream정보를 저장하고 있다.
  //srcObject는 video가 가질 수 있는 혹은 주는 무엇인가를 의미한다.
  video.play();
};

init();

actionBtn.addEventListener("click", handleStart);
