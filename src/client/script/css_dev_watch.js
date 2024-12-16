const cssDevWatch = () => {
    let memory = [];
    let changes = [];
    let interval = -1;
    cssDevWatch.setMemory = () => {
        memory = [];
        Array.from(document.styleSheets)
            .filter(sheet => sheet.href)
            .sort((a, b) => a.href.length - b.href.length)
            .sort((a, b) => a.href.localeCompare(b.href))
            .forEach(sheet => Array.from(sheet.cssRules).forEach(
                (cssRule) => {
                    memory.push([sheet.href, cssRule.cssText]);
                })
            );
    };
    cssDevWatch.createChanges = () => {
        let index = 0;
        changes = [];
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
                        changes.push([memCssHref, String(cssRule.cssText)]);
                    }
                })
            );
    };
    cssDevWatch.stop = () => {
        clearInterval(interval);
    };
    cssDevWatch.start = () => {
        cssDevWatch.setMemory();
        interval = setInterval(() => cssDevWatch.check(), 1000);
        console.log('cssDevWatch.start ::', interval);
    };
    cssDevWatch.check = () => {
        if (changes.length) {
            console.log('cssDevWatch.start ::changes detected', changes.length);
            changes.forEach(([href, cssText], index) => {
                changes.splice(changes[index].indexOf(changes[index]), 1);
            });
            console.log('cssDevWatch.start ::changes processed');
            cssDevWatch.createChanges();
        } else {
            console.log('cssDevWatch.start ::memory', memory.length);
            cssDevWatch.createChanges();
            cssDevWatch.setMemory();
        }
    };
    cssDevWatch.start();
};