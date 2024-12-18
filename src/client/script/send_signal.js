const sendSignal = (el, href) => {
    const getRes = axios.get(href);
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
