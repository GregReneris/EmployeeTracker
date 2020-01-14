DROP
CREATE database employee_db;

USE employee_db;

CREATE TABLE department_table (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(30)

);


CREATE TABLE workrole_table (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary decimal(10,2),
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




INSERT INTO department_table
VALUES (0, "Innovations");

INSERT INTO workrole_table VALUES (0, "Manager", 80000, 1);
-- INSERT INTO workrole_table (title, salary)
-- VALUES ("Manager", 80000);
INSERT INTO workrole_table VALUES (0, "Worker-Bee", 50000, 1);


INSERT INTO employee_table VALUES (0,"Jack","Sorenson",2,null);
INSERT INTO employee_table VALUES (0,"Nate","Ginn",2,3);
INSERT INTO employee_table VALUES (0,"Dennis","Cupcake",1,0);