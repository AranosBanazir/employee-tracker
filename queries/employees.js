const pool = require("../db/db.js");
const inquirer = require("inquirer");
const { employeeASCII } = require("../assets/ascii.js");
let departmentList;
let rolesList;
let employeeList;
let managerList;

const getDepartments = async () => {
  const result = await pool.query("SELECT d.name FROM departments AS d;");

  departmentList = result.rows.map((dept) => dept.name);
};
const getRoles = async () => {
  const result = await pool.query("SELECT r.title FROM roles AS r;");

  rolesList = result.rows.map((role) => role.title);
};
const getEmployees = async () => {
  const result = await pool.query(
    "SELECT e.first_name, e.last_name FROM employees AS e;"
  );

  employeeList = result.rows.map((emp) => emp.first_name + " " + emp.last_name);
};
const getManagers = async () => {
  const result = await pool.query(
    "SELECT * FROM employees e WHERE e.manager = true;"
  );

  managerList = result.rows.map((emp) => emp.first_name + " " + emp.last_name);
};

const manageEmployees = async () => {
  const answer = await inquirer.prompt({
    message: "What would you like to do?",
    name: "action",
    prefix: "",
    type: "list",
    choices: [
      "View all employees",
      "Add an employee",
      "Delete an employee",
      "Return to main menu",
    ],
  });
  return answer.action;
};

const addEmployee = async () => {
  await getEmployees();
  await getRoles();
  await getManagers();

  const answers = await inquirer.prompt([
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
      message: "What is their role?",
      prefix: "",
      type: "list",
      choices: rolesList,
    },
    {
      name: "manager",
      message: "Who is their manager?",
      prefix: "",
      type: "list",
      choices: managerList,
    },
    {
      name: "isManager",
      message: "Are they a manager?",
      prefix: "",
      type: "confirm",
    },
  ]);

  await pool.query(
    `
        INSERT INTO employees (first_name, last_name, role_id, manager_id, manager)
        VALUES 
        ($1, $2, 
        (SELECT roles.id from roles WHERE roles.title = $3),
        (SELECT e.id from employees AS e WHERE CONCAT(e.first_name, ' ', e.last_name) = $4), $5);`,
    [
      answers.first_name,
      answers.last_name,
      answers.role,
      answers.manager,
      answers.isManager,
    ]
  );
  console.log(
    `${answers.first_name} ${answers.last_name} has been ` +
      "created".brightGreen +
      ` and given the ${answers.role} role.`
  );
  return "Manage Employees";
};

const viewEmployees = async () => {
  const result = await pool.query(`
      SELECT 
      e.id, e.first_name AS "First Name", 
      e.last_name AS "Last Name", r.title AS "Title", 
      r.salary AS "Salary", 
      d.name AS "Department", CONCAT(m.first_name, ' ', m.last_name) AS "Manager" FROM employees AS e
      LEFT JOIN employees AS m ON e.manager_id = m.id
      JOIN roles AS r ON e.role_id = r.id
      JOIN departments AS d ON r.id = d.id;`);
  console.clear();
  console.log(employeeASCII);
  console.table(result.rows);
  return "Manage Employees";
};

const updateEmployeeRole = async () => {};

const deleteEmployee = async () => {
  await getEmployees();
  const answers = await inquirer.prompt([
    {
      name: "who",
      type: "list",
      prefix: "",
      choices: employeeList,
      message: "Who would you like to delete?",
    },
  ]);
  await pool.query(
    `
    DELETE FROM employees e WHERE CONCAT(e.first_name, ' ', e.last_name) = $1;
    `,
    [answers.who]
  );
  console.log(`${answers.who} has been ` + `deleted`.brightRed);
  return "Manage Employees";
};

const viewEmployeesByManager = async () => {};
const updateEmployeeManagers = async () => {};
const viewEmployeesByDepartment = async () => {};

module.exports = {
  viewEmployees,
  manageEmployees,
  addEmployee,
  updateEmployeeRole,
  deleteEmployee,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
  updateEmployeeManagers,
};
