# Pipeline Builder — VectorShift Frontend Assessment

A drag-and-drop pipeline builder where you can connect different nodes together to design data workflows. Built with React on the frontend and FastAPI on the backend.

---

## How to run it

You'll need two terminals open at the same time.

**Terminal 1 — Frontend**
```bash
cd frontend
npm install
npm start
```
Opens at http://localhost:3000

**Terminal 2 — Backend**
```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python -m venv venv
source venv/bin/activate

pip install fastapi uvicorn
uvicorn main:app --reload
```
Runs at http://localhost:8000

---

## What I built

### Part 1 — Node Abstraction

The original code had four node files that were mostly copy-pastes of each other. I created a single `BaseNode` component that handles all the shared stuff — the header, handles, delete button, styling — and each node just passes in its own title, color, and form fields.

Adding a new node with this setup takes about 15 lines instead of 60.

I made five new nodes to show how it works:
- **Filter** — filters a list based on a condition
- **Math** — does arithmetic between two inputs
- **API Request** — makes HTTP calls with method + URL
- **Condition** — routes flow based on true/false expression
- **Transform** — applies data transformations like JSON parse, uppercase, etc.

### Part 2 — Styling

Went with a warm dark theme instead of the typical cold blue/purple that most dark UIs use. The base color is a warm charcoal (`#111110`) with amber accents. Each node has its own muted earth tone color so you can tell them apart at a glance.

Fonts used are Inter for body text and JetBrains Mono for node headers.

### Part 3 — Text Node

Two things added to the text node:

**Dynamic sizing** — as you type, the node gets wider and the text area grows taller automatically. It uses `scrollHeight` to measure the content and updates on every keystroke.

**Variable handles** — if you type `{{variableName}}` in the text field, a new input handle appears on the left side of the node for that variable. You can then connect other nodes to it. Type `{{name}}` and `{{age}}` and you get two separate handles. Remove the text and the handle disappears.

### Part 4 — Backend

When you click "Run Pipeline", the frontend sends all the current nodes and edges to the FastAPI backend. The backend figures out:
- How many nodes are in the pipeline
- How many edges (connections) there are
- Whether the pipeline is a valid DAG (no circular connections)

For the DAG check I used Kahn's algorithm — it counts how many connections point into each node, processes nodes with no incoming connections first, and if it can visit every node this way then there are no cycles. If some nodes are left unvisited, there's a loop somewhere.

The result comes back as an alert showing all three values.

---

## Bonus — Note Node

I added a sticky note node that isn't part of the pipeline logic — it's just for leaving comments or annotations on the canvas, similar to what VectorShift has. It supports bold, italic, underline, bullet lists, headings, and you can change the color. It's resizable and won't interfere with your pipeline connections.

---

## Project structure

```
frontend/src/
├── nodes/
│   ├── baseNode.js      
│   ├── inputNode.js
│   ├── outputNode.js
│   ├── llmNode.js
│   ├── textNode.js     
│   ├── newNodes.js    
│   └── noteNode.js     
├── store.js             
├── ui.js                
├── toolbar.js           
├── submit.js            

backend/
└── main.py              
```

---

## Tech used

- React 18
- ReactFlow
- Zustand
- FastAPI
- Uvicorn