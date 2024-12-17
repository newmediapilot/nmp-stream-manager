const fs = require("fs");
const publicMediaUpdate = (req, res) => {
    try {
        const data = req.body.data;
        const name = req.body.filename;
        if (!data || !name) {
            return res.status(400).json({error: 'Missing file data or filename'});
        }
        fs.writeFileSync(`./src/client/.media/1.mp3`, Buffer.from(data, 'base64'));
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