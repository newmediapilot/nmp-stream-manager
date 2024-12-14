const generateQrCode = (qrCanvasElement, qrCanvasText) => {
  QRCode.toCanvas(qrCanvasElement, qrCanvasText);
};
