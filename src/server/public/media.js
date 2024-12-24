const fs = require("fs");
const {getParam} = require('../store/manager');
const {configFieldUpdate} = require('./config');
const publicMediaUpdate = (req, res) => {
    try {
        const {data, key, type, id} = req.body;
        if (!data || !key || !type || !id) {
            return res.status(400).json({error: 'Missing file data or id'});
        }
        !fs.existsSync(`./.media`) && fs.mkdirSync(`./.media`);
        fs.writeFileSync(`./.media/${key}.${type}`, Buffer.from(data, 'base64'));
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
};