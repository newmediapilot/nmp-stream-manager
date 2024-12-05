function setupCssVariable(querySelector, type, variableName) {
  const element = document.querySelector(querySelector);
  if('width' === type) document.documentElement.style.setProperty(variableName, element.getBoundingClientRect().width);
  if('height' === type) document.documentElement.style.setProperty(variableName, element.getBoundingClientRect().height);
}