import styles from './index.module.css';
import React, { useEffect, useState, useRef } from 'react';

const sevenBlockBag = [0, 1, 2, 3, 4, 5, 6];
let canChangeNextBlock = false;
let removedLine = 0;
// const tetrisMino = [
//   [
//     [0, 1, 0],
//     [1, 1, 1],
//   ],

//   [[1, 1, 1, 1]],
//   [
//     [1, 1],
//     [1, 1],
//   ],
//   [
//     [1, 0, 0],
//     [1, 1, 1],
//   ],
//   [
//     [0, 0, 1],
//     [1, 1, 1],
//   ],
//   [
//     [0, 1, 1],
//     [1, 1, 0],
//   ],
//   [
//     [1, 1, 0],
//     [0, 1, 1],
//   ],
// ];

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
  let decidedBlock = Math.floor(Math.random() * 7);
  const newNextBlock = structuredClone(nextBlock);
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      newNextBlock[y][x] = 0;
    }
  }

  if (sevenBlockBag.length === 0) {
    for (let n = 0; n < 7; n++) {
      sevenBlockBag.push(n);
    }
  }
  while (!sevenBlockBag.includes(decidedBlock)) {
    decidedBlock = Math.floor(Math.random() * 7);
  }

  const index = sevenBlockBag.indexOf(decidedBlock);

  switch (decidedBlock) {
    case 0:
      sevenBlockBag.splice(index, 1);
      newNextBlock[1][2] = 1;
      newNextBlock[2][2] = 1;
      newNextBlock[2][3] = 1;
      newNextBlock[1][1] = 1; //Z red

      break;
    case 1:
      sevenBlockBag.splice(index, 1);
      newNextBlock[1][0] = 1;
      newNextBlock[1][1] = 1;
      newNextBlock[1][2] = 1;
      newNextBlock[1][3] = 1; //I waterblue
      break;
    case 2:
      sevenBlockBag.splice(index, 1);
      newNextBlock[2][2] = 1;
      newNextBlock[1][2] = 1;
      newNextBlock[1][1] = 1;
      newNextBlock[2][1] = 1; //o yellow
      break;
    case 3:
      sevenBlockBag.splice(index, 1);
      newNextBlock[1][1] = 1;
      newNextBlock[2][2] = 1;
      newNextBlock[2][3] = 1;
      newNextBlock[2][1] = 1; //j blue
      break;
    case 4:
      sevenBlockBag.splice(index, 1);
      newNextBlock[1][3] = 1;
      newNextBlock[2][2] = 1;
      newNextBlock[2][3] = 1;
      newNextBlock[2][1] = 1; //L orange
      break;
    case 5:
      sevenBlockBag.splice(index, 1);
      newNextBlock[1][2] = 1;
      newNextBlock[2][2] = 1;
      newNextBlock[1][3] = 1;
      newNextBlock[2][1] = 1; //s green
      break;
    case 6:
      sevenBlockBag.splice(index, 1);
      newNextBlock[1][2] = 1;
      newNextBlock[2][2] = 1;
      newNextBlock[2][3] = 1;
      newNextBlock[2][1] = 1; //T purple
      break;
  }
  return newNextBlock;
};

const renewalBlock = (board: number[][], nextBlock: number[][]) => {
  const block = [];
  const newBoard = structuredClone(board);
  const newNextBlock = structuredClone(nextBlock);
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      if (nextBlock[y][x] === 1) {
        block.push([x, y]);
        newNextBlock[y][x] = 0;
      }
    }
  }

  for (const [x, y] of block) {
    newBoard[y - 1][x + 3] = 1;
  }
  return newBoard;
};

const deleteLine = (board: number[][]) => {
  let isLine = 0;
  const deletePos = [];
  const linePos = [];
  const newBoard = structuredClone(board);
  for (let row = 0; row < 20; row++) {
    isLine = board[row].filter((cell) => cell !== 0).length;

    if (isLine === 10) {
      for (let y = 0; y < 20; y++) {
        if (board[y].filter((cell) => cell !== 0).length === 10) {
          linePos.push(y);
          removedLine += 1;
        }
      }
      for (let x = 0; x < 10; x++) {
        for (const row of linePos) deletePos.push([x, row]);
      }

      const deletedBoard: number[][] = changeBlock(newBoard, deletePos, 0);
      for (let x = 0; x < 10; x++) {
        for (let y = 19; y >= 0; y--) {
          if (deletedBoard[y]?.[x] === 2 && y + linePos.length < 20) {
            console.log('linePos', linePos.length);
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
  const newBoard = structuredClone(board);
  const block = makeBlock(newBoard);
  for (const [tx, ty] of block) {
    if (ty === 19 || tx === -1 || newBoard[ty + 1]?.[tx] === 2) {
      for (const [nx, ny] of block) {
        newBoard[ny][nx] = 2;
      }
      console.log(1999);
      canChangeNextBlock = true;
      return newBoard;
    }
  }

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 20; y++) {
      if (
        block[0] !== undefined &&
        block[0].includes(x, y) &&
        newBoard[y + 1]?.[x] !== 2 &&
        block[0][0] !== 19 &&
        block[0][1] !== 19 &&
        block[0][2] !== 19 &&
        block[0][3] !== 19
      ) {
        for (const [tx, ty] of block) {
          if (board[ty] !== undefined) {
            position.push([tx, ty + 1]);
            console.log('removedown');

            newBoard[ty][tx] = 0;
          }
        }
        return changeBlock(newBoard, position, 1);
      }
    }
  }
  console.log(44455);
  return newBoard;
};

const moveLeftBlock = (board: number[][]) => {
  const position = [];
  const newBoard = structuredClone(board);
  const block = makeBlock(newBoard);
  for (let x = 20; x >= 0; x--) {
    for (let y = 0; y < 20; y++) {
      if (
        block[0] !== undefined &&
        block[0].includes(x, y) &&
        newBoard[y]?.[x - 1] !== 2 &&
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
          console.log('removeleft');

          newBoard[ty][tx] = 0;
        }

        return changeBlock(newBoard, position, 1);
      }
    }
  }
  return board;
};

const moveRightBlock = (board: number[][]) => {
  const position = [];
  const block = makeBlock(board);
  const newBoard = structuredClone(board);
  for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 20; y++) {
      if (
        block[0] !== undefined &&
        block[0].includes(x, y) &&
        newBoard[y]?.[x + 1] !== 2 &&
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
          return newBoard;
        }
        for (const [tx, ty] of block) {
          position.push([tx + 1, ty]);
          console.log('removeright');

          newBoard[ty][tx] = 0;
        }

        return changeBlock(newBoard, position, 1);
      }
    }
  }
  return board;
};
// const turnBlock = (block: number[][]) => {
//   const rows = block.length;
//   const cols = block[0].length;
//   const toMove = Array.from({ length: cols }, () => Array(rows).fill(0));

//   for (let y = 0; y < rows; y++) {
//     for (let x = 0; x < cols; x++) {
//       toMove[x][rows - y - 1] = block[y][x];
//     }
//   }
//   return toMove;
// };

// const saveBlock = (board: number[][], holdBlock: number[][]) => {
//   for (let x = 0; x < 10; x++) {
//     for (let y = 0; y < 20; y++) {
//       if (board[y].filter((cell) => cell === 0).length === 10) {
//         board.splice(y, 1);
//       }
//     }
//   }
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

  const [nextBlock, setNextBlock] = useState([
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
  ]);

  // const [holdBlock, setHoldBlock] = useState([
  //   [0, 1, 0, 0],
  //   [0, 1, 0, 0],
  //   [0, 1, 0, 0],
  //   [0, 1, 0, 0],
  // ]);
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let interval = 0;

    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    if (audioRef.current !== null) {
      console.log(330);
      audioRef.current.play();
    }

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  useEffect(() => {
    let isDropping = true;

    if (isActive) {
      downBlock(!isDropping);
      isDropping = false;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  const keyHandler = (event: React.KeyboardEvent) => {
    event.preventDefault();

    if (!isActive) return;
    const key = event.key;
    if (key === 'ArrowDown') {
      console.log(audioRef);
      downBlock(false);
    }
    if (key === 'ArrowLeft') {
      leftBlock();
    }
    if (key === 'ArrowRight') {
      rightBlock();
    }
    if (key === 'ArrowUp') {
      spinBlock();
    }

    if (key === ' ') {
      hardDrop();
    }
    if (key === 'c') {
      console.log('c');
    }
    return;
  };
  const downBlock = (isDropping: boolean) => {
    console.log(5555, isDropping);
    if (isDropping) return board;
    const newBoard = fallBlock(board);

    if (canChangeNextBlock) {
      const deletedBoard = deleteLine(newBoard);
      setNextBlock([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
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
  const spinBlock = () => {
    // const block = makeBlock(board);
    // const turnedBlock = turnBlock(block);
    // setBoard(turnedBlock);
  };

  const switchOnOff = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={styles.container} onKeyDown={keyHandler} tabIndex={0}>
      RemovedLine:{removedLine}
      <div>
        <label>next block</label>
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
      <div>
        <button
          style={{ width: 70, height: 30, fontSize: 20, marginBottom: 10 }}
          onClick={switchOnOff}
        >
          {isActive ? 'pause' : 'start'}
        </button>
        <button style={{ width: 70, height: 30, fontSize: 20, marginBottom: 10 }}>sound</button>
      </div>
      <div className={styles.board}>
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
      <audio ref={audioRef} src="./bgm.mp3" loop />
    </div>
  );
};

export default Home;
