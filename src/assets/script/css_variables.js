function setCssVariable(querySelector, type, variableName, suffix = "") {
    const element = document.querySelector(querySelector);
    if ('width' === type) document.documentElement.style.setProperty(variableName, element.getBoundingClientRect().width + suffix);
    if ('height' === type) document.documentElement.style.setProperty(variableName, element.getBoundingClientRect().height + suffix);
}