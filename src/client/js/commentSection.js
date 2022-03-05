const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "" || text.trim() === "") {
    return;
  }
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      //Express에게 header로 json을 보내고 있다고 알리는 역할을 함.
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
