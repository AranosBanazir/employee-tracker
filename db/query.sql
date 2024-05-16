INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
('Cal', 'Banazir', (SELECT departments.id from departments WHERE departments.name = 'Marketing'), '1');