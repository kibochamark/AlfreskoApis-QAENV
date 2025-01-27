"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConfigValueHandler = exports.updateConfigValueHandler = exports.getConfigValueByIdHandler = exports.getConfigValuesHandler = exports.createConfigValueHandler = void 0;
const db_1 = require("../db");
const index_1 = require("../db/index");
const createConfigValueHandler = async (req, res) => {
    try {
        const { option_id, value_name, price_adjustment } = req.body;
        if (!option_id || !value_name || !price_adjustment) {
            return res.status(400).json({
                error: "missing values in schema"
            });
        }
        console.log(option_id, value_name, price_adjustment);
        const option = await (0, index_1.getconfigoptionbyid)(parseInt(option_id));
        console.log(option);
        if (option.length > 0) {
            const newConfigValue = await (0, db_1.createConfigValue)({
                option_id: parseInt(option_id),
                value_name: value_name,
                price_adjustment: price_adjustment
            });
            return res.status(201).json(newConfigValue).end();
        }
        return res.status(404).json({
            error: "option not found"
        }).end();
    }
    catch (error) {
        return res.status(500).json({ error: error?.message }).end();
    }
};
exports.createConfigValueHandler = createConfigValueHandler;
const getConfigValuesHandler = async (req, res) => {
    try {
        const configValues = await (0, db_1.getConfigValues)();
        return res.status(200).json(configValues).end();
    }
    catch (error) {
        return res.status(500).json({ error: error?.message }).end();
    }
};
exports.getConfigValuesHandler = getConfigValuesHandler;
const getConfigValueByIdHandler = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({
                error: "id misiing in query"
            }).end();
        }
        const configValue = await (0, db_1.getConfigValueById)(parseInt(id, 10));
        if (!configValue) {
            return res.status(404).json({ error: "Config value not found" }).end();
        }
        return res.status(200).json(configValue).end();
    }
    catch (error) {
        return res.status(500).json({ error: error?.message }).end();
    }
};
exports.getConfigValueByIdHandler = getConfigValueByIdHandler;
const updateConfigValueHandler = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({
                error: "id misiing in query"
            }).end();
        }
        const updatedValues = req.body;
        const updatedConfigValue = await (0, db_1.updateConfigValue)(parseInt(id, 10), updatedValues);
        if (!updatedConfigValue) {
            return res.status(404).json({ error: "Config value not found" }).end();
        }
        return res.status(201).json(updatedConfigValue).end();
    }
    catch (error) {
        return res.status(500).json({ error: error?.message }).end();
    }
};
exports.updateConfigValueHandler = updateConfigValueHandler;
const deleteConfigValueHandler = async (req, res) => {
    try {
        const id = req.query.id;
        const deleted = await (0, db_1.deleteConfigValue)(parseInt(id, 10));
        if (!deleted) {
            return res.status(404).json({ error: "Config value not found" }).end();
        }
        return res.status(204).end();
    }
    catch (error) {
        return res.status(500).json({ error: error?.message }).end();
    }
};
exports.deleteConfigValueHandler = deleteConfigValueHandler;
//# sourceMappingURL=optionvalues.js.map