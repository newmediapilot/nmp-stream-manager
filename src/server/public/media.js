const fs = require("fs");
const publicMediaUpdate = (req, res) => {
    try {
        const {data, filename} = req.body;
        if (!data || !filename) {
            throw new Error("data missing");
        }
        console.log('data', filename);
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