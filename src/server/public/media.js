const fs = require("fs");
const path = require("path");
const {getParam} = require('../store/manager');
const {configFieldUpdate} = require('./config');
const publicMediaFetch = (req, res, next) => {
    if (
        req.path.startsWith('/media/')
    ) {
        const filePath = `${req.path.split('?')}`
        const mimeType = (()=> {
            switch (path.extname(req.path).toLowerCase()) {
                case '.jpeg': return 'image/jpeg';
                case '.png': return 'image/png';
                case '.gif': return 'image/gif';
                case '.webp': return 'image/webp';
                default: return 'application/octet-stream';
            }
        })();
        res.setHeader('Content-Type', mimeType);
        fs.existsSync(`.${filePath}`) && res.send(fs.readFileSync(`.${filePath}`));
    }
    next();
};
const publicMediaUpdate = (req, res) => {
    try {
        const {data, key, type, id} = req.body;
        if (!data || !key || !type || !id) {
            return res.status(400).json({error: 'Missing file data or id'});
        }
        !fs.existsSync(`./media`) && fs.mkdirSync(`./media`);
        fs.writeFileSync(`./media/${key}.${type}`, Buffer.from(data, 'base64'));
        const cells = getParam("dashboard_signals_config")[id].description.split(',');
        const acceptTypes = cells.slice(2);
        const newCells = `${cells[0]},${cells[1]},${type},${acceptTypes.filter(t => t !== type).join(',')}`;
        configFieldUpdate(id, 'description', newCells);
        console.log("newCells", newCells);
        res.status(200).json({
            message: "publicMediaUpdate :: updated successfully",
        });
    } catch (error) {
        console.log("publicMediaUpdate :: error processing media:", error.message);
        res.status(500).json({error: error.message});
    } finally {
        console.log("publicMediaUpdate :: media processing done");
    }
};
module.exports = {
    publicMediaUpdate,
    publicMediaFetch,
};