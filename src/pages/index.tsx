import styles from './index.module.css';
import React, { useEffect, useState } from 'react';

const sevenBlockBag = [0, 1, 2, 3, 4, 5, 6];

const changeBlock = (board: number[][], position: number[][], toChange: number) => {
  const newBoard = structuredClone(board);

  for (const [tx, ty] of position) {
    if (newBoard[ty] !== undefined) newBoard[ty][tx] = toChange;
  }

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
const nextBlock = (board: number[][]) => {
  const decideBlock = Math.floor(Math.random() * 7);
  if (sevenBlockBag.length === 0) {
    for (let n = 0; n < 7; n++) {
      sevenBlockBag.push(n);
    }
  }
  if (decideBlock === 0) {
    const index = sevenBlockBag.indexOf(0);
    sevenBlockBag.splice(index, 1);
    board[0][5] = 1;
    board[1][5] = 1;
    board[1][6] = 1;
    board[1][4] = 1; //T purple
  } else if (decideBlock === 1) {
    const index = sevenBlockBag.indexOf(1);
    sevenBlockBag.splice(index, 1);
    board[0][5] = 1;
    board[1][5] = 1;
    board[2][5] = 1;
    board[3][5] = 1; //I waterblure
  } else if (decideBlock === 2) {
    const index = sevenBlockBag.indexOf(2);
    sevenBlockBag.splice(index, 1);
    board[0][5] = 1;
    board[1][5] = 1;
    board[1][4] = 1;
    board[0][4] = 1; //o yellow
  } else if (decideBlock === 3) {
    const index = sevenBlockBag.indexOf(3);
    sevenBlockBag.splice(index, 1);
    board[0][4] = 1;
    board[1][5] = 1;
    board[1][6] = 1;
    board[1][4] = 1; //j blue
  } else if (decideBlock === 4) {
    const index = sevenBlockBag.indexOf(4);
    sevenBlockBag.splice(index, 1);
    board[0][6] = 1;
    board[1][5] = 1;
    board[1][6] = 1;
    board[1][4] = 1; //L orange
  } else if (decideBlock === 5) {
    const index = sevenBlockBag.indexOf(5);
    sevenBlockBag.splice(index, 1);
    board[0][5] = 1;
    board[1][5] = 1;
    board[0][6] = 1;
    board[1][4] = 1; //s green
  } else if (decideBlock === 6) {
    const index = sevenBlockBag.indexOf(6);
    sevenBlockBag.splice(index, 1);
    board[0][5] = 1;
    board[1][5] = 1;
    board[0][4] = 1;
    board[1][6] = 1; //z red
  }
  return board;
};

const deleteLine = (board: number[][]) => {
  let isLine = 0;
  const deletePos = [];
  const linePos = [];
  for (let row = 0; row < 20; row++) {
    isLine = board[row].filter((cell) => cell !== 0).length;

    if (isLine === 10) {
      for (let y = 0; y < 20; y++) {
        if (board[y].filter((cell) => cell !== 0).length === 10) {
          linePos.push(y);
        }
      }
      for (let x = 0; x < 10; x++) {
        for (const row of linePos) deletePos.push([x, row]);
      }

      const deletedBoard: number[][] = changeBlock(board, deletePos, 0);
      return deletedBoard;
    }
  }
  return board;
};

const fallBlock = (board: number[][]) => {
  const position = [];
  const block = makeBlock(board);

  for (const [tx, ty] of block) {
    if (ty === 19 || tx === -1 || board[ty + 1]?.[tx] === 2) {
      for (const [nx, ny] of block) {
        board[ny][nx] = 2;
      }
      const deletedBoard = deleteLine(board);
      return nextBlock(deletedBoard);
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
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
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
    // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2, 2, 2, 2, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 0, 2],
  ]);

  // const [seconds, setSeconds] = useState(0);

  // const isActive = 0;
  // useEffect(() => {
  //   let interval = 0;
  //   interval = window.setInterval(() => {
  //     setSeconds((prevSeconds) => prevSeconds + 1);
  //     downBlock();
  //   }, 1000);
  // }, [isActive]);

  const keyHandler = (event: React.KeyboardEvent) => {
    event.preventDefault();
    const key = event.key;
    if (key === 'ArrowDown') {
      console.log(sevenBlockBag);
      console.log(sevenBlockBag.indexOf(5));
      console.log(sevenBlockBag.indexOf(3));
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
