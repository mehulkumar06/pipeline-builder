# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any
from collections import deque

app = FastAPI(title="Pipeline Parser", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Pipeline(BaseModel):
    nodes: list[dict[str, Any]]
    edges: list[dict[str, Any]]


def is_dag(nodes: list[dict], edges: list[dict]) -> bool:
    """
    Detect whether the graph is a Directed Acyclic Graph using
    Kahn's algorithm (topological sort via in-degree counting).

    Returns True if no cycle exists, False if a cycle is detected.
    Handles: empty graphs, disconnected nodes, self-loops.
    """
    if not nodes:
        return True

    node_ids = {n["id"] for n in nodes}
    in_degree: dict[str, int] = {nid: 0 for nid in node_ids}
    adj: dict[str, list[str]] = {nid: [] for nid in node_ids}

    for edge in edges:
        src = edge.get("source")
        tgt = edge.get("target")

        if not src or not tgt:
            continue
        if src not in node_ids or tgt not in node_ids:
            continue
        if src == tgt:
            # Self-loop — immediately not a DAG
            return False

        adj[src].append(tgt)
        in_degree[tgt] += 1

    # Use deque for O(1) pops from the front
    queue = deque(nid for nid, deg in in_degree.items() if deg == 0)
    visited = 0

    while queue:
        node = queue.popleft()
        visited += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # All nodes visited → no cycle → is a DAG
    return visited == len(node_ids)


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = is_dag(pipeline.nodes, pipeline.edges)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": dag,
    }