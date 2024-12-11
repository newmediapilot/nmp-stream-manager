/**
 * When clicked this element will copy the contents of data-clipboard-text into mem
 * @param text
 * @param clickableElement
 */
const generateCopyLink = (clickableElement) => {
  var clipboard = new ClipboardJS(clickableElement);
  clipboard.on('success', function(e) {
    console.log('Text copied: ' + e.text);
  });
  clipboard.on('error', function(e) {
    console.log('Error copying text');
  });
};
