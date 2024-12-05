const fs = require("fs");
const path = require("path");
const {setParam, getParam} = require("../store/manager");

const initializePublicStyles = async (type) => {
    console.log2(process.cwd(), "initializePublicStyles :: start");
    const fileName = path.resolve(`.${type}.css`);
    try {
        if (!fs.existsSync(fileName)) {
            console.log2(process.cwd(), "initializePublicStyles :: new file");
            putStyle(type, ':root {}');
        } else {
            setParam("public_module_styles", getStyle(type));
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

const putStyle = (filePath, styleStringCSS) => {
    const fileName = path.resolve(`.${filePath}.css`);
    console.log2(process.cwd(),
        "putStyle :: file:",
        fileName,
        ":: contents :",
        styleStringCSS,
    );
    fs.writeFileSync(fileName, styleStringCSS);
};

// Load style from a file (synchronous)
const getStyle = (type) => {
    const fileName = path.resolve(`.${filePath}.css`);
    console.log2(process.cwd(), "getStyle :: file:", fileName);
    return JSON.parse(fs.readFileSync(fileName, "utf-8"));
};

const publicStyleUpdate = (req, res) => {
    const {type, payload} = req.query;
    console.log2(process.cwd(),"publicStyleUpdate", type, payload);
    if ("heart" === type) {
        console.log2(process.cwd(),"publicStyleUpdate :: heart");
    }
    try {
    } catch (error) {
        console.err2(
            process.cwd(),
            "Error processing style:",
            error.message,
        );
        res.status(500).json({error: error.message});
    }
};

// Exported methods and styles
module.exports = {
    initializePublicStyles,
    publicStyleUpdate,
};
