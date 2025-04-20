const express = require('express');
const cors = require('cors');
const faker = require('faker');

const app = express();
app.use(cors());
app.use(express.json());

const models = {};

app.post('/api/createModel', (req, res) => {
  const { modelName, fields } = req.body;

  // Validate model name
  if (!modelName || !modelName.trim()) {
    return res.status(400).json({ message: 'Model name is required' });
  }

  // Validate fields array
  if (!fields || !fields.length) {
    return res.status(400).json({ message: 'Fields are required' });
  }

  // Validate each field has name and type
  const hasInvalidFields = fields.some(field => !field.name.trim() || !field.type);
  if (hasInvalidFields) {
    return res.status(400).json({ message: 'All fields must have a name and type' });
  }

  models[modelName] = fields;
  res.json({ message: `Model "${modelName}" created successfully!` });
});

app.get('/api/:modelName', (req, res) => {
  const modelName = req.params.modelName;
  const fields = models[modelName];

  if (!fields) {
    return res.status(404).json({ error: 'Model not found' });
  }

  const data = Array.from({ length: 10 }).map(() => {
    const obj = {};
    fields.forEach(field => {
      const fakerPath = field.type.split('.');
      let value = faker;

      try {
        for (const key of fakerPath) {
          if (!value[key]) throw new Error();
          value = value[key];
        }

        obj[field.name] = typeof value === 'function' ? value() : value;
      } catch (error) {
        obj[field.name] = '❌ Invalid faker path';
      }
    });
    return obj;
  });

  res.json(data);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
