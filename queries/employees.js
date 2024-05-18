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

const manageEmployees = async () => {
  const answer = await inquirer.prompt({
    message: "What would you like to do?",
    name: "action",
    prefix: "",
    type: "list",
    choices: [
      "Add an employee",
      "View all employees",
      "View employees by manager",
      "View employees by department",
      "Update an employees role",
      "Update an employees manager",
      "Delete an employee",
      "Return to main menu",
    ],
  });
  return answer.action;
};

const addEmployee = async () => {
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
  console.clear();
  console.log(
    `${answers.first_name} ${answers.last_name}`.brightGreen +
      ` has been ` +
      "created".brightGreen +
      ` and given the ` +
      `${answers.role}`.brightGreen +
      `role.`
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
      JOIN departments AS d ON r.department = d.id
      ORDER BY "Department" ASC;`);
  console.clear();
  console.log(employeeASCII);
  console.table(result.rows);
  return "Manage Employees";
};

const updateEmployeeRole = async () => {
  await getEmployees();
  await getRoles();
  const answers = await inquirer.prompt([
    {
      name: "who",
      type: "list",
      prefix: "",
      choices: employeeList,
      message: "Which employee needs updated?",
    },
    {
      name: "role",
      type: "list",
      prefix: "",
      choices: rolesList,
      message: "What role should the employee have?",
    },
  ]);
  await pool.query(
    `
    UPDATE employees
    SET role_id = (SELECT id FROM roles WHERE roles.title = $2)
    WHERE CONCAT(first_name, ' ', last_name, ' #', id) = $1;
    `,
    [answers.who, answers.role]
  );
  console.log(
    `${answers.who}`.brightGreen +
      ` has been ` +
      `given the ` +
      `${answers.role}`.brightGreen +
      ` role.`
  );
  return "Manage Employees";
};

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
    DELETE FROM employees e WHERE CONCAT(e.first_name, ' ', e.last_name, ' #', e.id) = $1;
    `,
    [answers.who]
  );
  console.log(`${answers.who}`.brightRed + ` has been ` + `deleted`.brightRed);
  return "Manage Employees";
};

const viewEmployeesByManager = async () => {
  await getManagers();
  const answers = await inquirer.prompt([
    {
      name: "manager",
      type: "list",
      prefix: "",
      message: "Which manager would you like view?",
      choices: managerList,
    },
  ]);

  const result = await pool.query(
    `
    SELECT 
    e.id, 
    CONCAT(e.first_name, ' ', e.last_name) AS "Name", 
    r.title AS "Title", 
    d.name AS "Department"
    FROM employees AS e 
    JOIN roles AS r ON e.role_id = r.id
    JOIN departments AS d ON r.department = d.id
    WHERE e.manager_id = (SELECT id FROM employees WHERE CONCAT(first_name, ' ', last_name) = $1)
    ORDER BY "Name" ASC;`,
    [answers.manager]
  );
  console.clear();
  console.log(employeeASCII);
  console.table(result.rows);
  return "Manage Employees";
};

const updateEmployeeManager = async () => {
  await getEmployees();
  await getManagers();
  const answers = await inquirer.prompt([
    {
      name: "who",
      type: "list",
      prefix: "",
      choices: employeeList,
      message: "Which employee needs updated?",
    },
    {
      name: "manager",
      type: "list",
      prefix: "",
      choices: managerList,
      message: "What manager should they be under?",
    },
  ]);
  await pool.query(
    `
    UPDATE employees
    SET manager_id = (SELECT id FROM employees e WHERE 
    CONCAT(first_name, ' ', last_name) = $2)
    WHERE CONCAT(first_name, ' ', last_name, ' #', id) = $1;
    `,
    [answers.who, answers.manager]
  );
  console.log(
    `${answers.who}`.brightGreen +
      ` has been assigned to ` +
      `${answers.manager}`.brightGreen
  );
  return "Manage Employees";
};

const viewEmployeesByDepartment = async () => {
  await getDepartments();
  const answers = await inquirer.prompt([
    {
      name: "department",
      type: "list",
      prefix: "",
      message: "Which department would you like view?",
      choices: departmentList,
    },
  ]);

  const result = await pool.query(
    `
    SELECT 
    e.id, 
    CONCAT(e.first_name, ' ', e.last_name) AS "Name", 
    r.title AS "Title", 
    d.name AS "Department"
    FROM employees AS e 
    JOIN roles AS r ON e.role_id = r.id
    JOIN departments AS d ON r.department = d.id
    WHERE d.name = $1
    ORDER BY "Name" ASC;`,
    [answers.department]
  );
  console.clear();
  console.log(employeeASCII);
  console.table(result.rows);
  return "Manage Employees";
};

module.exports = {
  viewEmployees,
  manageEmployees,
  addEmployee,
  updateEmployeeRole,
  deleteEmployee,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
  updateEmployeeManager,
};
