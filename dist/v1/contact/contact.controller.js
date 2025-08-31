"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContacts = getContacts;
exports.createContact = createContact;
exports.getContactById = getContactById;
exports.updateContact = updateContact;
exports.deleteContact = deleteContact;
const index_1 = require("../../index");
const statusCodes_1 = require("../../config/statusCodes");
const messages_1 = require("../../config/messages");
async function getContacts(req, res) {
    try {
        const contacts = await index_1.prisma.contact.findMany();
        res.status(statusCodes_1.STATUS_CODES.OK).json({
            status: statusCodes_1.STATUS_CODES.OK,
            message: messages_1.MESSAGES.OK,
            data: contacts,
        });
    }
    catch (error) {
        console.error("Error retrieving contacts:", error);
        res
            .status(statusCodes_1.STATUS_CODES.SERVER_ERROR)
            .json({ error: "Internal server error" });
    }
}
async function createContact(req, res) {
    try {
        const { name, phone, email, address } = req.body;
        if (!name || !email) {
            res
                .status(statusCodes_1.STATUS_CODES.BAD_REQUEST)
                .json({ error: messages_1.MESSAGES.MISSING_FIELDS });
            return;
        }
        const newContact = await index_1.prisma.contact.create({
            data: {
                name,
                email,
                phone,
                address,
            },
        });
        res.status(statusCodes_1.STATUS_CODES.CREATED).json({
            status: statusCodes_1.STATUS_CODES.CREATED,
            message: messages_1.MESSAGES.CONTACT_CREATED,
            data: newContact,
        });
    }
    catch (error) {
        console.error("Error creating contact:", error);
        res
            .status(statusCodes_1.STATUS_CODES.SERVER_ERROR)
            .json({ error: "Internal server error" });
    }
}
async function getContactById(req, res) {
    // Logic to retrieve a contact by ID
    try {
        const { id } = req.params;
        const existing = await index_1.prisma.contact.findUnique({
            where: { id: Number(id) },
        });
        if (!existing) {
            res
                .status(statusCodes_1.STATUS_CODES.NOT_FOUND)
                .json({ error: messages_1.MESSAGES.CONTACT_NOT_FOUND });
            return;
        }
        res.status(statusCodes_1.STATUS_CODES.OK).json({
            status: statusCodes_1.STATUS_CODES.OK,
            message: messages_1.MESSAGES.OK,
            data: existing,
        });
    }
    catch (error) {
        console.error("Error retrieving contact:", error);
        res
            .status(statusCodes_1.STATUS_CODES.SERVER_ERROR)
            .json({ error: "Internal server error" });
    }
}
async function updateContact(req, res) {
    // Logic to update a contact
    try {
        const { id } = req.params;
        const { name, phone, email, address } = req.body;
        const existing = await index_1.prisma.contact.findUnique({
            where: { id: Number(id) },
        });
        if (!existing) {
            res
                .status(statusCodes_1.STATUS_CODES.NOT_FOUND)
                .json({ error: messages_1.MESSAGES.CONTACT_NOT_FOUND });
            return;
        }
        const updatedContact = await index_1.prisma.contact.update({
            where: { id: Number(id) },
            data: {
                name: name ?? existing.name,
                phone: phone ?? existing.phone,
                email: email ?? existing.email,
                address: address ?? existing.address,
            },
        });
        res.status(statusCodes_1.STATUS_CODES.OK).json({
            status: statusCodes_1.STATUS_CODES.OK,
            message: messages_1.MESSAGES.CONTACT_UPDATED,
            data: updatedContact,
        });
    }
    catch (error) {
        console.error("Error updating contact:", error);
        res
            .status(statusCodes_1.STATUS_CODES.SERVER_ERROR)
            .json({ error: "Internal server error" });
    }
}
async function deleteContact(req, res) {
    try {
        const { id } = req.params;
        const existing = await index_1.prisma.contact.findUnique({
            where: { id: Number(id) },
        });
        if (!existing) {
            res
                .status(statusCodes_1.STATUS_CODES.NOT_FOUND)
                .json({ error: messages_1.MESSAGES.CONTACT_NOT_FOUND });
            return;
        }
        await index_1.prisma.contact.delete({
            where: { id: Number(id) },
        });
        res.status(statusCodes_1.STATUS_CODES.OK).json({
            status: statusCodes_1.STATUS_CODES.OK,
            message: messages_1.MESSAGES.CONTACT_DELETED,
        });
    }
    catch (error) {
        console.error("Error deleting contact:", error);
        res
            .status(statusCodes_1.STATUS_CODES.SERVER_ERROR)
            .json({ error: "Internal server error" });
    }
}
