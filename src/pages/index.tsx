import styles from './index.module.css';
import React, { useEffect, useState, useRef } from 'react';

let canChangeNextBlock = true;
let removedLine = 0;

//中心座標を計算してここから回転先を作りそれを適

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
const nowKindOfBlock = (board: number[][]) => {
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 20; y++) {
      if (board[y][x] !== undefined && board[y][x] !== 0 && board[y][x] < 11) {
        return board[y][x];
      }
    }
  }
  return 1;
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

const renewalBlock = (board: number[][], nextBlock: number[][]) => {
  const block = [];
  const newBoard = structuredClone(board);
  let kindOfBlock = 0;
  // const newNextBlock = structuredClone(nextBlock);
  console.table(nextBlock);
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      if (nextBlock[y][x] !== 0) {
        block.push([x, y]);
        kindOfBlock = nextBlock[y][x];
      }
    }
  }
  for (const [x, y] of block) {
    if (newBoard[y - 1][x + 3] !== 0) {
      alert('gameover');
      return newBoard;
    }
  }
  for (const [x, y] of block) {
    newBoard[y - 1][x + 3] = kindOfBlock;
  }
  return newBoard;
};

const deleteLine = (board: number[][]) => {
  let isLine = 0;
  const deletePos = [];
  const linePos = [];
  const newBoard = structuredClone(board);
  for (let row = 0; row < 20; row++) {
    isLine = newBoard[row].filter((cell) => cell !== 0).length;

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
      const tempDeletedBoard: number[][] = structuredClone(deletedBoard);
      for (let y = 19; y >= 0; y--) {
        for (let x = 0; x < 10; x++) {
          if (deletedBoard[y]?.[x] >= 11 && y + linePos.length < 20) {
            console.log('linePos', linePos.length);
            deletedBoard[y + linePos.length][x] = tempDeletedBoard[y][x];
            deletedBoard[y][x] = 0;
            console.table(deletedBoard);
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

            newBoard[ty][tx] = 0;
          }
        }
        return changeBlock(newBoard, position, nowKindOfBlock(board));
      }
    }
  }
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

          newBoard[ty][tx] = 0;
        }

        return changeBlock(newBoard, position, nowKindOfBlock(board));
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

          newBoard[ty][tx] = 0;
        }

        return changeBlock(newBoard, position, nowKindOfBlock(board));
      }
    }
  }
  return board;
};
const rotateBlock = (board: number[][]) => {
  const block = makeBlock(board);
  const kindOfBlock = nowKindOfBlock(board);
  let slideX = 0;
  let slideY = 0;

  if (block.length !== 4) {
    return board; // 安全策: ブロックが正しい形状でない場合は回転しない
  }

  const pivot = block[1]; // ピボットをブロックの中心に設定
  const newBlock = block.map(([x, y]) => {
    const relativeX = x - pivot[0];
    const relativeY = y - pivot[1];
    return [pivot[0] - relativeY, pivot[1] + relativeX]; // 90度回転
  });

  for (const [x, y] of newBlock) {
    if (x < 0) {
      while (x + slideX < 0) {
        slideX += 1;
      }
    }
    if (x >= 10) {
      while (x + slideX >= 10) {
        slideX -= 1;
      }
    }
    if (y < 0) {
      while (y + slideY < 0) {
        slideY += 1;
      }
    }
    if (y >= 20) {
      while (y + slideY >= 20) {
        slideY += 1;
      }
    }
    // if (board[y][x] >= 11) {
    // }
  }

  const newBoard = structuredClone(board);
  for (const [x, y] of block) {
    newBoard[y][x] = 0;
  }

  for (const [x, y] of newBlock) {
    newBoard[y + slideY][x + slideX] = kindOfBlock;
  }

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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const [kindOfBlock, setKindOfBlock] = useState([Math.floor(Math.random() * 7), 0]);
  const [nextBlock, setNextBlock] = useState(
    changeNextBlock(
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      Math.floor(Math.random() * 7),
    ),
  );

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
      downBlock(false);
    } else if (key === 'ArrowLeft') {
      leftBlock();
    } else if (key === 'ArrowRight') {
      rightBlock();
    } else if (key === 'ArrowUp') {
      spinBlock();
    } else if (key === ' ') {
      hardDrop();
    } else if (key === 'c') {
      console.log('c');
    }
    return;
  };
  const downBlock = (isDropping: boolean) => {
    if (isDropping) return board;
    const newBoard = fallBlock(board);
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
      setKindOfBlock([nowKindOfBlock(board), newKindOfBlock]);

      const renewalBoard = renewalBlock(deletedBoard, nextBlock);

      setBoard(renewalBoard);
      const newNextBlock = changeNextBlock(nextBlock, kindOfBlock[1]);
      setNextBlock(newNextBlock);
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
    const newBoard = rotateBlock(board);
    setBoard(newBoard);
  };

  const switchOnOff = () => {
    setIsActive(!isActive);
  };

  const resetGame = () => {
    setBoard([
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
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
    setIsActive(false);
    canChangeNextBlock = true;
    setSeconds(0);
    removedLine = 0;
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
                {display === 0 && <div className={styles.emptyCell} />}
                {(display === 1 || display === 11) && <div className={styles.purpleStone} />}
                {(display === 2 || display === 12) && <div className={styles.skyblueStone} />}
                {(display === 3 || display === 13) && <div className={styles.yellowStone} />}
                {(display === 4 || display === 14) && <div className={styles.blueStone} />}
                {(display === 5 || display === 15) && <div className={styles.orangeStone} />}
                {(display === 6 || display === 16) && <div className={styles.greenStone} />}
                {(display === 7 || display === 17) && <div className={styles.redStone} />}
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
        <button
          style={{ width: 70, height: 30, fontSize: 20, marginBottom: 10 }}
          onClick={resetGame}
        >
          reset
        </button>
      </div>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((display, x) => (
            <div className={styles.cell} key={`${x}-${y}`}>
              {display === 0 && <div className={styles.emptyCell} />}
              {(display === 1 || display === 11) && <div className={styles.purpleStone} />}
              {(display === 2 || display === 12) && <div className={styles.skyblueStone} />}
              {(display === 3 || display === 13) && <div className={styles.yellowStone} />}
              {(display === 4 || display === 14) && <div className={styles.blueStone} />}
              {(display === 5 || display === 15) && <div className={styles.orangeStone} />}
              {(display === 6 || display === 16) && <div className={styles.greenStone} />}
              {(display === 7 || display === 17) && <div className={styles.redStone} />}
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
