"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatecategory = exports.newcategory = exports.removecategory = exports.retrievecategory = exports.retrievecategories = void 0;
const db_1 = require("../db");
const index_1 = require("../db/index");
const retrievecategories = async (req, res) => {
    try {
        const retrievedcategories = await (0, db_1.getCategories)();
        return res.status(200).json(retrievedcategories).end();
    }
    catch {
        return res.status(500).json({
            error: "something went wrong"
        }).end();
    }
};
exports.retrievecategories = retrievecategories;
const retrievecategory = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({
                error: "id misiing in query"
            }).end();
        }
        const retrievedcategory = await (0, db_1.getCategoryById)(parseInt(id));
        return res.status(200).json(retrievedcategory).end();
    }
    catch {
        return res.status(500).json({
            error: "something went wrong"
        }).end();
    }
};
exports.retrievecategory = retrievecategory;
const removecategory = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({
                error: "id misiing in query"
            }).end();
        }
        await (0, index_1.deleteCategory)(parseInt(id));
        return res.status(204).end();
    }
    catch {
        return res.status(500).json({
            error: "something went wrong"
        }).end();
    }
};
exports.removecategory = removecategory;
const newcategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({
                error: "Name or description missing in schema"
            }).end();
        }
        const cat = await (0, db_1.createcategory)({ name: name, description: description });
        if (!cat)
            return res.status(400).json({
                error: "failed to create resource"
            }).end();
        return res.status(201).json(cat).end();
    }
    catch {
        return res.status(500).json({
            error: "something went wrong"
        }).end();
    }
};
exports.newcategory = newcategory;
const updatecategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({
                error: "id misiing in query"
            }).end();
        }
        const updatedcat = await (0, db_1.updateCategory)({ name: name, description: description }, parseInt(id));
        if (!updatedcat)
            return res.status(400).json({
                error: "failed to update resource or it does not exist"
            }).end();
        return res.status(201).json(updatedcat).end();
    }
    catch {
        return res.status(500).json({
            error: "something went wrong"
        }).end();
    }
};
exports.updatecategory = updatecategory;
//# sourceMappingURL=category.js.map