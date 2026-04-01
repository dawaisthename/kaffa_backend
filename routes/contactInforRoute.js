const express = require("express");
const router = express.Router();
const contactInfoController = require("../controllers/contactInfoController");

// Map HTTP methods to controller functions
router.post("/", contactInfoController.createContact);
router.get("/", contactInfoController.getAllContacts);
router.put("/:id", contactInfoController.updateContact);
router.delete("/:id", contactInfoController.deleteContact);

module.exports = router;
