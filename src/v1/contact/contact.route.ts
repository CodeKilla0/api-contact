import { Router } from "express";
import { createContact, deleteContact, getContactById, getContacts, updateContact } from "./contact.controller";


const router = Router();

router.post("/", createContact);
router.get("/", getContacts);
router.get("/:id", getContactById);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
