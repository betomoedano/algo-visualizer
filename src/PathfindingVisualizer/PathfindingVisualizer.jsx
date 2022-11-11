import * as React from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import "./PathfindingVisualizer.css";
const BOARD_SIZE = 50;

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default function PathfindingVisualizer() {
  const [board, setBoard] = React.useState(getInitialGrid);
  const [mouseIsPressed, setMouseIsPressed] = React.useState(false);

  function handleMouseDown(row, col) {
    setMouseIsPressed(true);
    const newGrid = getNewGridWithWallToggled(board, row, col, mouseIsPressed);
    setBoard(newGrid);
  }

  function handleMouseEnter(row, col) {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(board, row, col, mouseIsPressed);
    setBoard(newGrid);
  }
  function handleMouseUp() {
    setMouseIsPressed(false);
  }

  function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  function visualizeDijkstra() {
    const startNode = board[START_NODE_ROW][START_NODE_COL];
    const finishNode = board[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(board, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  return (
    <React.Fragment>
      <button onClick={visualizeDijkstra}>
        Visualize Dijkstra's Algorithm
      </button>
      <div className="board">
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((node, colIdx) => {
              const { row, col, isFinish, isStart, isWall } = node;
              return (
                <Node
                  key={colIdx}
                  col={col}
                  isFinish={isFinish}
                  isStart={isStart}
                  isWall={isWall}
                  mouseIsPressed={mouseIsPressed}
                  onMouseDown={(row, col) => handleMouseDown(row, col)}
                  onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                  onMouseUp={handleMouseUp}
                  row={row}
                />
              );
            })}
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    const currentRow = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

function createNode(col, row) {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
}

const getNewGridWithWallToggled = (grid, row, col, mouseIsPressed) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: mouseIsPressed ? true : !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
