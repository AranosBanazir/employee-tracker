SELECT 
    e.id, 
    CONCAT(e.first_name, ' ', e.last_name) AS "Name", 
    r.title AS "Title", 
    d.name AS "Department"
    FROM employees AS e 
    JOIN roles AS r ON e.role_id = r.id
    JOIN departments AS d ON r.id = d.id
    WHERE e.manager_id = 1
    ORDER BY "Department" ASC;