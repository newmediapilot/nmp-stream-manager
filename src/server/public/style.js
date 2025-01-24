const DEFAULT_STYLE = "--_feat-tX:50;--_feat-tY:50;--_feat-sX:50;--_feat-sY:50;--_feat-rX:50;--_feat-rY:50;--_feat-rZ:100;--_feat-o:50;--_feat-o:50;--_draw-tX:50;--_draw-tY:50;--_draw-sX:50;--_draw-sY:50;--_draw-rX:50;--_draw-rY:50;--_draw-rZ:100;--_draw-o:200;--_draw-o:200;--_med-tX:50;--_med-tY:50;--_med-sX:50;--_med-sY:50;--_med-rX:50;--_med-rY:50;--_med-rZ:100;--_med-o:50;--_med-o:50";
const fs = require("fs");
const path = require("path");
const {setParam} = require("../store/manager");
const {sendStyle} = require("../public/memory");
const initializePublicStyles = async (type) => {
    console.log("initializePublicStyles :: start");
    try {
        if (!fs.existsSync(path.resolve(`${type}`))) {
            console.log("initializePublicStyles :: new file");
            setParam("public_module_styles", DEFAULT_STYLE);
            fs.writeFileSync(path.resolve(`${type}`), DEFAULT_STYLE, {encoding: "utf-8"});
        } else {
            setParam("public_module_styles", fs.readFileSync(path.resolve(`${type}`), "utf-8"));
            console.log("initializePublicStyles :: load file");
        }
        sendStyle();
        console.log("initializePublicStyles :: success");
        return true;
    } catch (e) {
        console.log("initializePublicStyles :: error", e);
        return false;
    } finally {
        console.log("initializePublicStyles :: done");
    }
};
// TODO: add validation to prevent non-variables from entering
const publicStyleUpdate = (req, res) => {
    try {
        const {type, payload} = req.query;
        console.log("publicStyleUpdate", type, payload);
        if ("style" === type) {
            setParam("public_module_styles", payload);
            sendStyle();
            fs.writeFileSync(path.resolve(`${type}`), payload, {encoding: "utf-8"});
            console.log("publicStyleUpdate :: style", payload);
        }
        res.status(200).json({message: "publicStyleUpdate :: style for " + type + " updated successfully."});
    } catch (error) {
        console.log(
            "Error processing style:",
            error.message,
        );
        res.status(500).json({error: error.message});
    } finally {
        console.log("publicStyleUpdate :: done processing style");
    }
};
module.exports = {initializePublicStyles, publicStyleUpdate};