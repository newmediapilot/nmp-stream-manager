const fs = require("fs");
const path = require("path");
const {setParam} = require("../store/manager");
const initializePublicStyles = async (type) => {
    console.log2(process.cwd(), "initializePublicStyles :: start");
    try {
        if (!fs.existsSync(path.resolve(`.${type}.css`))) {
            console.log2(process.cwd(), "initializePublicStyles :: new file");
            setParam("public_module_styles", ':root{--_no-style:1;}');
            fs.writeFileSync(path.resolve(`.${type}.css`), ':root{--_no-style:1;}', {encoding: "utf-8"});
        } else {
            setParam("public_module_styles",
                fs.readFileSync(path.resolve(`.${type}.css`), "utf-8")
            );
            console.log2(process.cwd(), "initializePublicStyles :: load file");
        }
        console.log2(process.cwd(), "initializePublicStyles :: success");
        return true;
    } catch (e) {
        console.err2(process.cwd(), "initializePublicStyles :: error", e);
        return false;
    } finally {
        console.log2(process.cwd(), "initializePublicStyles :: done");
    }
};
// TODO: add validation to prevent non-variables from entering
const publicStyleUpdate = (req, res) => {
    try {
        const {type, payload} = req.query;
        console.log2(process.cwd(), "publicStyleUpdate", type, payload);
        if ("style" === type) {
            fs.writeFileSync(path.resolve(`.${type}.css`), `:root{${payload};}`, {encoding: "utf-8"});
            setParam("public_module_styles", `:root{${payload};}`);
            console.log2(process.cwd(), "publicStyleUpdate :: style", `:root{${payload};}`);
        }
        res.status(200).json({
            message: "Style for " + type + " updated successfully.",
        });
    } catch (error) {
        console.err2(
            process.cwd(),
            "Error processing style:",
            error.message,
        );
        res.status(500).json({error: error.message});
    } finally {
        console.log2(process.cwd(), "Done processing style");
    }
};
module.exports = {
    initializePublicStyles,
    publicStyleUpdate,
};