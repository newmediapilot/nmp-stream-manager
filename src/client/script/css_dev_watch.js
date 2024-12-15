const cssDevWatch = () => {
    const memory = [];
    const changes = [];
    Array.from(document.styleSheets)
        .forEach(sheet => {
            sheet.href && Array.from(sheet.cssRules).forEach(cssRule => memory.push([sheet.href, cssRule.cssText]));
        });
    console.log('cssDevWatch :: inited with ', memory.length);
    Array.from(document.styleSheets)
        .filter(sheet => sheet.href)
        .forEach(sheet => {
            sheet.href && Array.from(sheet.cssRules).forEach((cssRule, index) => {
                const [href, cssText] = [memory[index][0], memory[index][1]];

            });
        });
    // console.log('cssDevWatch :: updated with ', JSON.stringify(memory, null, 4));
};