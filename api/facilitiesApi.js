const express = require('express');
const pool = require('./connectMySQL');

const facilitiesApi = express.Router();

facilitiesApi.get("/getAllFacilities", async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM facilities');
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

facilitiesApi.get("/getFacilities/:query", async (req, res) => {
  try {
    const query = req.params.query;
    let [result] = await pool.query('SELECT * FROM facilities WHERE Name = ?', [query]);
    if (result.length === 0) {
      [result] = await pool.query('SELECT * FROM facilities WHERE FacilityID = ?', [query]);
    }
    if (result.length === 0) {
      [result] = await pool.query('SELECT * FROM facilities WHERE PhoneNumber = ?', [query]);
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

facilitiesApi.post("/addFacility", async (req, res) => {
  const { Name, Type, Capacity, WebAddress, PhoneNumber, Address, PostalCodeID } = req.body;

  try {
    const [result] = await pool.query('INSERT INTO facilities ( Name, Type, Capacity, WebAddress, PhoneNumber, Address, PostalCodeID) VALUES (?, ?, ?, ?, ?, ?, ?)', [ Name, Type, Capacity, WebAddress, PhoneNumber, Address, PostalCodeID]);

    const newFacilityId = result.FacilityID;
    res.status(201).json({ id: newFacilityId, message: 'Facility added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

facilitiesApi.delete("/deleteFacility/:id", async(req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM facilities WHERE FacilityID = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    res.status(200).json({ id: req.params.id, message: 'Facility deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

facilitiesApi.patch("/updateFacility/:id", async (req, res) => {
  try {
    const [existingFacility] = await pool.query('SELECT * FROM facilities WHERE FacilityID = ?', [req.params.id]);

    if (existingFacility.length === 0) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    // Update only the provided fields in the request body
    if (req.body.Name === undefined) {
      req.body.Name = existingFacility[0].Name;
    }

    if (req.body.Type === undefined) {
      req.body.Type = existingFacility[0].Type;
    }

    if (req.body.Capacity === undefined) {
      req.body.Capacity = existingFacility[0].Capacity;
    }

    if (req.body.WebAddress === undefined) {
      req.body.WebAddress = existingFacility[0].WebAddress;
    }

    if (req.body.PhoneNumber === undefined) {
      req.body.PhoneNumber = existingFacility[0].PhoneNumber;
    }

    if (req.body.Address === undefined) {
      req.body.Address = existingFacility[0].Address;
    }

    if (req.body.PostalCodeID === undefined) {
      req.body.PostalCodeID = existingFacility[0].PostalCodeID;
    }

    const [result] = await pool.query('UPDATE facilities SET Name=?, Type=?, Capacity=?, WebAddress=?, PhoneNumber=?, Address=?, PostalCodeID=? WHERE FacilityID = ?', [
      req.body.Name,
      req.body.Type,
      req.body.Capacity,
      req.body.WebAddress,
      req.body.PhoneNumber,
      req.body.Address,
      req.body.PostalCodeID,
      req.params.id
    ]);

    res.status(200).json({ id: req.params.id, message: 'Facility updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = facilitiesApi;
