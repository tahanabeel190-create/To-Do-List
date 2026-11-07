# Command-Line To-Do List App (Full-Stack)

A complete Full-Stack To-Do List application built with a **Flask (Python) Backend** and a **React (JavaScript) Frontend**. 
The app persists data seamlessly in a JSON file without the need for a database, making it extremely easy to set up and run locally.

## Features
- Add, Edit, Complete, and Delete tasks.
- Data persists in `backend/tasks.json`.
- Prioritize tasks (High, Medium, Low) with visual indicators.
- Due Dates tracking with automatic "Overdue" and "Due Today" badges.
- Search, Filter, and Sort capabilities.
- Real-time task statistics.
- Export tasks as JSON.

---

## Folder Structure

```text
todo-app/
├── backend/
│   ├── app.py             # Main Flask backend application
│   ├── requirements.txt   # Backend dependencies
│   └── tasks.json         # File-based database
└── frontend/
    ├── package.json       # React dependencies and scripts
    ├── vite.config.js     # Vite configuration
    ├── index.html         # Main HTML file
    ├── public/            # Static assets
    └── src/
        ├── components/    # Reusable React components
        │   ├── components.css
        │   ├── EmptyState.jsx
        │   ├── FilterButtons.jsx
        │   ├── Navbar.jsx
        │   ├── SearchBar.jsx
        │   ├── TaskCard.jsx
        │   ├── TaskForm.jsx
        │   └── TaskList.jsx
        ├── pages/
        │   └── Home.jsx   # Main Application Page Layout
        ├── App.css        # App-level styling
        ├── App.jsx        # App component
        ├── index.css      # CSS variables and resets
        └── main.jsx       # React DOM entry point
```

---

## Step-by-Step Setup Instructions

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Python 3.x**: [Download Python](https://www.python.org/downloads/)
- **Node.js & npm**: [Download Node.js](https://nodejs.org/)

### 2. Setup the Backend
Open a terminal and navigate to the project root directory, then into the `backend` folder:
```bash
cd backend
```
Install the required Python packages:
```bash
pip install -r requirements.txt
```
Start the Flask server:
```bash
python app.py
```
> The backend will start on `http://localhost:5001`. Keep this terminal running!

### 3. Setup the Frontend
Open a **new** terminal window, navigate to the project root directory, then into the `frontend` folder:
```bash
cd frontend
```
Install the node dependencies:
```bash
npm install
```
Start the Vite development server:
```bash
npm run dev
```
> The frontend will typically start on `http://localhost:5173`. Open this URL in your browser.

---

## API Documentation

The backend uses a simple REST API running at `http://localhost:5001/tasks`.

### `GET /tasks`
Fetch all tasks.
- **Response:** `200 OK`
- **Body:** `[ { "id": 1, "title": "Task", ... } ]`

### `POST /tasks`
Create a new task.
- **Payload:** `{ "title": "string", "description": "string", "priority": "Low|Medium|High", "dueDate": "YYYY-MM-DD" }`
- **Response:** `201 Created`
- **Body:** Returns the newly created task object.

### `PUT /tasks/<id>`
Update an existing task (e.g., mark as complete or edit details).
- **Payload:** Partial or full task object.
- **Response:** `200 OK`
- **Body:** Returns the updated task object.

### `DELETE /tasks/<id>`
Delete a task.
- **Response:** `200 OK`
- **Body:** `{ "message": "Task deleted" }`

---
*Built as a college project demonstrating intermediate full-stack web development concepts without over-engineering.*
