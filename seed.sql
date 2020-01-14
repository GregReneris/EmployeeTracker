CREATE database employee_db;

USE employee_db;

CREATE TABLE department_table (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(30)

);


CREATE TABLE workrole_table (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary decimal(10,4),
    department_id INTEGER,
    
    FOREIGN KEY (department_id) REFERENCES department_table(id)

);


CREATE TABLE employee_table (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER,
  manager_id INTEGER,
  

  FOREIGN KEY (role_id) REFERENCES workrole_table(id),
  FOREIGN KEY (manager_id) REFERENCES employee_table(id)
);

SELECT * FROM employee_table;