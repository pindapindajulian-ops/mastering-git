const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const dbPath = path.join(__dirname, 'db.json');

app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.get(['/employees', '/api/employees'], (req, res) => {
  const db = readDb();
  res.json(db.employees || []);
});

app.post(['/employees', '/api/employees'], (req, res) => {
  const db = readDb();
  const employee = {
    ...req.body,
    id: req.body.id || createId()
  };

  db.employees = [...(db.employees || []), employee];
  writeDb(db);

  res.status(201).json(employee);
});

app.put(['/employees/:id', '/api/employees/:id'], (req, res) => {
  const db = readDb();
  const employees = db.employees || [];
  const index = employees.findIndex((employee) => String(employee.id) === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  const employee = {
    ...employees[index],
    ...req.body,
    id: employees[index].id
  };

  employees[index] = employee;
  db.employees = employees;
  writeDb(db);

  return res.json(employee);
});

app.delete(['/employees/:id', '/api/employees/:id'], (req, res) => {
  const db = readDb();
  const initialLength = (db.employees || []).length;
  db.employees = (db.employees || []).filter((employee) => String(employee.id) !== req.params.id);

  if (db.employees.length === initialLength) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  writeDb(db);
  return res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});

function readDb() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
