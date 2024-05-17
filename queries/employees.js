const pool = require("../db/db.js");

const inquirer = require("inquirer");
let departmentList;
let rolesList;

const getDepartments = async () => {
  const result = await pool.query("SELECT d.name FROM departments AS d;");

  departmentList = result.rows.map((dept) => dept.name);
};

const getRoles = async () => {
  const result = await pool.query("SELECT r.title FROM roles AS r;");

  rolesList = result.rows.map((role) => role.title);
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
  await getRoles();
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
      message: "What department do they work in?",
      prefix: "",
      type: "list",
      choices: rolesList,
    },
  ]);
  await pool.query(
    `
        INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES 
        ($1, $2, (SELECT roles.id from roles WHERE roles.title = $3), '1');`,
    [answers.first_name, answers.last_name, answers.role]
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
      d.name AS "Department", 
      CONCAT(m.first_name, ' ', m.last_name) AS "Manager" 
      FROM employees AS e
      FULL JOIN managers AS m ON e.manager_id = m.id
      JOIN roles AS r ON e.role_id = r.id
      JOIN departments AS d ON r.id = d.id;`);

  console.table(result.rows);
  return "Manage Employees";
};

const updateEmployeeRole = async () => {};
const deleteEmployee = async () => {};

module.exports = {
  viewEmployees,
  manageEmployees,
  addEmployee,
  updateEmployeeRole,
  deleteEmployee,
};
