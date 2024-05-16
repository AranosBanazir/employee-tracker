INSERT INTO departments (name)
VALUES 
    ('Legal'),
    ('Sales'),
    ('Finance'),
    ('Engineering'),
    ('Quality Control'),
    ('Groundskeeping');

INSERT INTO roles (title, salary, department)
VALUES 
       ('Janitor', '33000', '6'),
       ('Manager', '50000', '2'),
       ('Sales Lead', '30000', '2'),
       ('Software Engineer', '90000', '4'),
       ('Software Engineering Lead', '200000', '4'),
       ('Accountant', '60000', '3'),
       ('Lawyer', '100000', '1'),
       ('Legal Team Lead', '250000', '1');

INSERT INTO managers (first_name, last_name, department)
    VALUES ('Bob', 'Saget', '4'),
           ('Elvis', 'Prestley', '1');



INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES 
        ('Caleb', 'Saiia', '4', '1'),
        ('John', 'Doe', '2', '2'),
        ('Tom', 'Allen', '3', '1');

INSERT INTO employees (first_name, last_name, role_id)
    VALUES 
        ('Bob', 'Saget', '5'),
        ('Elvis', 'Prestley', '8');