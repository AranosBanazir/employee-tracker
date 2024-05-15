DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

\c employee_tracker;

CREATE TABLE department (
    id SERIAL,
    name VARCHAR(30)
);

CREATE TABLE role (
    id SERIAL,
    title VARCHAR(30),
    salary DECIMAL,
    department INT

);

CREATE TABLE employee (
    id SERIAL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id   INT,
    manager_id INT
);