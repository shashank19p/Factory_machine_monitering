<<<<<<< HEAD
# Factory Machine Monitoring

A DBMS course project for monitoring factory machines and coordinating maintenance work between administrators, workers, and engineers.

The application is built with Node.js, Express, EJS, Bootstrap, and MySQL. Users log in by role and are redirected to the correct dashboard.

## Features

- Role-based login for admin, worker, and engineer users
- Admin dashboard to view all machines and non-admin users
- Worker dashboard to:
  - View all factory machines
  - Report damaged machines
  - Assign engineers to machines
  - Mark assigned follow-up work as done
- Engineer dashboard to:
  - View assigned machines
  - Start maintenance work
  - Mark maintenance work as completed
- MySQL-backed machine and user records
- Session-based authentication using `express-session`

## Tech Stack

- Node.js
- Express
- EJS
- MySQL
- mysql2
- Bootstrap 5

## Project Structure

```text
.
|-- app.js
|-- db.js
|-- package.json
|-- public/
|   `-- css/
|       `-- style.css
|-- routes/
|   |-- auth.js
|   |-- machines.js
|   `-- users.js
`-- views/
    |-- admin.ejs
    |-- dashboard.ejs
    |-- engineer.ejs
    |-- login.ejs
    `-- worker.ejs
```

## Prerequisites

- Node.js installed
- MySQL Server installed and running
- A MySQL database named `factory_management`

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the MySQL database:

   ```sql
   CREATE DATABASE factory_management;
   USE factory_management;
   ```

3. Create the required tables:

   ```sql
   CREATE TABLE Users (
       user_id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       email VARCHAR(100) NOT NULL UNIQUE,
       password VARCHAR(100) NOT NULL,
       role ENUM('admin', 'worker', 'engineer') NOT NULL
   );

   CREATE TABLE Machines (
       machine_id INT AUTO_INCREMENT PRIMARY KEY,
       machine_name VARCHAR(100) NOT NULL,
       location VARCHAR(100),
       server_name VARCHAR(100),
       status ENUM('Running', 'Stopped', 'Maintenance') DEFAULT 'Running',
       work_status ENUM('Pending', 'Assigned', 'In Progress', 'Completed') DEFAULT 'Pending',
       assigned_worker_id INT NULL,
       assigned_engineer_id INT NULL,
       FOREIGN KEY (assigned_worker_id) REFERENCES Users(user_id),
       FOREIGN KEY (assigned_engineer_id) REFERENCES Users(user_id)
   );
   ```

4. Add sample users:

   ```sql
   INSERT INTO Users (name, email, password, role) VALUES
   ('Admin User', 'admin@factory.com', 'admin123', 'admin'),
   ('Worker User', 'worker@factory.com', 'worker123', 'worker'),
   ('Engineer User', 'engineer@factory.com', 'engineer123', 'engineer');
   ```

5. Add sample machines:

   ```sql
   INSERT INTO Machines (machine_name, location, server_name, status, work_status) VALUES
   ('CNC Machine 1', 'Unit A', 'Server A', 'Running', 'Pending'),
   ('Lathe Machine 1', 'Unit B', 'Server B', 'Stopped', 'Pending'),
   ('Packaging Machine 1', 'Unit C', 'Server C', 'Running', 'Pending');
   ```

6. Update the database connection in `db.js` if your MySQL username or password is different:

   ```js
   const pool = mysql.createPool({
       host: 'localhost',
       user: 'root',
       password: 'your_mysql_password',
       database: 'factory_management'
   });
   ```

7. Start the application:

   ```bash
   npm start
   ```

8. Open the app in your browser:

   ```text
   http://localhost:3000
   ```

## Demo Accounts

```text
Admin:    admin@factory.com / admin123
Worker:   worker@factory.com / worker123
Engineer: engineer@factory.com / engineer123
```

## Main Routes

- `GET /login` - login page
- `POST /login` - authenticate user
- `GET /logout` - log out
- `GET /dashboard` - redirects users by role
- `GET /users/admin` - admin dashboard
- `GET /machines/worker` - worker dashboard
- `GET /machines/engineer` - engineer dashboard
- `POST /machines/mark-damaged/:id` - mark a machine for maintenance
- `POST /machines/assign-engineer/:id` - assign an engineer
- `POST /machines/engineer/start-work/:id` - start engineer work
- `POST /machines/engineer/mark-done` - complete selected engineer tasks
- `POST /machines/worker/mark-done` - clear selected worker follow-ups

## Notes

- Passwords are currently stored as plain text for course/demo use. Use password hashing before using this in production.
- Database credentials are configured directly in `db.js`. Use environment variables for safer deployments.
- No automated tests are configured yet.
=======

>>>>>>> 0f4fcef4f2979b9f12d51db44287a898d0913b3a
