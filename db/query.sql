    SELECT 
    e.id, 
    CONCAT(e.first_name, ' ', e.last_name) AS "Name", 
    r.title AS "Title", 
    d.name AS "Department"
    FROM employees AS e 
    JOIN roles AS r ON e.role_id = r.id
    JOIN departments AS d ON r.department = d.id
    WHERE d.name = 'Legal'
    ORDER BY "Name" ASC;