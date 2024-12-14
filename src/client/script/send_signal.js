const sendSignal = (el) => {
    console.log('el', el);
    const dataHref = el.getAttribute("data-href");
    const getRes = axios.get(dataHref);
    getRes.then((getRes) => {
        console.log("sendSignal ::", getRes);
    });
    getRes.catch((error) => {
        console.log("sendSignal :: error:", error.response.data);
    });
    getRes.finally(() => {
        console.info("sendSignal :: complete");
    });
};
