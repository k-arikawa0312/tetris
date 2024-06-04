import styles from './index.module.css';
import React, { useState } from 'react';

const sevenBlockBag = [0, 1, 2, 3, 4, 5, 6];
let canChangeNextBlock = false;

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
const changeNextBlock = (nextBlock: number[][]) => {
  const decidedBlock = Math.floor(Math.random() * 7);

  if (sevenBlockBag.length === 0) {
    for (let n = 0; n < 7; n++) {
      sevenBlockBag.push(n);
    }
  }

  const index = sevenBlockBag.indexOf(decidedBlock);
  switch (decidedBlock) {
    case 0:
      sevenBlockBag.splice(index, 1);
      nextBlock[0][2] = 1;
      nextBlock[1][2] = 1;
      nextBlock[1][3] = 1;
      nextBlock[1][1] = 1; //T purple

      break;
    case 1:
      sevenBlockBag.splice(index, 1);
      nextBlock[0][2] = 1;
      nextBlock[1][2] = 1;
      nextBlock[2][2] = 1;
      nextBlock[3][2] = 1; //I waterblure
      break;
    case 2:
      sevenBlockBag.splice(index, 1);
      nextBlock[0][2] = 1;
      nextBlock[1][2] = 1;
      nextBlock[1][1] = 1;
      nextBlock[0][1] = 1; //o yellow
      break;
    case 3:
      sevenBlockBag.splice(index, 1);
      nextBlock[0][1] = 1;
      nextBlock[1][2] = 1;
      nextBlock[1][3] = 1;
      nextBlock[1][1] = 1; //j blue
      break;
    case 4:
      sevenBlockBag.splice(index, 1);
      nextBlock[0][3] = 1;
      nextBlock[1][2] = 1;
      nextBlock[1][3] = 1;
      nextBlock[1][1] = 1; //L orange
      break;
    case 5:
      sevenBlockBag.splice(index, 1);
      nextBlock[0][2] = 1;
      nextBlock[1][2] = 1;
      nextBlock[0][3] = 1;
      nextBlock[1][1] = 1; //s green
      break;
    case 6:
      sevenBlockBag.splice(index, 1);
      nextBlock[0][2] = 1;
      nextBlock[1][2] = 1;
      nextBlock[0][1] = 1;
      nextBlock[1][1] = 1; //z red
      break;
  }
  return nextBlock;
};

const renewalBlock = (board: number[][], nextBlock: number[][]) => {
  const block = [];
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      if (nextBlock[y][x] === 1) {
        block.push([x, y]);
        nextBlock[y][x] = 0;
      }
    }
  }
  for (const [x, y] of block) {
    board[y][x + 3] = 1;
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
      for (let x = 0; x < 10; x++) {
        for (let y = 19; y >= 0; y--) {
          if (deletedBoard[y]?.[x] === 2 && y + linePos.length < 20) {
            console.log(linePos.length);
            deletedBoard[y + linePos.length][x] = 2;
            deletedBoard[y][x] = 0;
          }
        }
      }
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
      console.log(10);

      canChangeNextBlock = true;
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

  const [nextBlock, setNextBlock] = useState([
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ]);

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

    if (key === ' ') {
      hardDrop();
    }
    return;
  };
  const downBlock = () => {
    const newBoard = fallBlock(board);
    console.log(canChangeNextBlock);
    if (canChangeNextBlock) {
      const deletedBoard = deleteLine(board);
      setBoard(renewalBlock(deletedBoard, nextBlock));
      setNextBlock(changeNextBlock(nextBlock));
      canChangeNextBlock = false;
    } else {
      setBoard(newBoard);
    }
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

  return (
    <div className={styles.container} onKeyDown={keyHandler} onKeyPress={downBlock} tabIndex={0}>
      <div>
        next block
        <div className={styles.nextBlockBoard}>
          {nextBlock.map((row, y) =>
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
        hold block
        <div className={styles.nextBlockBoard}>
          {nextBlock.map((row, y) =>
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
