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
class TodoModel {
  constructor() {
    this.todos = [];
  }

  async getTodos(){
    const res = await client.query('select * from todos;')
    console.log(res);
    return res.rows
  }

  async addTodo(todoText) {
    const query = 'INSERT INTO todos(id, nombre, edad) VALUES($1, $2, $3) RETURNING *';
    const values = [Math.floor(1000 + Math.random() * 9000), todoText]
    const res = await client.query(query, values)
    return res;
  }

  editTodo(index, todoText) {
    this.todos[index].text = todoText;
  }

  deleteTodo(index) {
    this.todos.splice(index, 1);
  }

  toggleTodo(index) {
    this.todos[index].completed = !this.todos[index].completed;
  }
}

// Controlador
class TodoController {
  constructor(model) {
    this.model = model;
  }

  async getTodos() {
   return await this.model.getTodos();
  }

  async addTodo(todoText) {
    await this.model.addTodo(todoText);
  }

  editTodo(index, todoText) {
    this.model.editTodo(index, todoText);
  }

  deleteTodo(index) {
    this.model.deleteTodo(index);
  }

  toggleTodo(index) {
    this.model.toggleTodo(index);
  }
}

// Vistas (Rutas)
const app = express();
const todoModel = new TodoModel();
const todoController = new TodoController(todoModel);

app.use(bodyParser.json());

app.get("/todos",async  (req, res) => {
  const response = await todoController.getTodos()
  res.json(response)
});

// Vistas (Rutas) (continuación)
app.post("/todos", (req, res) => {
  const todoText = req.body.text;
  console.log(req.body)
  todoController.addTodo(todoText);
  res.sendStatus(200);
});

app.put("/todos/:index", (req, res) => {
  const index = req.params.index;
  const todoText = req.body.text;
  todoController.editTodo(index, todoText);
  res.sendStatus(200);
});

app.delete("/todos/:index", (req, res) => {
  const index = req.params.index;
  todoController.deleteTodo(index);
  res.sendStatus(200);
});

app.patch("/todos/:index", (req, res) => {
  const index = req.params.index;
  todoController.toggleTodo(index);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
