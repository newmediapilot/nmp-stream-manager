function setCssVariable(querySelector, type, variableName, suffix = "") {
    const element = document.body.querySelector(querySelector);
    if ('width' === type) document.documentElement.style.setProperty(variableName, element.getBoundingClientRect().width + suffix);
    if ('height' === type) document.documentElement.style.setProperty(variableName, element.getBoundingClientRect().height + suffix);
}
function getCssVariables() {
    return Array.from(document.documentElement.style).filter(key => 123)
}