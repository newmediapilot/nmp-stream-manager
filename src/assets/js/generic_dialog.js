const dialog = document.getElementById('generic-dialog');

function showDialog(title, body) {
    
    const titleElement = document.getElementById('dialog-title');
    const bodyElement = document.getElementById('dialog-body');
    titleElement.innerText = title
    bodyElement.innerText = body;

    dialog.showModal();
}

function closeDialog(id) {
    document.getElementById(id).close();
}

function confirmDialog() {
    closeDialog();
}