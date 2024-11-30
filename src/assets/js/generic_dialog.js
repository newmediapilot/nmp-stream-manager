function showDialog(id, title, body) {
    const dialog = document.getElementById(id);
    dialog.querySelector('.dialog--title').innerText = title;
    dialog.querySelector('.dialog--body').innerText = body;
    dialog.showModal();
}

function closeDialog(id) {
    document.getElementById(id).close();
}