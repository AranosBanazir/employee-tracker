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
    choices: ["Manage Departments", "Manage Employees", "Manage Roles", "Quit"],
  });

  handleChoice(answer.action);
}

//Switchboard function to pass response to correct functions
async function handleChoice(a) {
  if (a === "View all departments") {
    handleChoice(await dept.viewDepartments());
  } else if (a === "View all roles") {
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
    handleChoice(await dept.manageDepartments());
  } else if (a === "Manage Roles") {
    handleChoice(await roles.manageRoles());
  } else if (a === "Manage Employees") {
    handleChoice(await emp.manageEmployees());
  } else if (a === "Delete a department") {
    handleChoice(await dept.deleteDepartment());
  } else if (a === "Delete a role") {
    handleChoice(await roles.deleteRole());
  } else if (a === "Delete an employee") {
    handleChoice(await emp.deleteEmployee());
  } else if (a === "Update an employees role") {
    handleChoice(await emp.updateEmployeeRole());
  } else if (a === "Update an employees manager") {
    handleChoice(await emp.updateEmployeeManager());
  } else if (a === "View employees by manager") {
    handleChoice(await emp.viewEmployeesByManager());
  } else if (a === "View employees by department") {
    handleChoice(await emp.viewEmployeesByDepartment());
  } else if (a === "Return to main menu") {
    console.clear();
    promptMenu();
  } else if (a === "Quit") {
    console.log("Bye bye!".brightGreen);
    process.exit(0);
  }
}

promptMenu();
