const express = require('express');
const pool = require('./connectMySQL');

const employeesApi = express.Router();

employeesApi.get("/getAllEmployees", async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM employees');
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

employeesApi.get("/getEmployees/:query", async (req, res) => {
  try {
    const query = req.params.query;
    let [result] = await pool.query('SELECT * FROM employees WHERE EmployeeID = ?', [query]);
    if (result.length === 0) {
      [result] = await pool.query('SELECT * FROM employees WHERE MedicareNumber = ?', [query]);
    }
    if (result.length === 0) {
      [result] = await pool.query('SELECT * FROM employees WHERE PhoneNumber = ?', [query]);
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

employeesApi.post("/addEmployee", async (req, res) => {
  const { FName, LName, Role, DoBirth, MedicareNumber, Email, Citizenship, PhoneNumber, Address, PostalCodeID } = req.body;

  try {
    const [result] = await pool.query('INSERT INTO employees (FName, LName, Role, DoBirth, MedicareNumber, Email, Citizenship, PhoneNumber, Address, PostalCodeID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [ FName, LName, Role, DoBirth, MedicareNumber, Email, Citizenship, PhoneNumber, Address, PostalCodeID]);

    const newEmployeeId = result.EmployeeID;
    res.status(201).json({ id: newEmployeeId, message: 'Employee added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

employeesApi.delete("/deleteEmployee/:id", async(req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM employees WHERE EmployeeID = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ id: req.params.id, message: 'Employee deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

employeesApi.patch("/updateEmployee/:id", async (req, res) => {
  try {
    const [existingEmployee] = await pool.query('SELECT * FROM employees WHERE EmployeeID = ?', [req.params.id]);

    if (existingEmployee.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Update only the provided fields in the request body
    if (req.body.FName === undefined) {
      req.body.FName = existingEmployee[0].FName;
    }
    if (req.body.LName === undefined) {
      req.body.LName = existingEmployee[0].LName;
    }
    if (req.body.Role === undefined) {
      req.body.Role = existingEmployee[0].Role;
    }
    if (req.body.DoBirth === undefined) {
      req.body.DoBirth = existingEmployee[0].DoBirth;
    }
    if (req.body.MedicareNumber === undefined) {
      req.body.MedicareNumber = existingEmployee[0].MedicareNumber;
    }
    if (req.body.Email === undefined) {
      req.body.Email = existingEmployee[0].Email;
    }
    if (req.body.Citizenship === undefined) {
      req.body.Citizenship = existingEmployee[0].Citizenship;
    }
    if (req.body.PhoneNumber === undefined) {
      req.body.PhoneNumber = existingEmployee[0].PhoneNumber;
    }
    if (req.body.Address === undefined) {
      req.body.Address = existingEmployee[0].Address;
    }
    if (req.body.PostalCodeID === undefined) {
      req.body.PostalCodeID = existingEmployee[0].PostalCodeID;
    }

    
    const [result] = await pool.query('UPDATE employees SET FName=?, LName=?, Role=?, DoBirth=?, MedicareNumber=?, Email=?, Citizenship=?, PhoneNumber=?, Address=?, PostalCodeID=? WHERE EmployeeID = ?', [
      req.body.FName,
      req.body.LName,
      req.body.Role,
      req.body.DoBirth,
      req.body.MedicareNumber,
      req.body.Email,
      req.body.Citizenship,
      req.body.PhoneNumber,
      req.body.Address,
      req.body.PostalCodeID,
      req.params.id
    ]);

    res.status(200).json({ id: req.params.id, message: 'Employee updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = employeesApi;
