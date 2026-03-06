# TodoList Web Application

A full-stack TodoList web application built with **Node.js, Express, and MySQL**.  
This project was created to understand the basic structure of a web service, including **REST API design, database interaction, and frontend-backend communication**.

The application allows users to manage their tasks and also save **snapshots of their todo lists**, enabling users to view past task states.

---

## Features

- Create, read, update, and delete todos (CRUD)
- Mark todos as completed
- Save snapshots of the current todo list
- View previously saved snapshots
- Delete snapshots
- Horizontal drag UI for browsing snapshot history

---

## Tech Stack

Frontend
- HTML
- CSS
- Vanilla JavaScript

Backend
- Node.js
- Express

Database
- MySQL

---

## API Endpoints

### Todo


POST /todos
GET /todos
PUT /todos/:id
DELETE /todos/:id


### Snapshots


POST /snapshots
GET /snapshots
DELETE /snapshots/:id


---

## What I Learned

- Designing RESTful APIs using Express
- Connecting Node.js server with MySQL
- Handling asynchronous requests using fetch and async/await
- Managing frontend-backend data flow
- Implementing additional features on top of basic CRUD functionality

---

## Project Goal

The goal of this project was to gain hands-on experience with **building a full-stack web application** and understanding how frontend, backend, and database components interact in a real web service.
