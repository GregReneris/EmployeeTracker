const mysql = require('mysql');
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "employee_db"
});


connection.asyncQuery = function( sql, args ) {
    return new Promise( ( resolve, reject ) => {
        this.query( sql, args, ( err, rows ) => {
            if ( err )
                return reject( err );
            resolve( rows );
        } );
    } );
}


connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    begin();
});

function begin() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Find Employee",
          "Add Employee",
          "Update Employee Role",
          "View Departments",
          "Find Department",
          "Add Department",
          "View all Roles",
          "Find Roles",
          "Add a Role",
          "Exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "Find Employee":
          employeeSearch();
          break;

        case "Find Roles":
          roleSearch();
          break;

        case "Find Department":
          departmentSearch();
          break;
    
        case "View Departments":
        viewDepartment();
        break;  


        case "Add Department":
          departmentAdd();
          break;    
          
        case "Add Employee":
          employeeAdd();
          break;
        
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        
          case "View All Employees":
          viewEmployees();
          break;
        
          case "Add a Role":
            addRole();
            break;
            
        case "View all Roles":
            viewRole();
            break;

        case "Exit":
            connection.end();
            break;
        
          default:
          console.log("Option not found");
          break;
        }

  
        
        
    })
};

function employeeSearch() {
    inquirer.prompt({
        type: "input",
        name: "employee",
        message: "which employee do we search for?"
    }).then(function (employeeAnswers) {
        console.log('get employee data function');
        connection.query('SELECT * FROM employee_table WHERE first_name = ? OR last_name = ?', [employeeAnswers.employee, employeeAnswers.employee], function (err, data) {
            if (err) throw err;
            console.table(data);
            begin();
        })
    })
}

function roleSearch() {
    inquirer.prompt({
        type: "input",
        name: "role",
        message: "which role do we search for?"
    }).then(function (roleAnswers) {
        console.log('get role data function');
        connection.query('SELECT * FROM workrole_table WHERE title = ?', [roleAnswers.role], function (err, data) {
            if (err) throw err;
            console.table(data);
            begin();
        })
    })
}

function departmentSearch() {
    inquirer.prompt({
        type: "input",
        name: "role",
        message: "which department do we search for?"
    }).then(function (roleAnswers) {
        console.log('get department data function');
        connection.query('SELECT * FROM department_table WHERE name = ?', [roleAnswers.role], function (err, data) {
            if (err) throw err;
            console.table(data);
            begin();
        })
    })
}

function departmentAdd() {
    inquirer.prompt({
        type: "input",
        name: "addition",
        message: "which department are we adding?"
    }).then(function (additionAnswers) {
        //console.log('get department add function');
        connection.query(
            'INSERT INTO department_table SET ?', 
            {
                name: additionAnswers.addition
            },
            function (err, data) {
                if (err) throw err;
                console.log("department added");
                begin();
            }
        );
    })
}

async function employeeAdd() {
    employeeRoles=[]
    employeeRoleByTitle = {}
    managers= []
    managerIdByName = {}

    await connection.asyncQuery('SELECT * FROM workrole_table')
        .then( data => {
            data.forEach(role=>{
                employeeRoles.push(role.title);
                employeeRoleByTitle[role.title] = role.id;
            });
        });


    await connection.asyncQuery('SELECT * FROM employee_table')
        .then( data => {
            data.forEach(employee=>{
                employeename = employee.first_name + " " + employee.last_name;
                managers.push(employeename);
                managerIdByName [employeename] = employee.id;
            });
            managers.push("No Manager");
            managerIdByName["No Manager"] = null;
        });
 
    await inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Enter employee's first name",
        },
        {
            name: "lastname",
            type: "input",
            message: "Enter employee's last name",
        },
        {
            name: "role",
            type: "list",
            choices: employeeRoles,
            message: "Choose the Employee's Role",
        },
        {
            name: "manager",
            type: "list",
            choices: managers,
            message: "Select employee's manager",
        }

    ])
    .then(function (answers) {
        console.log('insert employee add function');
        connection.query(
            'INSERT INTO employee_table SET ?', 
            {
                first_name: answers.firstname,
                last_name: answers.lastname,
                role_id:  employeeRoleByTitle[answers.role],
                manager_id: managerIdByName[answers.manager],
            },
            function (err, data) {
                if (err) throw err;
                console.log("employee added");
                begin();
            }
        );
    });
}

//https://www.mysqltutorial.org/basic-mysql-tutorial-aspx/mysql-self-join/ for how this works.
function viewEmployees(){
connection.query(
    `SELECT 
        CONCAT(e.first_name," ",e.last_name) AS Name,
        r.title AS Role, 
        r.salary AS Salary,
        d.name AS Department,
        CONCAT(m.first_name," ",m.last_name) AS Manager
    FROM employee_table e 
    LEFT OUTER JOIN workrole_table r ON e.role_id = r.id
    INNER JOIN department_table d ON r.department_id = d.id
    LEFT OUTER JOIN employee_table m ON e.manager_id = m.id
    ORDER BY Name`,
    function (err, data) {
        if (err) throw err;
        console.table(data);
        begin();
    })
};

function viewDepartment (){
    connection.query(
        "SELECT name FROM department_table ORDER BY name",
            function (err, data) {
                if (err) throw err;
                console.table(data);
                begin();
        })
};


function viewRole(){
    connection.query(
        "SELECT workrole_table.title, workrole_table.salary, department_table.name FROM workrole_table INNER JOIN department_table ON workrole_table.department_id = department_table.id ORDER BY title",
        // "SELECT * FROM workrole_table",
        function (err, data) {
            if (err) throw err;
            console.table(data);
            begin();
    
        })
}


async function addRole() {
    departments=[]
    departmentIdByName = {}
    
    await connection.asyncQuery('SELECT * FROM department_table ORDER BY name')
        .then( data => {
            data.forEach(d=>{
                departments.push(d.name);
                departmentIdByName[d.name] = d.id;
            });
        });

    
    await inquirer.prompt([
        { 
           type: "input",
           name: "rolename",
           message: "what role are we adding?"
        },
        {
            name: "salary",
            type: "input",
            message: "Enter salary for role",
        },
        {
            name: "depo",
            type: "list",
            message: "What department is the role in?",
            choices: departments,

        },
    ]).then(function (additionAnswers) {
        console.log('get department add function');
        connection.query(
            'INSERT INTO workrole_table SET ?', 
            {
                title: additionAnswers.rolename,
                salary: additionAnswers.salary,
                department_id: departmentIdByName[ additionAnswers.depo ]
            },
            function (err, data) {
                if (err) throw err;
                console.log(`added ${additionAnswers.rolename}`);
                begin();
            }
        );
    })
}

async function  updateEmployeeRole() {
    employees = []
    workroles = []
    employeeIdByName = {}
    roleIdByTitle = {}

    await connection.asyncQuery('SELECT * FROM workrole_table')
        .then( data => {
            data.forEach(role=>{
                workroles.push(role.title);
                roleIdByTitle[role.title] = role.id;
            });
        });


    await connection.asyncQuery('SELECT * FROM employee_table')
        .then( data => {
            data.forEach(employee=>{
                employeename = employee.first_name + " " + employee.last_name;
                employees.push(employeename);
                employeeIdByName [employeename] = employee.id;
            });
        });

        // console.table(employeeIdByName);
        // console.table(roleIdByTitle);
        // console.log(workroles)
    await inquirer.prompt([
        { 
            type: "list",
            name: "employee",
            message: "Select employee",
            choices: employees
        },
        {
            name: "newrole",
            type: "list",
            message: "Select new role",
            choices: workroles
        },
    ]).then(function (anws) {
        connection.query(
            'UPDATE employee_table SET ? WHERE ?', 
            [
                {
                    role_id: roleIdByTitle[anws.newrole]
                },
                {
                    id: employeeIdByName[anws.employee]
                }
            ],
            function (err, data) {
                if (err) throw err;
                console.log(`updated ${anws.employee} role`);
                begin();
            }
        );
    })

};