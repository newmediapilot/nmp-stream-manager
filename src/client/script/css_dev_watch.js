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
                    memory.push({href: sheet.href, css: String(cssRule.cssText)});
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
                    const {css} = memory[index++];
                    if (String(cssRule.cssText) !== String(css)) {
                        changes[index] = {href: sheet.href, css: String(cssRule.cssText)};
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
            console.log('cssDevWatch.check :: rule changes changes ', changes.length, memory.length);
            let outputCss = '';
            let outputHref = '';
            changes.forEach((change) => {
                outputCss = '\r\n\r\n' + memory.map(a => a.css).join('\r\n') + '\r\n\r\n';
                outputHref = change.href;
            });
            console.log('cssDevWatch.check :: rule changes changes processed on', outputHref);
            axios.get("/api/signal/create", {
                params: {
                    type: "dev:css:write",
                    description: JSON.stringify({href: outputHref, css: outputCss})
                }
            });
            cssDevWatch.createChanges();
            changes = [];
        } else {
            console.log('cssDevWatch.check :: rules in memory', memory.length);
            cssDevWatch.createChanges();
            cssDevWatch.setMemory();
        }
    };
    cssDevWatch.start();
};