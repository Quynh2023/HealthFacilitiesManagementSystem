const express = require('express');
const pool = require('./connectMySQL');

const schedulesApi = express.Router();

schedulesApi.get("/getAllSchedules", async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM schedule');
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

schedulesApi.get("/getSchedules/:query", async (req, res) => {
  try {
    const query = req.params.query;
    let [result] = await pool.query('SELECT * FROM schedule WHERE ScheduleID = ?', [query]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

schedulesApi.post("/addSchedule", async (req, res) => {
  const { FacilityID, EmployeeID, Date, StartTime, EndTime } = req.body;

  try {
    const [result] = await pool.query('INSERT INTO schedule (FacilityID, EmployeeID, Date, StartTime, EndTime) VALUES (?, ?, ?, ?, ?)', [FacilityID, EmployeeID, Date, StartTime, EndTime]);

    const newScheduleId = result.ScheduleID;
    res.status(201).json({ id: newScheduleId, message: 'Schedule added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

schedulesApi.delete("/deleteSchedule/:id", async(req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM schedule WHERE ScheduleID = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.status(200).json({ id: req.params.id, message: 'Schedule deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

schedulesApi.patch("/updateSchedule/:id", async (req, res) => {
  try {
    const [existingSchedule] = await pool.query('SELECT * FROM schedule WHERE ScheduleID = ?', [req.params.id]);

    if (existingSchedule.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    // Update only the provided fields in the request body
    if (req.body.FacilityID === undefined) {
      req.body.FacilityID = existingSchedule[0].FacilityID;
    }
    if (req.body.EmployeeID === undefined) {
      req.body.EmployeeID = existingSchedule[0].EmployeeID;
    }
    if (req.body.Date === undefined) {
      req.body.Date = existingSchedule[0].Date;
    }
    if (req.body.StartTime === undefined) {
      req.body.StartTime = existingSchedule[0].StartTime;
    }
    if (req.body.EndTime === undefined) {
      req.body.EndTime = existingSchedule[0].EndTime;
    }
    
    const [result] = await pool.query('UPDATE schedule SET FacilityID=?, EmployeeID=?, Date=?, StartTime=?, EndTime=? WHERE ScheduleID = ?', [
      req.body.FacilityID,
      req.body.EmployeeID,
      req.body.Date,
      req.body.StartTime,
      req.body.EndTime,
      req.params.id
    ]);

    res.status(200).json({ id: req.params.id, message: 'Schedule updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = schedulesApi;
