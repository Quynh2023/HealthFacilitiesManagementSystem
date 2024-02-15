const express = require('express');
const pool = require('./connectMySQL');

const postalCodesApi = express.Router();

postalCodesApi.get("/getAllPostalCodes", async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM postalcodes');
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

postalCodesApi.get("/getPostalCodes/:query", async (req, res) => {
  try {
    const query = req.params.query;
    let [result] = await pool.query('SELECT * FROM postalcodes WHERE PostalCodeId = ?', [query]);

    if (result.length === 0) {
      [result] = await pool.query('SELECT * FROM postalcodes WHERE PostalCode = ?', [query]);
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

postalCodesApi.post("/addPostalCode", async (req, res) => {
  const { PostalCode, City, Province } = req.body;

  try {
    const [result] = await pool.query('INSERT INTO postalcodes (PostalCode, City, Province) VALUES (?, ?, ?)', [PostalCode, City, Province]);

    const newPostalCodeId = result.postalCodeId;
    res.status(201).json({ id: newPostalCodeId, message: 'Postal code added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

postalCodesApi.delete("/deletePostalCode/:id", async(req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM postalcodes WHERE PostalCodeID = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'PostalCode not found' });
    }

    res.status(200).json({ id: req.params.id, message: 'Postal code deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

postalCodesApi.patch("/updatePostalCode/:id", async (req, res) => {
  try {
    const [existingPostalCode] = await pool.query('SELECT * FROM postalcodes WHERE PostalCodeID = ?', [req.params.id]);

    if (existingPostalCode.length === 0) {
      return res.status(404).json({ error: 'PostalCode not found' });
    }

    // Update only the provided fields in the request body
    if (req.body.PostalCode === undefined) {
      req.body.PostalCode = existingPostalCode[0].PostalCode;
    }

    if (req.body.City === undefined) {
      req.body.City = existingPostalCode[0].City;
    }

    if (req.body.Province === undefined) {
      req.body.Province = existingPostalCode[0].Province;
    }

    const [result] = await pool.query('UPDATE postalcodes SET PostalCode=?, City=?, Province=? WHERE PostalCodeID = ?', [
      req.body.PostalCode,
      req.body.City,
      req.body.Province,
      req.params.id
    ]);

    res.status(200).json({ id: req.params.id, message: 'Postal Code updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = postalCodesApi;
