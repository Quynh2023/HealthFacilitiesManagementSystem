const express = require('express');
const pool = require('./connectMySQL');

const emailLogsApi = express.Router();

emailLogsApi.get("/getAllEmailLogs", async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM emaillog');
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

emailLogsApi.get("/getEmailLogs/:query", async (req, res) => {
  try {
    const query = req.params.query;
    let [result] = await pool.query('SELECT * FROM emaillog WHERE EmailLogID = ?', [query]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

emailLogsApi.post("/addEmailLog", async (req, res) => {
  const { FacilityID, EmployeeID, Date, Subject, Body } = req.body;

  try {
    const [result] = await pool.query('INSERT INTO emaillog (FacilityID, EmployeeID, Date, Subject, Body) VALUES (?, ?, ?, ?, ?)', [FacilityID, EmployeeID, Date, Subject, Body]);

    const newEmailLogId = result.EmailLogID;
    res.status(201).json({ id: newEmailLogId, message: 'EmailLog added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

emailLogsApi.delete("/deleteEmailLog/:id", async(req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM emaillog WHERE EmailLogID = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'EmailLog not found' });
    }

    res.status(200).json({ id: req.params.id, message: 'EmailLog deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

emailLogsApi.patch("/updateEmailLog/:id", async (req, res) => {
  try {
    const [existingEmailLog] = await pool.query('SELECT * FROM emaillog WHERE EmailLogID = ?', [req.params.id]);

    if (existingEmailLog.length === 0) {
      return res.status(404).json({ error: 'EmailLog not found' });
    }

    // Update only the provided fields in the request body
    if (req.body.FacilityID === undefined) {
      req.body.FacilityID = existingEmailLog[0].FacilityID;
    }
    if (req.body.EmployeeID === undefined) {
      req.body.EmployeeID = existingEmailLog[0].EmployeeID;
    }
    if (req.body.Date === undefined) {
      req.body.Date = existingEmailLog[0].Date;
    }
    if (req.body.Subject === undefined) {
      req.body.Subject = existingSchedule[0].Subject;
    }
    if (req.body.Body === undefined) {
      req.body.Body = existingSchedule[0].Body;
    }
    
    const [result] = await pool.query('UPDATE emaillog SET FacilityID=?, EmployeeID=?, Date=?, Subject=?, Body=? WHERE EmailLogID = ?', [
      req.body.FacilityID,
      req.body.EmployeeID,
      req.body.Date,
      req.body.Subject,
      req.body.Body,
      req.params.id
    ]);

    res.status(200).json({ id: req.params.id, message: 'EmailLog updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = emailLogsApi;
