function showDialog(dialogQuerySelector, ...args) {
  const title = args[0];
  const body = args[1];
  document.querySelector("#menu-toggle").checked = false;// Close nav!
  document.querySelector(dialogQuerySelector).querySelector(".dialog--title").innerHTML = title;
  document.querySelector(dialogQuerySelector).querySelector(".dialog--body").innerHTML = body;
  document.querySelector(dialogQuerySelector).showModal();
}

function closeDialog(id) {
  document.querySelector(`#${id}`).close();
}
