const express = require('express');
const pool = require('./connectMySQL');

const infectionsApi = express.Router();

infectionsApi.get("/getAllInfections", async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM infections');
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

infectionsApi.get("/getInfections/:query", async (req, res) => {
  try {
    const query = req.params.query;
    let [result] = await pool.query('SELECT * FROM infections WHERE InfectionID = ?', [query]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

infectionsApi.post("/addInfection", async (req, res) => {
  const { EmployeeID, Type, Date } = req.body;

  try {
    const [result] = await pool.query('INSERT INTO infections (EmployeeID, Type, Date) VALUES (?, ?, ?)', [EmployeeID, Type, Date]);

    const newInfectionId = result.InfectionID;
    res.status(201).json({ id: newInfectionId, message: 'Infection added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

infectionsApi.delete("/deleteInfection/:id", async(req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM infections WHERE InfectionID = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Infection not found' });
    }

    res.status(200).json({ id: req.params.id, message: 'Infection deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

infectionsApi.patch("/updateInfection/:id", async (req, res) => {
  try {
    const [existingInfection] = await pool.query('SELECT * FROM infections WHERE InfectionID = ?', [req.params.id]);

    if (existingInfection.length === 0) {
      return res.status(404).json({ error: 'Infection not found' });
    }

    // Update only the provided fields in the request body
    if (req.body.EmployeeID === undefined) {
      req.body.EmployeeID = existingInfection[0].EmployeeID;
    }
    if (req.body.Type === undefined) {
      req.body.Type = existingInfection[0].Type;
    }
    if (req.body.Date === undefined) {
      req.body.Date = existingInfection[0].Date;
    }

    const [result] = await pool.query('UPDATE infections SET EmployeeID=?, Type=?, Date=? WHERE InfectionID = ?', [
      req.body.EmployeeID,
      req.body.Type,
      req.body.Date,
      req.params.id
    ]);

    res.status(200).json({ id: req.params.id, message: 'Infection updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = infectionsApi;
