function showDialog(id, title, body) {
  const dialog = document.getElementById(id);
  document.querySelector("#menu-toggle").checked= false;
  dialog.querySelector(".dialog--title").innerText = title;
  dialog.querySelector(".dialog--body").innerText = body;
  dialog.showModal();
}

function closeDialog(id) {
  document.getElementById(id).close();
}
