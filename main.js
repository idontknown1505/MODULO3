const express = require("express");
const bodyParser = require("body-parser");
const pg = require('pg');

const config = {
  user: 'todos_db_jgwr_user',
  database: 'todos_db_jgwr',
  password: 'DDM7jnKZ4XIfzKjOe5nZNbiwZaC7dvOf',
  host: 'dpg-cf2m9parrk0bppc06ur0-a.oregon-postgres.render.com',
  port: 5432,
  ssl: true,
  idleTimeoutMillis: 30000
}

const client = new pg.Pool(config)

// Modelo
class UsuarioModel {
  constructor() {
    this.usuarios = [];
  }

  async getUsuarios(){
    const res = await client.query('select * from todos;')
    console.log(res);
    return res.rows
  }

  async addUsuario(usuarioText) {
    const query = 'INSERT INTO todos(id, nombre, edad) VALUES($1, $2, $3) RETURNING *';
    const values = [Math.floor(1000 + Math.random() * 9000), usuarioText]
    const res = await client.query(query, values)
    return res;
  }

  editUsuario(index, usuarioText) {
    this.todos[index].text = usuarioText;
  }

  deleteUsuario(index) {
    this.usuarios.splice(index, 1);
  }

  toggleUsuario(index) {
    this.usuarios[index].completed = !this.usuarios[index].completed;
  }
}

// Controlador
class UsuarioController {
  constructor(model) {
    this.model = model;
 
  }
 
async getStatus(){
  return {nameSystem: 'api-rest-nodejs',version: '1.0.0', developer: 'Ivan Chavez Roque', email: 'ichavezroque@gmail.com'}
}

  async getUsuarios() {
   return await this.model.getUsuarios();
  }

  async addUsuario(usuarioText) {
    await this.model.addUsuario(usuarioText);
  }

  editUsuario(index, usuarioText) {
    this.model.editUsuario(index, usuarioText);
  }

  deleteUsuario(index) {
    this.model.deleteUsuario(index);
  }

  toggleUsuario(index) {
    this.model.toggleUsuario(index);
  }
}

// Vistas (Rutas)
const app = express();
const usuarioModel = new UsuarioModel();
const usuarioController = new UsuarioController(usuarioModel);

app.use(bodyParser.json());

app.get("/usuarios",async  (req, res) => {
  const response = await usuarioController.getUsuarios()
  res.json(response)
});

// Vistas (Rutas) (continuación)
app.post("/usuarios", (req, res) => {
  const usuarioText = req.body.text;
  console.log(req.body)
  usuarioController.addUsuario(usuarioText);
  res.sendStatus(200);
});

app.put("/usuarios/:index", (req, res) => {
  const index = req.params.index;
  const usuarioText = req.body.text;
  usuarioController.editUsuario(index, usuarioText);
  res.sendStatus(200);
});

app.delete("/usuarios/:index", (req, res) => {
  const index = req.params.index;
  usuarioController.deleteUsuario(index);
  res.sendStatus(200);
});

app.patch("/usuarios/:index", (req, res) => {
  const index = req.params.index;
  usuarioController.toggleUsuario(index);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
