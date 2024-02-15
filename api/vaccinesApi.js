const express = require('express');
const pool = require('./connectMySQL');

const vaccinesApi = express.Router();

vaccinesApi.get("/getAllVaccines", async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM vaccines');
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

vaccinesApi.get("/getVaccines/:query", async (req, res) => {
  try {
    const query = req.params.query;
    let [result] = await pool.query('SELECT * FROM vaccines WHERE VaccineID = ?', [query]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

vaccinesApi.post("/addVaccine", async (req, res) => {
  const { EmployeeID, FacilityID, Type, DoseNumber, Date } = req.body;

  try {
    const [result] = await pool.query('INSERT INTO vaccines (EmployeeID, FacilityID, Type, DoseNumber, Date) VALUES (?, ?, ?, ?, ?)', [EmployeeID, FacilityID, Type, DoseNumber, Date]);

    const newVaccineId = result.VaccineID;
    res.status(201).json({ id: newVaccineId, message: 'Vaccine added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

vaccinesApi.delete("/deleteVaccine/:id", async(req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM vaccines WHERE VaccineID = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vaccine not found' });
    }

    res.status(200).json({ id: req.params.id, message: 'Vaccine deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

vaccinesApi.patch("/updateVaccine/:id", async (req, res) => {
  try {
    const [existingVaccine] = await pool.query('SELECT * FROM vaccines WHERE VaccineID = ?', [req.params.id]);

    if (existingVaccine.length === 0) {
      return res.status(404).json({ error: 'Vaccine not found' });
    }

    // Update only the provided fields in the request body
    if (req.body.EmployeeID === undefined) {
      req.body.EmployeeID = existingVaccine[0].EmployeeID;
    }
    if (req.body.FacilityID === undefined) {
      req.body.FacilityID = existingVaccine[0].FacilityID;
    }
    if (req.body.Type === undefined) {
      req.body.Type = existingVaccine[0].Type;
    }
    if (req.body.DoseNumber === undefined) {
      req.body.DoseNumber = existingVaccine[0].DoseNumber;
    }
    if (req.body.Date === undefined) {
      req.body.Date = existingVaccine[0].Date;
    }
    

    const [result] = await pool.query('UPDATE vaccines SET EmployeeID=?, FacilityID=?, Type=?, DoseNumber=?, Date=? WHERE VaccineID = ?', [
      req.body.EmployeeID,
      req.body.FacilityID,
      req.body.Type,
      req.body.DoseNumber,
      req.body.Date,
      req.params.id
    ]);

    res.status(200).json({ id: req.params.id, message: 'Vaccine updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = vaccinesApi;
