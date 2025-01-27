"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRole = exports.createRole = exports.deleteRole = exports.getRole = exports.getRoles = void 0;
const authenticationUtilities_1 = require("../utils/authenticationUtilities");
const db_1 = require("../db");
async function getRoles(req, res) {
    try {
        const roles = await (0, db_1.getroles)();
        return res.status(200).json(roles).end();
    }
    catch (err) {
        res.status(500).json({
            error: err?.message
        });
    }
}
exports.getRoles = getRoles;
async function getRole(req, res) {
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({
            error: "id missing in query"
        }).end();
    }
    try {
        const role = await (0, db_1.getrole)(parseInt(id));
        return res.status(200).json(role).end();
    }
    catch (err) {
        res.status(500).json({
            error: err?.message
        });
    }
}
exports.getRole = getRole;
async function deleteRole(req, res) {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({
                error: "Id missing in query"
            });
        }
        const authHeader = req.headers.authorization;
        const payload = (0, authenticationUtilities_1.getPayloadFromToken)(authHeader);
        const user = await (0, db_1.getUser)(parseInt(payload?.id));
        if (user.length > 0 && user[0].role === 3) {
            await (0, db_1.deleterole)(parseInt(id));
            return res.status(204).json().end();
        }
        return res.status(403).json({
            error: "You are not authorized "
        }).end();
    }
    catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to delete role"
        });
    }
}
exports.deleteRole = deleteRole;
async function createRole(req, res) {
    const { name, description } = req.body;
    const authHeader = req.headers.authorization;
    const payload = (0, authenticationUtilities_1.getPayloadFromToken)(authHeader);
    if (!name || !description) {
        return res.status(400).json({
            error: "Name or description missing in schema"
        }).end();
    }
    try {
        const user = await (0, db_1.getUser)(parseInt(payload?.id));
        if (user.length > 0 && user[0].role === 3) {
            const role = await (0, db_1.createrole)({ name: name, description: description });
            if (!role) {
                return res.status(400).json({
                    error: "failed to add role"
                }).end();
            }
            return res.status(201).json(role).end();
        }
        return res.status(403).json({
            error: "You are not authorized "
        }).end();
    }
    catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to create role"
        }).end();
    }
}
exports.createRole = createRole;
async function updateRole(req, res) {
    const { name, description } = req.body;
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({
            error: "Id missing in query"
        }).end();
    }
    const authHeader = req.headers.authorization;
    const payload = (0, authenticationUtilities_1.getPayloadFromToken)(authHeader);
    try {
        const user = await (0, db_1.getUser)(parseInt(payload?.id));
        if (user.length > 0 && user[0].role === 3) {
            const role = await (0, db_1.updaterole)({ name: name, description: description }, parseInt(id));
            if (!role) {
                return res.status(400).json({
                    error: "failed to update role"
                }).end();
            }
            return res.status(201).json(role).end();
        }
        return res.status(403).json({
            error: "You are not authorized "
        }).end();
    }
    catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to update role"
        }).end();
    }
}
exports.updateRole = updateRole;
//# sourceMappingURL=roles.js.map