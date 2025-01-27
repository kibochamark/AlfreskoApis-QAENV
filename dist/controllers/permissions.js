"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignpermissiontorole = exports.updatePermission = exports.createPermission = exports.deletePermission = exports.getPermission = void 0;
const authenticationUtilities_1 = require("../utils/authenticationUtilities");
const db_1 = require("../db");
async function getPermission(req, res) {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({
                error: "Id missing in query"
            });
        }
        const permission = await (0, db_1.getpermission)(parseInt(id));
        return res.status(200).json(permission).end();
    }
    catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to create permission"
        });
    }
}
exports.getPermission = getPermission;
async function deletePermission(req, res) {
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
            await (0, db_1.deletepermission)(parseInt(id));
            return res.status(204).json().end();
        }
        return res.status(403).json({
            error: "You are not authorized to perform this action "
        }).end();
    }
    catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to delete permission"
        });
    }
}
exports.deletePermission = deletePermission;
async function createPermission(req, res) {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({
            error: "Name or description missing in schema"
        }).end();
    }
    const authHeader = req.headers.authorization;
    const payload = (0, authenticationUtilities_1.getPayloadFromToken)(authHeader);
    try {
        const user = await (0, db_1.getUser)(parseInt(payload?.id));
        if (user.length > 0 && user[0].role === 3) {
            const permission = await (0, db_1.createpermission)({ name: name, description: description });
            if (!permission) {
                return res.status(400).json({
                    error: "failed to add permission"
                }).end();
            }
            return res.status(201).json(permission).end();
        }
        return res.status(403).json({
            error: "You are not authorized to perform this action "
        }).end();
    }
    catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to create permission"
        }).end();
    }
}
exports.createPermission = createPermission;
async function updatePermission(req, res) {
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
            const permission = await (0, db_1.updatepermission)({ name: name, description: description }, parseInt(id));
            if (!permission) {
                return res.status(400).json({
                    error: "failed to update permission"
                }).end();
            }
            return res.status(201).json(permission).end();
        }
        return res.status(403).json({
            error: "You are not authorized to perform this action "
        }).end();
    }
    catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to update permission"
        }).end();
    }
}
exports.updatePermission = updatePermission;
async function assignpermissiontorole(req, res) {
    const { roleId } = req.params;
    const { permissionIds } = req.body;
    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
        return res.status(400).json({ error: 'permissionIds must be a non-empty array' });
    }
    const authHeader = req.headers.authorization;
    const payload = (0, authenticationUtilities_1.getPayloadFromToken)(authHeader);
    try {
        const user = await (0, db_1.getUser)(parseInt(payload?.id));
        if (user.length > 0 && user[0].role === 3) {
            await (0, db_1.assignPermissionsToRole)(parseInt(roleId), permissionIds);
            res.status(200).json({ message: 'Permissions assigned to role successfully' });
        }
        return res.status(403).json({
            error: "You are not authorized to perform this action "
        }).end();
    }
    catch (error) {
        console.error('Error assigning permissions to role:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.assignpermissiontorole = assignpermissiontorole;
;
//# sourceMappingURL=permissions.js.map