const cssDevWatch = () => {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
            console.log('style changed!');
        });
    });
};