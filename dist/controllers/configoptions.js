"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateoption = exports.newconfigoption = exports.removeoption = exports.retrieveoption = exports.retrieveconfigoptions = void 0;
const db_1 = require("../db");
const retrieveconfigoptions = async (req, res) => {
    try {
        const retrievedoptions = await (0, db_1.getConfigoptionswithvalues)();
        return res.status(200).json(retrievedoptions).end();
    }
    catch {
        return res.status(500).json({
            error: "something went wrong"
        }).end();
    }
};
exports.retrieveconfigoptions = retrieveconfigoptions;
const retrieveoption = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({
                error: "id misiing in query"
            }).end();
        }
        const retrievedoption = await (0, db_1.getConfigoptionswithvaluesbyproductid)(parseInt(id));
        return res.status(200).json(retrievedoption).end();
    }
    catch {
        return res.status(500).json({
            error: "something went wrong"
        }).end();
    }
};
exports.retrieveoption = retrieveoption;
const removeoption = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({
                error: "id misiing in query"
            }).end();
        }
        await (0, db_1.deleteConfigOption)(parseInt(id));
        return res.status(204).end();
    }
    catch {
        return res.status(500).json({
            error: "something went wrong"
        }).end();
    }
};
exports.removeoption = removeoption;
const newconfigoption = async (req, res) => {
    try {
        const { optionname, product_id } = req.body;
        if (!optionname || !product_id) {
            return res.status(400).json({
                error: "Name or description missing in schema"
            }).end();
        }
        const option = await (0, db_1.createconfigoption)({ option_name: optionname, product_id: parseInt(product_id) });
        if (!option)
            return res.status(400).json({
                error: "failed to create resource"
            }).end();
        return res.status(201).json(option).end();
    }
    catch (error) {
        return res.status(500).json({
            error: error?.message
        }).end();
    }
};
exports.newconfigoption = newconfigoption;
const updateoption = async (req, res) => {
    try {
        const { optionname } = req.body;
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({
                error: "id misiing in query"
            }).end();
        }
        const updatedoption = await (0, db_1.updateconfigoption)({
            option_name: optionname,
        }, parseInt(id));
        if (updatedoption.length <= 0)
            return res.status(400).json({
                error: "failed to update resource or it does not exist"
            }).end();
        return res.status(201).json(updatedoption).end();
    }
    catch {
        return res.status(500).json({
            error: "something went wrong"
        }).end();
    }
};
exports.updateoption = updateoption;
//# sourceMappingURL=configoptions.js.map