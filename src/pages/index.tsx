import styles from './index.module.css';
import React, { useState } from 'react';

const changeBlock = (board: number[][], position: number[][], toChange: number) => {
  const newBoard = structuredClone(board);
  for (const [tx, ty] of position) {
    if (newBoard[ty] !== undefined) newBoard[ty][tx] = toChange;
  }
  return newBoard;
};

const fallBlock = (board: number[][]) => {
  const position = [];
  const block = [];
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 10; x++) {
      for (let nx = 0; nx < 10; nx++) {
        for (let ny = 0; ny < 20; ny++) {
          if (board[ny][nx] === 1) {
            block.push([nx, ny]);
            if (board[ny + 1][nx] === 2) {
              for (let ty = 0; ty < 20; ty++) {
                for (let tx = 0; tx < 10; tx++) {
                  if (board[ty] !== undefined && board[ty][tx] === 1) {
                    board[ty][tx] = 2;
                  }
                }
              }

              return board;
            }
          }
        }
      }
      if (board[y][x] === 1 && board[y + 1]?.[x] !== 2) {
        position.push([x, y + 1]);
        if (y === 19) {
          console.table(board);
          for (const [tx, ty] of block) {
            if (board[ty] !== undefined) {
              board[ty][tx] = 2;
            }
          }
          return board;
        }
        if (board[y + 1]?.[x] === 2) {
          for (const [tx, ty] of block) {
            if (board[ty] !== undefined) {
              board[ty][tx] = 2;
            }
          }
        }
        board[y][x] = 0;
      }
    }
  }
  return changeBlock(board, position, 1);
};

const Home = () => {
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  ]);

  const click = () => {
    const aaa = structuredClone(board);
    const newBoard = fallBlock(aaa);

    setBoard(newBoard);
  };

  console.log(board);
  return (
    <div className={styles.container}>
      <button onClick={click}>落ちる</button>
      <div className={styles.backBoard}>
        {board.map((row, y) =>
          row.map((display, x) => (
            <div className={styles.cell} key={`${x}-${y}`}>
              <div
                className={styles.stone}
                style={{
                  background: display === 0 ? '#000000' : display === 1 ? '#0084ff' : '#d9ff00',
                }}
              />
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default Home;
