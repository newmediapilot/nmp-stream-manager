function showDialog(id, title, body) {
  const dialog = document.querySelector(`#${id}`)
  document.querySelector("#menu-toggle").checked= false;
  dialog.querySelector(".dialog--title").innerHTML = title;
  dialog.querySelector(".dialog--body").innerHTML = body;
  dialog.showModal();
}

function closeDialog(id) {
  document.querySelector(`#${id}`).close();
}
