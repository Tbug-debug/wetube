const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleted = document.querySelectorAll("#delete__comment");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.addEventListener("click", handleDelete);
  span2.innerText = "❌";
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "" || text.trim() === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      //Express에게 header로 json을 보내고 있다고 알리는 역할을 함.
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const deleteComment = (event) => {
  const li = event.target.parentNode;
  li.remove();
};

const handleDelete = async (event) => {
  const li = event.target.parentNode;
  const commentId = li.dataset.id;
  const response = await fetch(`/api/comment/${commentId}/delete`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    deleteComment(event);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
  deleted.forEach((item) => {
    item.addEventListener("click", handleDelete);
  });
}
