require("dotenv").config();
const inquirer = require("inquirer");
const colors = require("colors");
const roles = require("./queries/roles.js");
const dept = require("./queries/deptartments.js");
const emp = require("./queries/employees.js");


//return to this menu after processing questions
async function promptMenu() {
  const answer = await inquirer.prompt({
    message: "What would you like to do?",
    name: "action",
    prefix: "",
    type: "list",
    choices: ["Manage Departments", "Manage Employees", "Manage Roles"],
  });

  handleChoice(answer.action);
}

async function handleChoice(a) {
  if (a === "View all departments") {
    console.clear();
    // console.log(departmentASCII);
    handleChoice(await dept.viewDepartments());
  } else if (a === "View all roles") {
    console.log(rolesASCII);
    handleChoice(await roles.viewRoles());
  } else if (a === "View all employees") {
    handleChoice(await emp.viewEmployees());
  } else if (a === "Add a department") {
    handleChoice(await dept.addDepartment());
  } else if (a === "Add a role") {
    handleChoice(await roles.addRole());
  } else if (a === "Add an employee") {
    handleChoice(await emp.addEmployee());
  } else if (a === "Update an employee role") {
    handleChoice(await emp.updateEmployeeRole());
  } else if (a === "Manage Departments") {
    // console.log(departmentASCII);
    handleChoice(await dept.manageDepartments());
  } else if (a === "Manage Roles") {
    // console.log(rolesASCII);
    handleChoice(await roles.manageRoles());
  } else if (a === "Manage Employees") {
    // console.log(employeeASCII);
    handleChoice(await emp.manageEmployees());
  } else if (a === "Delete a department") {
    handleChoice(await dept.deleteDepartment());
  } else if (a === "Delete a role") {
    handleChoice(await roles.deleteRole());
  } else if (a === "Delete an employee") {
    handleChoice(await emp.deleteEmployee());
  } else if (a === "Return to main menu") {
    console.clear();
    promptMenu();
  }
}




promptMenu();
