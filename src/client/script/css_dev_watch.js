const cssDevWatch = () => {
    let memory = [];
    let changes = [];

    Array.from(document.styleSheets)
        .filter(sheet => sheet.href)
        .sort((a, b) => a.href.length - b.href.length)
        .sort((a, b) => a.href.localeCompare(b.href))
        .forEach(sheet => Array.from(sheet.cssRules).forEach(
            (cssRule) => {
                memory.push([sheet.href, cssRule.cssText]);
            })
        );
    cssDevWatch.save = () => {
        let index = 0;
        Array.from(document.styleSheets)
            .filter(sheet => sheet.href)
            .sort((a, b) => a.href.length - b.href.length)
            .sort((a, b) => a.href.localeCompare(b.href))
            .forEach(sheet => Array.from(sheet.cssRules).forEach(
                (cssRule) => {
                    const memCache = memory[index++];
                    const memCssHref = memCache[0];
                    const memCssText = memCache[1];
                    if (String(cssRule.cssText) !== String(memCssText)) {
                        console.log('memCache', memCssHref, String(cssRule.cssText), String(memCssText));
                    }
                })
            );
    }
};