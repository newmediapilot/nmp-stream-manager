const sendSignal = (el) => {
    console.log('el', el);
    const dataHref = el.getAttribute("data-href");
    const getRes = axios.get(dataHref);
    getRes.then((getRes) => {
        console.log("Success:", getRes);
    });
    getRes.catch((error) => {
        console.log("Error:", error.response.data);
    });
    getRes.finally(() => {
        console.info("Complete.");
    });
};
