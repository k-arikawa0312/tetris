import styles from './index.module.css';
import React, { useEffect, useState, useRef } from 'react';

let canChangeNextBlock = true;
let removedLine = 0;
const tetrisMino = [
  [
    [0, 1, 0],
    [1, 1, 1],
  ],

  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
];

//中心座標を計算してここから回転先を作りそれを適応

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
      if (board[y]?.[x] < 10 && board[y]?.[x] !== 0) {
        block.push([x, y]);
      }
    }
  }

  return block;
};
const changeNextBlock = (nextBlock: number[][], index: number) => {
  const newNextBlock = structuredClone(nextBlock);
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      newNextBlock[y][x] = 0;
    }
  }

  switch (index) {
    case 0:
      newNextBlock[1][2] = 1;
      newNextBlock[2][2] = 1;
      newNextBlock[2][3] = 1;
      newNextBlock[2][1] = 1; //T purple
      break;
    case 1:
      newNextBlock[1][0] = 2;
      newNextBlock[1][1] = 2;
      newNextBlock[1][2] = 2;
      newNextBlock[1][3] = 2; //I waterblue
      break;
    case 2:
      newNextBlock[2][2] = 3;
      newNextBlock[1][2] = 3;
      newNextBlock[1][1] = 3;
      newNextBlock[2][1] = 3; //o yellow
      break;
    case 3:
      newNextBlock[1][1] = 4;
      newNextBlock[2][2] = 4;
      newNextBlock[2][3] = 4;
      newNextBlock[2][1] = 4; //j blue
      break;
    case 4:
      newNextBlock[1][3] = 5;
      newNextBlock[2][2] = 5;
      newNextBlock[2][3] = 5;
      newNextBlock[2][1] = 5; //L orange
      break;
    case 5:
      newNextBlock[1][2] = 6;
      newNextBlock[2][2] = 6;
      newNextBlock[1][3] = 6;
      newNextBlock[2][1] = 6; //s green
      break;
    case 6:
      newNextBlock[1][2] = 7;
      newNextBlock[2][2] = 7;
      newNextBlock[2][3] = 7;
      newNextBlock[1][1] = 7; //Z red
      break;
  }
  return newNextBlock;
};

const renewalBlock = (board: number[][], nextBlock: number[][], kindOfBlock: number) => {
  const block = [];
  const newBoard = structuredClone(board);
  const newNextBlock = structuredClone(nextBlock);
  console.table(nextBlock);
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      if (nextBlock[y][x] !== 0) {
        block.push([x, y]);
        newNextBlock[y][x] = 0;
        console.log('asdd');
      }
    }
  }

  console.log(41655220);
  console.log(block);
  for (const [x, y] of block) {
    console.log(4111);
    newBoard[y - 1][x + 3] = kindOfBlock + 1;
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
            deletedBoard[y + linePos.length][x] = deletedBoard[y][x];
            deletedBoard[y][x] = 0;
          }
        }
      }
      return deletedBoard;
    }
  }
  return board;
};

const fallBlock = (board: number[][], kindOfBlock: number) => {
  const position = [];
  const newBoard = structuredClone(board);
  const block = makeBlock(newBoard);
  console.log(block);
  for (const [tx, ty] of block) {
    if (ty === 19 || tx === -1 || newBoard[ty + 1]?.[tx] >= 11) {
      for (const [nx, ny] of block) {
        newBoard[ny][nx] = newBoard[ny][nx] + 10;
      }
      canChangeNextBlock = true;
      return newBoard;
    }
  }

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 20; y++) {
      if (
        block[0] !== undefined &&
        block[0].includes(x, y) &&
        newBoard[y + 1]?.[x] < 11 &&
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
        return changeBlock(newBoard, position, kindOfBlock + 1);
      }
    }
  }
  return newBoard;
};

const moveLeftBlock = (board: number[][], kindOfBlock: number) => {
  const position = [];
  const newBoard = structuredClone(board);
  const block = makeBlock(newBoard);
  for (let x = 20; x >= 0; x--) {
    for (let y = 0; y < 20; y++) {
      if (
        block[0] !== undefined &&
        block[0].includes(x, y) &&
        newBoard[y]?.[x - 1] < 11 &&
        block[0]?.[0] !== 0 &&
        block[1]?.[0] !== 0 &&
        block[2]?.[0] !== 0 &&
        block[3]?.[0] !== 0
      ) {
        let noLeftBlock = 0;

        for (const [tx, ty] of block) {
          if (board[ty][tx - 1] >= 11) {
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

        return changeBlock(newBoard, position, kindOfBlock + 1);
      }
    }
  }
  return board;
};

const moveRightBlock = (board: number[][], kindOfBlock: number) => {
  const position = [];
  const block = makeBlock(board);
  const newBoard = structuredClone(board);
  for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 20; y++) {
      if (
        block[0] !== undefined &&
        block[0].includes(x, y) &&
        newBoard[y]?.[x + 1] < 11 &&
        block[0]?.[0] !== 9 &&
        block[1]?.[0] !== 9 &&
        block[2]?.[0] !== 9 &&
        block[3]?.[0] !== 9
      ) {
        let noRightBlock = 0;

        for (const [tx, ty] of block) {
          if (board[ty][tx + 1] >= 11) {
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

        return changeBlock(newBoard, position, kindOfBlock + 1);
      }
    }
  }
  return board;
};

const turnBlock = (board: number[][], tetrisMino: number[][][], kindOfBlock: number) => {
  const newTetrisMino = structuredClone(tetrisMino);
  const newBoard = structuredClone(board);
  const block = makeBlock(board);
  let sumX = 0;
  let sumY = 0;
  for (let n = 0; n < 4; n++) {
    sumX += block[n][0];
    sumY += block[n][1];
  }
  const centerOfBlockX = Math.floor(sumX / 4);
  const centerOfBlockY = sumY / 4;
  console.log(centerOfBlockX, centerOfBlockY, 'center');

  const rows = newTetrisMino[kindOfBlock].length;
  const cols = newTetrisMino[kindOfBlock][0].length;
  const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      rotated[x][rows - y - 1] = newTetrisMino[y][x];
    }
  }
  // for (let y=0;y<20;y++){
  //   for (let x=0;x<10;x++){
  //     board[centerOfBlockY][centerOfBlockY]
  //   }
  // }
  return newBoard;
};

const Home = () => {
  const [board, setBoard] = useState([
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
    // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [11, 12, 13, 14, 15, 16, 17, 11, 0, 14],
    [11, 12, 13, 14, 15, 16, 17, 12, 0, 15],
    [11, 12, 13, 14, 15, 16, 17, 13, 0, 16],
  ]);

  const [kindOfBlock, setKindOfBlock] = useState(Math.floor(Math.random() * 7));
  const [nextBlock, setNextBlock] = useState([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
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
  const sevenBlockBag: number[] = [];

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let interval = 0;

    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    if (audioRef.current !== null) {
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
      // spinBlock();
      console.log();
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
    if (isDropping) return board;
    const newBoard = fallBlock(board, kindOfBlock);

    if (canChangeNextBlock) {
      const deletedBoard = deleteLine(newBoard);
      let decidedBlock = Math.floor(Math.random() * 7);

      if (sevenBlockBag.length === 0) {
        for (let n = 0; n < 7; n++) {
          sevenBlockBag.push(n);
        }
      }
      while (!sevenBlockBag.includes(decidedBlock)) {
        decidedBlock = Math.floor(Math.random() * 7);
      }
      const index = sevenBlockBag.indexOf(decidedBlock);
      sevenBlockBag.splice(index, 1);
      const newKindOfBlock = index;
      setKindOfBlock(newKindOfBlock);
      const newNextBlock = changeNextBlock(nextBlock, kindOfBlock);
      setNextBlock((newNextBlock) => changeNextBlock(newNextBlock, kindOfBlock));
      console.log(newNextBlock);
      const renewalBoard = renewalBlock(deletedBoard, nextBlock, kindOfBlock);
      setBoard(renewalBoard);
      canChangeNextBlock = false;
    } else {
      setBoard(newBoard);
    }
  };
  const leftBlock = () => {
    const newBoard = moveLeftBlock(board, kindOfBlock);
    setBoard(newBoard);
  };
  const rightBlock = () => {
    const newBoard = moveRightBlock(board, kindOfBlock);
    setBoard(newBoard);
  };
  const hardDrop = () => {
    let newBoard = board;
    let wasDropped = false;

    do {
      const tempBoard = fallBlock(newBoard, kindOfBlock);

      wasDropped = newBoard !== tempBoard;

      newBoard = tempBoard;
    } while (wasDropped);
    setBoard(newBoard);
  };
  // const spinBlock = () => {
  //   const newBoard = turnBlock(board, tetrisMino, kindOfBlock);
  //   setBoard(newBoard);
  // };

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
                {display === 0 && (
                  <div
                    className={styles.stone}
                    style={{
                      background: '#000000',
                    }}
                  />
                )}
                {(display === 1 || display === 11) && (
                  <div
                    className={styles.stone}
                    style={{
                      background: '#b700ff',
                    }}
                  />
                )}
                {(display === 2 || display === 12) && (
                  <div
                    className={styles.stone}
                    style={{
                      background: '#01d8e7',
                    }}
                  />
                )}
                {(display === 3 || display === 13) && (
                  <div
                    className={styles.stone}
                    style={{
                      background: '#d9ff00',
                    }}
                  />
                )}
                {(display === 4 || display === 14) && (
                  <div
                    className={styles.stone}
                    style={{
                      background: '#2600ff',
                    }}
                  />
                )}
                {(display === 5 || display === 15) && (
                  <div
                    className={styles.stone}
                    style={{
                      background: '#ff8800',
                    }}
                  />
                )}
                {(display === 6 || display === 16) && (
                  <div
                    className={styles.stone}
                    style={{
                      background: '#0aa331',
                    }}
                  />
                )}
                {(display === 7 || display === 17) && (
                  <div
                    className={styles.stone}
                    style={{
                      background: '#ff0000',
                    }}
                  />
                )}
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
              {display === 0 && (
                <div
                  className={styles.stone}
                  style={{
                    background: '#000000',
                  }}
                />
              )}
              {(display === 1 || display === 11) && (
                <div
                  className={styles.stone}
                  style={{
                    background: '#b700ff',
                  }}
                />
              )}
              {(display === 2 || display === 12) && (
                <div
                  className={styles.stone}
                  style={{
                    background: '#01d8e7',
                  }}
                />
              )}
              {(display === 3 || display === 13) && (
                <div
                  className={styles.stone}
                  style={{
                    background: '#d9ff00',
                  }}
                />
              )}
              {(display === 4 || display === 14) && (
                <div
                  className={styles.stone}
                  style={{
                    background: '#2600ff',
                  }}
                />
              )}
              {(display === 5 || display === 15) && (
                <div
                  className={styles.stone}
                  style={{
                    background: '#ff8800',
                  }}
                />
              )}
              {(display === 6 || display === 16) && (
                <div
                  className={styles.stone}
                  style={{
                    background: '#0aa331',
                  }}
                />
              )}
              {(display === 7 || display === 17) && (
                <div
                  className={styles.stone}
                  style={{
                    background: '#ff0000',
                  }}
                />
              )}
            </div>
          )),
        )}
      </div>
      <audio ref={audioRef} src="./bgm.mp3" loop />
    </div>
  );
};
//動いてるやつ10足す動いてないやつ１０引く

export default Home;
