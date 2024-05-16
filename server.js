const inquirer = require("inquirer");
const { Pool } = require("pg");
const colors = require("colors");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_host,
  database: process.env.DB_NAME,
});

//return to this menu after processing questions
async function promptMenu() {
  inquirer
    .prompt({
      message: "What would you like to do?",
      name: "action",
      prefix: "",
      type: "list",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee role",
      ],
    })
    .then(handleChoice);
}

function handleChoice(a) {
  if (a.action === "view all departments") {
  } else if (a.action === "view all roles") {
  } else if (a.action === "view all employees") {
  } else if (a.action === "add a department") {
  } else if (a.action === "add a role") {
  } else if (a.action === "add an employee") {
  } else if (a.action === "update an employee role") {
  }
}

const viewDepartments = async () => {
  const result = await pool.query("SELECT * FROM department;");
  console.table(result);
};

const viewEmployees = async () => {};

const viewRows = async () => {};

const addDepartment = async (name) => {};

const addEmployee = async (name) => {};

const addRole = async (name) => {};

const updateEmployeeRole = async (name, role) => {};

promptMenu();
