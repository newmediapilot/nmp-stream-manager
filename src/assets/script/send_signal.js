const sendSignal = (el) => {
  const dataHref = el.getAttribute("data-href");
  const initialText = el.innerText;
  const waitSetting = Number(el.getAttribute("data-wait"));
  const waitDefault = 3000;
  const sendingText = el.getAttribute("data-sending");
  const errorText = el.getAttribute("data-error");
  const successText = el.getAttribute("data-success");

  const setState = (label, isDisabled, state) => {
    el.disabled = isDisabled;
    el.setAttribute("data-state", state);
  };

  setState(sendingText, true, "loading");

  const getRes = axios.get(dataHref);

  getRes.then((getRes) => {
    console.log("Success:", getRes);
    setState(successText, true, "success");
  });

  getRes.catch((error) => {
    setState(errorText, true, "error");
    console.log("Error:", error.response.data);
  });

  getRes.finally(() => {
    console.info("Complete.");
    setTimeout(() => {
      setState(initialText, false, "idle");
      el.blur();
    }, waitSetting || waitDefault);
  });
};
