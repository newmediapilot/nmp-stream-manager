function showDialog(id, ...args) {
  const dialog = document.querySelector(`#${id}`);
  const title = args[0];
  const body = args[1];
  document.querySelector("#menu-toggle").checked = false;
  dialog.querySelector(".dialog--title").innerHTML = title;
  dialog.querySelector(".dialog--body").innerHTML = body;
  dialog.showModal();
}

function closeDialog(id) {
  document.querySelector(`#${id}`).close();
}
