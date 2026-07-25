const express = require("express");
const { createEmergencyContact, getAllEmergencyContacts, updateEmergencyContact, deleteEmergencyContact, getNationalContacts, getAllStates, getDistrictsByState, getStateEmergencyContacts, getDistrictEmergencyContacts, getCategories, searchEmergencyContacts } = require("../controllers/emergency.controller");
const router = express.Router();


//admin
router.post("/", createEmergencyContact);
router.get("/admin", getAllEmergencyContacts);
router.put("/:id", updateEmergencyContact);
router.delete("/:id", deleteEmergencyContact);

// User
router.get("/national", getNationalContacts);
router.get("/states", getAllStates);
router.get("/districts/:stateCode", getDistrictsByState);
router.get("/state/:stateCode", getStateEmergencyContacts);
router.get("/district/:stateCode/:district", getDistrictEmergencyContacts);
router.get("/categories", getCategories);
router.get("/search", searchEmergencyContacts);

module.exports = router;