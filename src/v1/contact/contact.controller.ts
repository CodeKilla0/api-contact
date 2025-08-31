import { NextFunction, Request, Response } from "express";
import { prisma } from "../../index";
import { STATUS_CODES } from "../../config/statusCodes";
import { MESSAGES } from "../../config/messages";

export async function getContacts(req: Request, res: Response): Promise<void> {
  try {
    const contacts = await prisma.contact.findMany();
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: MESSAGES.OK,
      data: contacts,
    });
  } catch (error) {
    console.error("Error retrieving contacts:", error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}

export async function createContact(req: Request, res: Response) {
  try {
    const { name, phone, email, address } = req.body;

    if (!name || !email) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: MESSAGES.MISSING_FIELDS });
      return;
    }

    const newContact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        address,
      },
    });

    res.status(STATUS_CODES.CREATED).json({
      status: STATUS_CODES.CREATED,
      message: MESSAGES.CONTACT_CREATED,
      data: newContact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}

export async function getContactById(req: Request, res: Response) {
  // Logic to retrieve a contact by ID

  try {
    const { id } = req.params;

    const existing = await prisma.contact.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ error: MESSAGES.CONTACT_NOT_FOUND });
      return;
    }

    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: MESSAGES.OK,
      data: existing,
    });
  } catch (error) {
    console.error("Error retrieving contact:", error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}

export async function updateContact(req: Request, res: Response) {
  // Logic to update a contact
  try {
    const { id } = req.params;
    const { name, phone, email, address } = req.body;

    const existing = await prisma.contact.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ error: MESSAGES.CONTACT_NOT_FOUND });
      return;
    }

    const updatedContact = await prisma.contact.update({
      where: { id: Number(id) },
      data: {
        name: name ?? existing.name,
        phone: phone ?? existing.phone,
        email: email ?? existing.email,
        address: address ?? existing.address,
      },
    });

    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: MESSAGES.CONTACT_UPDATED,
      data: updatedContact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}

export async function deleteContact(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const existing = await prisma.contact.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ error: MESSAGES.CONTACT_NOT_FOUND });
      return;
    }

    await prisma.contact.delete({
      where: { id: Number(id) },
    });

    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: MESSAGES.CONTACT_DELETED,
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}
