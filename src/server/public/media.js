const fs = require("fs");
const publicMediaUpdate = (req, res) => {
    try {
        const {data, key, type, id} = req.body;
        
        if (!data || !key || !type || !id) {
            return res.status(400).json({error: 'Missing file data or id'});
        }
        fs.writeFileSync(`./src/client/.media/${key}.${type}`, Buffer.from(data, 'base64'));
        res.status(200).json({
            message: "Media updated successfully.",
        });
    } catch (error) {
        console.log("Error processing media:", error.message);
        res.status(500).json({error: error.message});
    } finally {
        console.log("Media processing done.");
    }
};
module.exports = {
    publicMediaUpdate,
};