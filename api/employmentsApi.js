const express = require('express');
const pool = require('./connectMySQL');

const employmentsApi = express.Router();

employmentsApi.get("/getAllEmployments", async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM employment');
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

employmentsApi.get("/getEmployments/:query", async (req, res) => {
  try {
    const query = req.params.query;
    let [result] = await pool.query('SELECT * FROM employment WHERE EmploymentID = ?', [query]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

employmentsApi.post("/addEmployment", async (req, res) => {
  const { FacilityID, EmployeeID, ContractID, StartDate, EndDate } = req.body;

  try {
    const [result] = await pool.query('INSERT INTO employment (FacilityID, EmployeeID, ContractID, StartDate, EndDate) VALUES (?, ?, ?, ?, ?)', [FacilityID, EmployeeID, ContractID, StartDate, EndDate]);

    const newContractId = result.ContractID;
    res.status(201).json({ id: newContractId, message: 'Employment added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

employmentsApi.delete("/deleteEmployment/:id", async(req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM employment WHERE EmploymentID = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employment not found' });
    }

    res.status(200).json({ id: req.params.id, message: 'Employment deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

employmentsApi.patch("/updateEmployment/:id", async (req, res) => {
  try {
    const [existingEmployment] = await pool.query('SELECT * FROM employment WHERE EmploymentID = ?', [req.params.id]);

    if (existingEmployment.length === 0) {
      return res.status(404).json({ error: 'Employment not found' });
    }

    // Update only the provided fields in the request body
    if (req.body.FacilityID === undefined) {
      req.body.FacilityID = existingEmployment[0].FacilityID;
    }
    if (req.body.EmployeeID === undefined) {
      req.body.EmployeeID = existingEmployment[0].EmployeeID;
    }
    if (req.body.ContractID === undefined) {
      req.body.ContractID = existingEmployment[0].ContractID;
    }
    if (req.body.StartDate === undefined) {
      req.body.StartDate = existingEmployment[0].StartDate;
    }
    if (req.body.EndDate === undefined) {
      req.body.EndDate = existingEmployment[0].EndDate;
    }

    const [result] = await pool.query('UPDATE employment SET FacilityID=?, EmployeeID=?, ContractID=?, StartDate=?, EndDate=? WHERE EmploymentID = ?', [
      req.body.FacilityID,
      req.body.EmployeeID,
      req.body.ContractID,
      req.body.StartDate,
      req.body.EndDate,
      req.params.id
    ]);

    res.status(200).json({ id: req.params.id, message: 'Employment updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = employmentsApi;
