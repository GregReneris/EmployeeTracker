# EmployeeTracker
This is an employee tracker!
This Command Line Application is designed to help manage a business. This application enables a user to create, update, and manage their employees, roles and salaries, and departments.


## Instructions

The following database schema contain three tables:

* **department**:

  * **id** - INT PRIMARY KEY
  * **name** - VARCHAR(30) to hold department name

* **role**:

  * **id** - INT PRIMARY KEY
  * **title** -  VARCHAR(30) to hold role title
  * **salary** -  DECIMAL to hold role salary
  * **department_id** -  INT to hold reference to department role belongs to

* **employee**:

  * **id** - INT PRIMARY KEY
  * **first_name** - VARCHAR(30) to hold employee first name
  * **last_name** - VARCHAR(30) to hold employee last name
  * **role_id** - INT to hold reference to role employee has
  * **manager_id** - INT to hold reference to another employee that manager of the current employee. This field may be null if the employee has no manager



  **starting the program**

Clone this repo to your hard drive.
Seed the SQL file from seed.sql.
"npm init -y"
"npm install" - to install dependancies.
"node index.js" to run the program. Follow the prompts to use the program. Use arrow keys, text input, and the enter key to navigate.