const pool = require("../db/db.js");
const inquirer = require("inquirer");
let departmentList;
let rolesList;

const getDepartments = async () => {
  const result = await pool.query("SELECT d.name FROM departments AS d;");

  departmentList = result.rows.map((dept) => dept.name);
};


const addDepartment = async () => {
  const answer = await inquirer.prompt({
    name: "department",
    message: "What is the name of the new department?",
    prefix: "",
    type: "input",
  });
  await pool.query(
    `INSERT INTO departments (name)
                VALUES ($1)`,
    [answer.department]
  );
  console.log(`Added ${answer.department} to the database.`);
  return "Manage Departments";
};

const viewDepartments = async () => {
  const result = await pool.query(
    `SELECT d.id, d.name AS "Department" FROM departments AS d;`
  );

  console.table(result.rows);
  return "Manage Departments";
};

const deleteDepartment = async () => {
  await getDepartments();
  const answer = await inquirer.prompt({
    name: "department",
    type: "list",
    prefix: "",
    choices: departmentList,
    message: "Which department would you like to delete? (",
  });
  await pool.query(
    `
            DELETE FROM departments
              WHERE departments.name = $1;
          `,
    [answer.department]
  );
  console.clear();
  console.log(
    `Deleted the `.brightRed + `'${answer.department}'` + ` role.`.brightRed
  );
  return "Manage Departments";
};

const manageDepartments = async () => {
  const answer = await inquirer.prompt({
    message: "\nWhat would you like to do?",
    name: "action",
    prefix: "",
    type: "list",
    choices: [
      "View all departments",
      "Add a department",
      "Delete a department",
      "Return to main menu",
    ],
  });
  return answer.action;
};

module.exports = {
  viewDepartments,
  addDepartment,
  deleteDepartment,
  manageDepartments,
};
