const express = require('express');
const pool = require('./connectMySQL');

const managersApi = express.Router();

managersApi.get("/getAllManagers", async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM managers');
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

managersApi.get("/getManagers/:query", async (req, res) => {
  try {
    const query = req.params.query;
    let [result] = await pool.query('SELECT * FROM managers WHERE ManagerID = ?', [query]);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

managersApi.post("/addManager", async (req, res) => {
  const { FacilityID, EmployeeID, StartDate, EndDate } = req.body;

  try {
    const [result] = await pool.query('INSERT INTO managers (FacilityID, EmployeeID, StartDate, EndDate) VALUES (?, ?, ?, ?)', [FacilityID, EmployeeID, StartDate, EndDate]);

    const newManagerId = result.ManagerID;
    res.status(201).json({ id: newManagerId, message: 'Manager added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

managersApi.delete("/deleteManager/:id", async(req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM managers WHERE ManagerID = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    res.status(200).json({ id: req.params.id, message: 'Manager deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

managersApi.patch("/updateManager/:id", async (req, res) => {
  try {
    const [existingManager] = await pool.query('SELECT * FROM managers WHERE ManagerID = ?', [req.params.id]);

    if (existingManager.length === 0) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    // Update only the provided fields in the request body
    if (req.body.FacilityID === undefined) {
      req.body.FacilityID = existingManager[0].FacilityID;
    }
    if (req.body.EmployeeID === undefined) {
      req.body.EmployeeID = existingManager[0].EmployeeID;
    }
    if (req.body.StartDate === undefined) {
      req.body.StartDate = existingManager[0].StartDate;
    }
    if (req.body.EndDate === undefined) {
      req.body.EndDate = existingManager[0].EndDate;
    }

    const [result] = await pool.query('UPDATE managers SET FacilityID=?, EmployeeID=?, StartDate=?, EndDate=? WHERE ManagerID = ?', [
      req.body.FacilityID,
      req.body.EmployeeID,
      req.body.StartDate,
      req.body.EndDate,
      req.params.id
    ]);

    res.status(200).json({ id: req.params.id, message: 'Manager updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = managersApi;
