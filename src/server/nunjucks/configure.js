const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");
const express = require("express");
const {getParam, getAllParams} = require("../store/manager");
const configureNunjucks = (app) => {
    console.log('configure.process.pkg', process.pkg);
    console.log('configure.__dirname', __dirname);
    console.log('configure.process.execPath', process.execPath);
    const templatesPath = process.pkg ? process.pkg.entrypoint.split("\\").slice(0,-1).join("\\") + "\\src\\templates" : "templates";
    console.log('configure.templatesPath', templatesPath);
    const nunjucksEnv = nunjucks.configure(templatesPath, {
        autoescape: true,
        express: app,
        noCache: true,
    });
    nunjucksEnv.addFilter("getParam", getParam);
    nunjucksEnv.addFilter("getAllParams", getAllParams);
    nunjucksEnv.addFilter("inlineScriptContents", (scriptTagContents) => {
        let inputContents = String(scriptTagContents);
        if (inputContents.includes('client/script')) {
            const filename = inputContents.split('<script src="../')[1].split('?')[0];
            const contents = fs.readFileSync(`./src/${filename}`, {encoding: 'utf-8'});
            return `<script type="text/javascript" defer>${contents}</script>`;
        }
        if (inputContents.includes('client/style')) {
            const filename = inputContents.split('<link href="../')[1].split('?')[0];
            const contents = fs.readFileSync(`./src/${filename}`, {encoding: 'utf-8'});
            return `<style>${contents}</style>`;
        }
        return `<!-- inlineScriptContents -->${scriptTagContents}<!-- inlineScriptContents -->`;
    });
    nunjucksEnv.addFilter("cacheBuster", () => new Date().getTime());
    app.set("view engine", "html");
    app.use(express.static("src/client"));
};
module.exports = {configureNunjucks};
