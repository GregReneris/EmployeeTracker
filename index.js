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
          "Find Employee",
          "Add Employee",
          "Find Roles",
          "Add Role",
          "Find Department",
          "Add Department",
          "Update Employee Role",
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
    
        case "Add Department":
          departmentAdd();
          break;    
          
        case "Add Employee":
          employeeAdd();
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
        console.log('get department add function');
        connection.query(
            'INSERT INTO department_table SET ?', 
            {
                name: additionAnswers.addition
            },
            function (err, data) {
                if (err) throw err;
                console.table(data);
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
            managerIdByName["No Manager"] = 0;
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
            message: "Enter employee's last name: ",
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
                console.table(data);
                begin();
            }
        );
    });
}

