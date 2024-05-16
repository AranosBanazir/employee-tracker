const inquirer = require("inquirer");
const { Pool } = require("pg");
const colors = require("colors");
const { up } = require("inquirer/lib/utils/readline");
require("dotenv").config();
let departmentList;
let rolesList;
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
    viewDepartments();
  } else if (a.action === "view all roles") {
    viewRoles();
  } else if (a.action === "view all employees") {
    viewEmployees();
  } else if (a.action === "add a department") {
    addDepartment();
  } else if (a.action === "add a role") {
    addRole();
  } else if (a.action === "add an employee") {
    addEmployee();
  } else if (a.action === "update an employee role") {
    updateEmployeeRole();
  }
}

const viewDepartments = async () => {
  const result = await pool.query(
    `SELECT d.id, d.name AS "Department" FROM departments AS d;`
  );
  console.table(result.rows);
  promptMenu();
};

const viewEmployees = async () => {
  const result =
    await pool.query(`Select e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Title", 
  r.salary AS "Salary", d.name AS "Department" FROM employees AS e
  JOIN roles AS r ON e.role_id = r.id
  JOIN departments AS d ON r.id = d.id;`);

  console.table(result.rows);
  promptMenu();
};

const viewRoles = async () => {
  const result =
    await pool.query(`Select r.title AS "Title", d.name AS "Department" FROM roles AS r
    JOIN departments AS d ON r.id = d.id;`);
  console.table(result.rows);
  promptMenu();
};

const addDepartment = async () => {
  inquirer
    .prompt({
      name: "department",
      message: "What is the name of the new department?",
      prefix: "",
      type: "input",
    })
    .then(async (a) => {
      await pool.query(
        `INSERT INTO departments (name)
            VALUES ($1)`,
        [a.department]
      );
      console.log(`Added ${a.department} to the database.`.green);
      promptMenu();
    });
};

const addEmployee = async () => {
  await getRoles();
  inquirer
    .prompt([
      {
        name: "first_name",
        validate: (i) => (i.length > 0 ? true : false),
        message: "What is the employee's first name?",
        prefix: "",
        type: "input",
      },
      {
        name: "last_name",
        validate: (i) => (i.length > 0 ? true : false),
        message: "What is the employee's last name?",
        prefix: "",
        type: "input",
      },
      {
        name: "role",
        message: "What department do they work in?",
        prefix: "",
        type: "list",
        choices: rolesList,
      },
    ])
    .then(async (a) => {
      await pool.query(
        `
      INSERT INTO employees (first_name, last_name, role_id, manager_id)
      VALUES 
      ($1, $2, (SELECT roles.id from roles WHERE roles.title = $3), '1');`,
        [a.first_name, a.last_name, a.role]
      );
      console.log(
        `${a.first_name.brightYellow} ${a.last_name.brightYellow} has been ` +
          "created".brightGreen +
          ` and given the ${a.role.brightYellow} role.`
      );
      promptMenu();
    });
};

const addRole = async () => {};

const updateEmployeeRole = async () => {};

const updateManagers = async () => {};

const deleteDepartment = async () => {};

const deleteRole = async () => {};

const deleteEmployee = async () => {};

const viewEmployeesByManager = async () => {};

const viewEmployeesByDepartment = async () => {};

const getDepartments = async () => {
  const result = await pool.query("SELECT d.name FROM departments AS d;");

  departmentList = result.rows.map((dept) => dept.name);
};

const getRoles = async () => {
  const result = await pool.query("SELECT r.title FROM roles AS r;");

  rolesList = result.rows.map((role) => role.title);
};

promptMenu();

// const result =
// await pool.query(``);
// console.table(result.rows);
// promptMenu();