const fs = require("fs");
const publicMediaUpdate = (req, res) => {
    try {
        res.status(200).json({
            message: "Media updated successfully.",
        });
    } catch (error) {
        console.log(
            process.cwd(),
            "Error processing media:",
            error.message,
        );
        res.status(500).json({error: error.message});
    } finally {
        console.log(process.cwd(), "Media processing done.");
    }
};
module.exports = {
    publicMediaUpdate,
};