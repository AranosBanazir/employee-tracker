const pool = require("../db/db.js");
const inquirer = require("inquirer");
const { rolesASCII } = require("../assets/ascii.js");
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

  (rolesList = result.rows.map((role) => role.title)), "None";
};
const getEmployees = async () => {
  const result = await pool.query(
    "SELECT e.first_name, e.last_name, e.id FROM employees AS e;"
  );

  employeeList = result.rows.map(
    (emp) => emp.first_name + " " + emp.last_name + " #" + emp.id
  );
};
const getManagers = async () => {
  const result = await pool.query(
    "SELECT * FROM employees e WHERE e.manager = true;"
  );

  managerList = [
    ...result.rows.map((emp) => emp.first_name + " " + emp.last_name),
    "None",
  ];
};

const manageRoles = async () => {
  const answer = await inquirer.prompt({
    message: "\nWhat would you like to do?",
    name: "action",
    prefix: "",
    type: "list",
    choices: [
      "View all roles",
      "Add a role",
      "Delete a role",
      "Return to main menu",
    ],
  });
  return answer.action;
};

const addRole = async () => {
  await getDepartments();
  const answers = await inquirer.prompt([
    {
      name: "role_name",
      type: "input",
      message: "What is the name of the new role?",
      prefix: "",
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary of the position?",
      validate: (i) => (isNaN(i) ? false : true),
      prefix: "",
    },
    {
      name: "department",
      type: "list",
      message: "What is the department does the role belong to?",
      choices: departmentList,
      prefix: "",
    },
  ]);

  await pool.query(
    `
      INSERT INTO roles (title, salary, department)
          VALUES
              ($1, $2, (SELECT d.id FROM departments AS d WHERE d.name = $3));
     `,
    [answers.role_name, answers.salary, answers.department]
  );

  return "Manage Roles";
};

const deleteRole = async () => {
  await getRoles();
  const answer = await inquirer.prompt({
    message: "Which role would you like to delete?",
    prefix: "",
    type: "list",
    choices: rolesList,
    name: "role",
  });

  await pool.query(
    `
        DELETE FROM roles
          WHERE roles.title = $1;
      `,
    [answer.role]
  );
  console.clear();
  console.log(
    `Deleted the `.brightRed + `'${answer.role}'` + ` role.`.brightRed
  );
  return "Manage Roles";
};

const viewRoles = async () => {
  const result =
    await pool.query(`Select r.title AS "Title", d.name AS "Department" FROM roles AS r
          JOIN departments AS d ON r.department = d.id;`);

  console.clear();
  console.log(rolesASCII);
  console.table(result.rows);
  return "Manage Roles";
  
};

module.exports = {
  manageRoles,
  viewRoles,
  addRole,
  deleteRole,
};
