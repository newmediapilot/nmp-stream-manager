/**
 * Generates a QR code in a canvas with the specified ID.
 * @param {string} text - The text to encode in the QR code.
 * @param {string} canvasId - The ID of the canvas element to render the QR code.
 */
const generateQrCode = (text, canvasId) => {
  const qrCanvas = document.getElementById(canvasId);
  if (!qrCanvas) {
    console.error(`Canvas element with ID '${canvasId}' not found.`);
    return;
  }

  QRCode.toCanvas(qrCanvas, text, { width: 200 }, (error) => {
    if (error) {
      console.error("Error generating QR code:", error);
    }
  });
};
