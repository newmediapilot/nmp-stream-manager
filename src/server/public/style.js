const fs = require("fs");
const path = require("path");
const {setParam} = require("../store/manager");
const initializePublicStyles = async (type) => {
    console.log( "initializePublicStyles :: start");
    try {
        if (!fs.existsSync(path.resolve(`${type}`))) {
            console.log( "initializePublicStyles :: new file");
            setParam("public_module_styles", '/*--_empty:1;*/');
            fs.writeFileSync(path.resolve(`${type}`), '/*--_empty:1;*/', {encoding: "utf-8"});
        } else {
            setParam("public_module_styles",
                fs.readFileSync(path.resolve(`${type}`), "utf-8")
            );
            console.log( "initializePublicStyles :: load file");
        }
        console.log( "initializePublicStyles :: success");
        return true;
    } catch (e) {
        console.log( "initializePublicStyles :: error", e);
        return false;
    } finally {
        console.log( "initializePublicStyles :: done");
    }
};
// TODO: add validation to prevent non-variables from entering
const publicStyleUpdate = (req, res) => {
    try {
        const {type, payload} = req.query;
        console.log( "publicStyleUpdate", type, payload);
        if ("style" === type) {
            fs.writeFileSync(path.resolve(`${type}`), payload, {encoding: "utf-8"});
            setParam("public_module_styles", payload);
            console.log( "publicStyleUpdate :: style", payload);
        }
        res.status(200).json({
            message: "Style for " + type + " updated successfully.",
        });
    } catch (error) {
        console.log(
            "Error processing style:",
            error.message,
        );
        res.status(500).json({error: error.message});
    } finally {
        console.log( "Done processing style");
    }
};
module.exports = {initializePublicStyles, publicStyleUpdate};