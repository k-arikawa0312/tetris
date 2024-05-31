import styles from './index.module.css';
import React, { useState } from 'react';

const changeBlock = (board: number[][], position: number[][], toChange: number) => {
  const newBoard = structuredClone(board);
  let line = 0;
  const deletePos = [];
  for (const [tx, ty] of position) {
    if (newBoard[ty] !== undefined) newBoard[ty][tx] = toChange;
  }
  for (let row = 0; row < 20; row++) {
    line = newBoard[row].filter((cell) => cell !== 0).length;
    console.log(row, line);
    if (line === 10) {
      for (let x = 0; x < 10; x++) {
        deletePos.push([x, row]);
      }
      console.log(deletePos);

      const deletedBoard: number[][] = changeBlock(newBoard, deletePos, 0);
      return deletedBoard;
    }
  }
  console.table(newBoard);
  return newBoard;
};

const makeBlock = (board: number[][]) => {
  const block = [];

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 20; y++) {
      if (board[y]?.[x] === 1) {
        block.push([x, y]);
      }
    }
  }

  return block;
};

const fallBlock = (board: number[][]) => {
  const position = [];
  const block = makeBlock(board);

  for (const [tx, ty] of block) {
    if (ty === 19 || tx === -1 || board[ty + 1]?.[tx] === 2) {
      for (const [nx, ny] of block) {
        board[ny][nx] = 2;
      }
      return board;
    }
  }

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 20; y++) {
      if (
        block[0] !== undefined &&
        block[0].includes(x, y) &&
        board[y + 1]?.[x] !== 2 &&
        block[0][0] !== 19 &&
        block[0][1] !== 19 &&
        block[0][2] !== 19 &&
        block[0][3] !== 19
      ) {
        for (const [tx, ty] of block) {
          if (board[ty] !== undefined) {
            position.push([tx, ty + 1]);
            board[ty][tx] = 0;
          }
        }
        return changeBlock(board, position, 1);
      }
    }
  }
  return board;
};

const moveLeftBlock = (board: number[][]) => {
  const position = [];
  const block = makeBlock(board);
  for (let x = 20; x >= 0; x--) {
    for (let y = 0; y < 20; y++) {
      if (
        block[0] !== undefined &&
        block[0].includes(x, y) &&
        board[y]?.[x - 1] !== 2 &&
        block[0]?.[0] !== 0 &&
        block[1]?.[0] !== 0 &&
        block[2]?.[0] !== 0 &&
        block[3]?.[0] !== 0
      ) {
        let noLeftBlock = 0;

        for (const [tx, ty] of block) {
          if (board[ty][tx - 1] === 2) {
            noLeftBlock += 1;
          }
        }
        if (noLeftBlock !== 0) {
          return board;
        }
        for (const [tx, ty] of block) {
          position.push([tx - 1, ty]);
          console.log(position);
          board[ty][tx] = 0;
        }

        return changeBlock(board, position, 1);
      }
    }
  }
  return board;
};

const moveRightBlock = (board: number[][]) => {
  const position = [];
  const block = makeBlock(board);
  for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 20; y++) {
      if (
        block[0] !== undefined &&
        block[0].includes(x, y) &&
        board[y]?.[x + 1] !== 2 &&
        block[0]?.[0] !== 9 &&
        block[1]?.[0] !== 9 &&
        block[2]?.[0] !== 9 &&
        block[3]?.[0] !== 9
      ) {
        let noRightBlock = 0;

        for (const [tx, ty] of block) {
          if (board[ty][tx + 1] === 2) {
            noRightBlock += 1;
          }
        }
        if (noRightBlock !== 0) {
          return board;
        }
        for (const [tx, ty] of block) {
          position.push([tx + 1, ty]);
          board[ty][tx] = 0;
        }

        return changeBlock(board, position, 1);
      }
    }
  }
  return board;
};

// const turnBlock = (board: number[][]) => {
//   const block = makeBlock(board);
//   return block;
// };

const Home = () => {
  const [board, setBoard] = useState([
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
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
    [2, 2, 2, 2, 2, 2, 2, 2, 0, 2],
    [0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
  ]);

  const keyHandler = (event: React.KeyboardEvent) => {
    event.preventDefault();
    const key = event.key;
    if (key === 'ArrowDown') {
      downBlock();
    }
    if (key === 'ArrowLeft') {
      leftBlock();
    }
    if (key === 'ArrowRight') {
      rightBlock();
    }
    // if (key === 'ArrowUp') {
    //   spinBlock();
    // }
    if (key === ' ') {
      hardDrop();
    }
    return;
  };
  const downBlock = () => {
    const newBoard = fallBlock(board);
    setBoard(newBoard);
  };
  const leftBlock = () => {
    const newBoard = moveLeftBlock(board);
    setBoard(newBoard);
  };
  const rightBlock = () => {
    const newBoard = moveRightBlock(board);
    setBoard(newBoard);
  };
  const hardDrop = () => {
    let newBoard = board;
    let wasDropped = false;

    do {
      const tempBoard = fallBlock(newBoard);
      wasDropped = newBoard !== tempBoard;
      newBoard = tempBoard;
    } while (wasDropped);

    setBoard(newBoard);
  };
  // const spinBlock = () => {
  //   const newBoard = turnBlock(board);
  //   setBoard(newBoard);
  // };

  return (
    <div className={styles.container} onKeyDown={keyHandler} onKeyPress={downBlock} tabIndex={0}>
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
