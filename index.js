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

require("dotenv").config();
let departmentList;
let rolesList;

const departmentASCII = `

 ______                                                       
(______)                           _                      _   
 _     _ _____ ____  _____  ____ _| |_ ____  _____ ____ _| |_ 
| |   | | ___ |  _ \\(____ |/ ___|_   _)    \\| ___ |  _ (_   _)
| |__/ /| ____| |_| / ___ | |     | |_| | | | ____| | | || |_ 
|_____/ |_____)  __/\\_____|_|      \\__)_|_|_|_____)_| |_| \\__)
             |_|                                             
      _______                                                
     (_______)                                               
      _  _  _ _____ ____  _____  ____ _____  ____            
     | ||_|| (____ |  _ \\(____ |/ _  | ___ |/ ___)           
     | |   | / ___ | | | / ___ ( (_| | ____| |               
     |_|   |_\\_____|_| |_\\_____|\\___ |_____)_|               
                               (_____|     

`.green;

const rolesASCII = `
 ______       _                      
(_____ \\     | |                     
 _____) )___ | | _____  ___          
|  __  // _ \\| || ___ |/___)         
| |  \\ \\ |_| | || ____|___ |         
|_|   |_\\___/ \\_)_____|___/          
                                    
 _______                                     
(_______)                                    
 _  _  _ _____ ____  _____  ____ _____  ____ 
| ||_|| (____ |  _ \\(____ |/ _  | ___ |/ ___)
| |   | / ___ | | | / ___ ( (_| | ____| |    
|_|   |_\\_____|_| |_\\_____|\\___ |_____)_|    
                 (_____|          
                     
                     `.green;

const employeeASCII = `
         _______             _                         
        (_______)           | |                        
         _____   ____  ____ | | ___  _   _ _____ _____ 
        |  ___) |    \\|  _ \\| |/ _ \\| | | | ___ | ___ |
        | |_____| | | | |_| | | |_| | |_| | ____| ____|
        |_______)_|_|_|  __/ \\_)___/ \\__  |_____)_____)
                    |_|           (____/             
         _______                                     
        (_______)                                    
         _  _  _ _____ ____  _____  ____ _____  ____ 
        | ||_|| (____ |  _ \\(____ |/ _  | ___ |/ ___)
        | |   | / ___ | | | / ___ ( (_| | ____| |    
        |_|   |_\\_____|_| |_\\_____|\\___ |_____)_|  

`.green;

//return to this menu after processing questions
function promptMenu() {
  inquirer
    .prompt({
      message: "What would you like to do?",
      name: "action",
      prefix: "",
      type: "list",
      choices: ["Manage Departments", "Manage Employees", "Manage Roles"],
    })
    .then(handleChoice);
}

function handleChoice(a) {
  if (a.action === "View all departments") {
    viewDepartments();
  } else if (a.action === "View all roles") {
    viewRoles();
  } else if (a.action === "View all employees") {
    viewEmployees();
  } else if (a.action === "Add a department") {
    addDepartment();
  } else if (a.action === "Add a role") {
    addRole();
  } else if (a.action === "Add an employee") {
    addEmployee();
  } else if (a.action === "Update an employee role") {
    updateEmployeeRole();
  } else if (a.action === "Manage Departments") {
    manageDepartments();
  } else if (a.action === "Manage Roles") {
    manageRoles();
  } else if (a.action === "Manage Employees") {
    manageEmployees();
  } else if (a.action === "Delete a department") {
    deleteDepartment();
  } else if (a.action === "Delete a role") {
    deleteRole();
  } else if (a.action === "Delete an employee") {
    deleteEmployee();
  } else if (a.action === "Return to main menu") {
    console.clear();
    promptMenu();
  }
}

const viewDepartments = async () => {
  const result = await pool.query(
    `SELECT d.id, d.name AS "Department" FROM departments AS d;`
  );
  console.log(departmentASCII);
  console.table(result.rows);
  manageDepartments();
};

const addDepartment = () => {
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
      console.log(`Added ${a.department} to the database.`);
      manageDepartments();
    });
};

const deleteDepartment = async () => {
  await getDepartments();
  inquirer.prompt({
    name: "department",
    type: "list",
    prefix: "",
    choices: departmentList,
    message: "Which department would you like to delete? (",
  });
};

const viewEmployees = async () => {
  const result =
    await pool.query(`Select e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Title", 
    r.salary AS "Salary", d.name AS "Department" FROM employees AS e
    JOIN roles AS r ON e.role_id = r.id
    JOIN departments AS d ON r.id = d.id;`);

  console.clear();
  console.log(employeeASCII);
  console.table(result.rows);
  manageEmployees();
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
        `${a.first_name} ${a.last_name} has been ` +
          "created".brightGreen +
          ` and given the ${a.role} role.`
      );
      manageEmployees();
    });
};

const updateEmployeeRole = async () => {};
const deleteEmployee = async () => {};
const viewEmployeesByManager = async () => {};
const updateManagers = async () => {};
const viewEmployeesByDepartment = async () => {};

const viewRoles = async () => {
  const result =
    await pool.query(`Select r.title AS "Title", d.name AS "Department" FROM roles AS r
        JOIN departments AS d ON r.department = d.id;`);
  console.clear();
  console.log(rolesASCII);
  console.table(result.rows);
  manageRoles();
};

const addRole = async () => {
  await getDepartments();
  inquirer
    .prompt([
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
    ])
    .then(async (a) => {
      await pool.query(
        `
        INSERT INTO roles (title, salary, department)
            VALUES
                ($1, $2, (SELECT d.id FROM departments AS d WHERE d.name = $3));
       `,
        [a.role_name, a.salary, a.department]
      );

      // const test = await pool.query(
      //   `
      //           SELECT d.id FROM departments AS d WHERE d.name = $1
      //  `,
      //   [a.department]
      // );

      // console.log(test);

      manageRoles();
    });
};

const deleteRole = async () => {
  await getRoles();
  inquirer
    .prompt({
      message: "Which role would you like to delete?",
      prefix: "",
      type: "list",
      choices: rolesList,
      name: "role",
    })
    .then(async (a) => {
      await pool.query(
        `
          DELETE FROM roles
            WHERE role.title = $1
        `,
        [a.role]
      );
      console.clear();
      console.log(rolesASCII);
      console.log(
        `Deleted the `.brightRed + `'${a.role.white}'` + `role.`.brightRed
      );
      manageRoles();
    });
};

const getDepartments = async () => {
  const result = await pool.query("SELECT d.name FROM departments AS d;");

  departmentList = result.rows.map((dept) => dept.name);
};

const getRoles = async () => {
  const result = await pool.query("SELECT r.title FROM roles AS r;");

  rolesList = result.rows.map((role) => role.title);
};

const manageRoles = async () => {
  inquirer
    .prompt({
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
    })
    .then(handleChoice);
};

const manageDepartments = async () => {
  inquirer
    .prompt({
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
    })
    .then(handleChoice);
};

const manageEmployees = async () => {
  inquirer
    .prompt({
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
    })
    .then(handleChoice);
};

promptMenu();
