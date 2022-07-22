import dayJs from "dayjs";
interface ToDoItem {
  attachInfoVOList?: null;
  endTime: number;
  id?: number;
  location?: number | null;
  remindTime?: number;
  startTime: number;
  taskDesc?: string;
  title?: string;
  todoStatus?: number;
  userIds?: number | null;
  username?: number | null;
  top?: number;
  height?: number;
  left?: number;
  width?: number;
  hasCollide?: boolean;
  extraSpace?: number;
}
const aps = Array.prototype.slice;
const toDoList: ToDoItem[] = [
  {
    id: 1,
    startTime: 1657299600000, //01:00
    endTime: 1657306800000, // 03:00
    title: "成就和女权",
    width: 0,
    left: 0,
    extraSpace: 0,
    hasCollide: false,
  },
  {
    id: 2,
    startTime: 1657296000000, //00:00
    endTime: 1657303200000, // 01:30
    title: "北京和沟通",
    width: 0,
    left: 0,
    extraSpace: 0,
    hasCollide: false,
  },
  {
    id: 3,
    startTime: 1657303200000, //02:00
    endTime: 1657310400000, // 04:00
    title: "的结题报告如",
    width: 0,
    left: 0,
    extraSpace: 0,
    hasCollide: false,
  },
  {
    id: 4,
    startTime: 1657299600000, //01
    endTime: 1657321200000, // 07
    title: "二极管合同",
    width: 0,
    left: 0,
    extraSpace: 0,
    hasCollide: false,
  },
  {
    id: 5,
    startTime: 1657296000000, //00
    endTime: 1657314000000, // 04
    title: "飞日本和全国",
    width: 0,
    left: 0,
    extraSpace: 0,
    hasCollide: false,
  },
  {
    id: 6,
    startTime: 1657314000000, //05
    endTime: 1657321200000, // 07
    title: "口诀胳膊疼item",
    width: 0,
    left: 0,
    extraSpace: 0,
    hasCollide: false,
  },
  {
    id: 7,
    startTime: 1657344600000, //13:30
    endTime: 1657362600000, // 18:30
    title: "口诀胳膊疼item",
    width: 0,
    left: 0,
    extraSpace: 0,
    hasCollide: false,
  },
];
import { map, pick, bsearch, extend, forEachArr, inArray } from "./uat";

for (let i = 0; i < toDoList.length; i++) {
  for (let j = i; j < toDoList.length; j++) {
    if (toDoList[i].startTime > toDoList[j].startTime) {
      [toDoList[i], toDoList[j]] = [toDoList[j], toDoList[i]];
    }
    if (
      toDoList[i].startTime === toDoList[j].startTime &&
      toDoList[i].endTime < toDoList[j].endTime
    ) {
      [toDoList[i], toDoList[j]] = [toDoList[j], toDoList[i]];
    }
  }
}

const optionsPro = {
  index: 0,
  width: 0,
  ymd: "",
  isToday: false,
  pending: false,
  hourStart: 0,
  hourEnd: 24,
  defaultMarginBottom: 2,
  minHeight: 18.5,
  isReadOnly: false,
};

// 获取有日期重叠的id数据集合
const getCollisionGroup = () => {
  const collisionGroups = [];
  let foundPrevCollisionSchedule = false;
  let previousScheduleList;
  if (!toDoList.length) {
    return collisionGroups;
  }
  // @ts-ignore
  collisionGroups[0] = [toDoList[0].id];
  forEachArr(toDoList.slice(1), function (schedule, index) {
    foundPrevCollisionSchedule = false;
    previousScheduleList = aps.apply(toDoList, [0, index + 1]).reverse();

    forEachArr(previousScheduleList, function (previous) {
      if (collidesWith(schedule, previous)) {
        // If overlapping previous schedules, find a Collision Group of overlapping schedules and add this schedules
        foundPrevCollisionSchedule = true;

        forEachArr(collisionGroups.slice(0).reverse(), function (group) {
          // @ts-ignore
          if (~inArray(previous.id, group)) {
            // If you find a previous schedule that overlaps, include it in the Collision Group to which it belongs.
            group.push(schedule.id);

            return false; // returning false can stop this loop
          }

          return true;
        });

        return false; // returning false can stop this loop
      }

      return true;
    });

    if (!foundPrevCollisionSchedule) {
      // This schedule is a schedule that does not overlap with the previous schedule, so a new Collision Group is constructed.
      // @ts-ignore
      collisionGroups.push([schedule.id]);
    }
  });
  return collisionGroups;
};

// 设置一个矩阵 二维数组
const getMatrices = (collisionGroups) => {
  const result = [];
  forEachArr(collisionGroups, function (group) {
    const matrix = [[]];
    forEachArr(group, function (scheduleID) {
      const schedule = toDoList.find((item) => item.id === scheduleID);
      let col = 0;
      let found = false;
      let nextRow;
      let lastRowInColumn;
      while (!found) {
        lastRowInColumn = getLastRowInColumn(matrix, col);
        if (lastRowInColumn === false) {
          // @ts-ignore
          matrix[0].push(schedule);
          found = true;
        } else {
          // @ts-ignore
          if (!collidesWith(schedule, matrix[lastRowInColumn][col])) {
            nextRow = lastRowInColumn + 1;
            if (!matrix[nextRow]) {
              matrix[nextRow] = [];
            }
            // @ts-ignore
            matrix[nextRow][col] = schedule;
            found = true;
          }
        }
        col += 1;
      }
    });
    // @ts-ignore
    result.push(matrix);
  });

  return result;
};

function getLastRowInColumn(arr2d, col) {
  let row = arr2d.length;
  while (row > 0) {
    row -= 1;
    if (!(arr2d[row][col] === undefined)) {
      return row;
    }
  }
  return false;
}

const getCollides = (matrices) => {
  forEachArr(matrices, function (matrix) {
    const binaryMap = generateTimeArrayInRow(matrix);
    const maxRowLength = Math.max.apply(
      null,
      map(matrix, function (row) {
        return row.length;
      })
    );
    forEachArr(matrix, function (row) {
      forEachArr(row, function (viewModel, col) {
        let hasCollide1, i;
        if (!viewModel) {
          return;
        }
        const startTime = viewModel.startTime;
        const endTime = viewModel.endTime;
        for (i = col + 1; i < maxRowLength; i += 1) {
          hasCollide1 = hasCollide(binaryMap[i - 1], startTime, endTime);
          if (hasCollide1) {
            viewModel.hasCollide = true;
            break;
          }
          viewModel.extraSpace += 1;
        }
      });
    });
  });
};

function generateTimeArrayInRow(matrix) {
  let row,
    col,
    schedule,
    start,
    end,
    cursor = [];

  const map1 = [];
  const maxColLen = Math.max.apply(
    null,
    map(matrix, function (col) {
      return col.length;
    })
  );

  for (col = 1; col < maxColLen; col += 1) {
    row = 0;
    // @ts-ignore
    schedule = pick(matrix, row, col);
    while (schedule) {
      start = schedule.startTime;
      end = schedule.endTime;
      // @ts-ignore
      cursor.push([start, end]);
      row += 1;
      // @ts-ignore
      schedule = pick(matrix, row, col);
    }
    // @ts-ignore
    map1.push(cursor);
    cursor = [];
  }
  return map1;
}

const collidesWith = (a: ToDoItem, b: ToDoItem) => {
  if (
    (b.startTime > a.startTime && b.startTime < a.endTime) ||
    (b.endTime > a.startTime && b.endTime < a.endTime) ||
    (b.startTime <= a.startTime && b.endTime >= a.endTime)
  ) {
    return true;
  }
  return false;
};

function hasCollide(arr, start, end) {
  const getFunc = function (index) {
    return function (block) {
      return block[index];
    };
  };
  const abs = Math.abs;
  const compare = (_a, _b) => {
    const a = Number(_a),
      b = Number(_b);

    return a - b;
  };

  if (!arr.length) {
    return false;
  }

  const startStart = abs(bsearch(arr, start, getFunc(0), compare));
  const startEnd = abs(bsearch(arr, start, getFunc(1), compare));
  const endStart = abs(bsearch(arr, end, getFunc(0), compare));
  const endEnd = abs(bsearch(arr, end, getFunc(1), compare));
  const hasCollide = !(
    startStart === startEnd &&
    startEnd === endStart &&
    endStart === endEnd
  );

  return hasCollide;
}

const _getBaseViewModel = (matrices, containerHeight) => {
  const options = optionsPro;
  const isReadOnly = options.isReadOnly;
  let todayStart, baseMS;

  forEachArr(matrices, function (matrix) {
    const maxRowLength = Math.max.apply(
      null,
      map(matrix, function (row) {
        return row.length;
      })
    );

    const widthPercent = 100 / maxRowLength;

    const leftPercents = [];
    for (let i = 0; i < maxRowLength; i += 1) {
      // @ts-ignore
      leftPercents[i] = widthPercent * i;
    }

    forEachArr(matrix, function (row) {
      forEachArr(row, function (viewModel, col) {
        if (!viewModel) {
          return;
        }
        const viewBound = getScheduleViewBound(viewModel, {
          todayStart: todayStart,
          baseMS: baseMS,
          baseLeft: leftPercents,
          baseWidth: widthPercent,
          baseHeight: containerHeight,
          columnIndex: col,
          isReadOnly: isReadOnly,
        });

        extend(viewModel, viewBound);
      });
    });
  });
};

const getScheduleViewBound = (viewModel, options) => {
  const boundX = _getScheduleViewBoundX(viewModel, options);
  return boundX;
};

// 设置y轴数据
const _getScheduleViewBoundX = (viewModel, options) => {
  let width = options.baseWidth * (viewModel.extraSpace + 1);
  // set width auto when has no collisions.
  if (!viewModel.hasCollide) {
    // @ts-ignore
    width = null;
  }

  return {
    left: options.baseLeft[options.columnIndex],
    width: width,
  };
};

// 处理数据
const handleDataList = () => {
  const collisionGroup = getCollisionGroup();
  const matrices = getMatrices(collisionGroup);
  getCollides(matrices);
  _getBaseViewModel(matrices, 500);
  return matrices;
};

// 计算top height
const handleTime = (startTime: number, endTime: number) => {
  const startH = dayJs(startTime).hour();
  const startM = dayJs(startTime).minute();
  const top = startH * 46 + (startM / 60) * 46;
  const height = ((endTime - startTime) / 1000 / 60 / 60) * 46 - 2;
  return [top, height];
};

function flatten(arr: []) {
  while (arr.some((item) => Array.isArray(item))) {
    // @ts-ignore
    arr = [].concat(...arr);
  }
  return arr;
}

const initData = () => {
  toDoList.forEach((item) => {
    const [top, height] = handleTime(item.startTime, item.endTime);
    item.top = top;
    item.height = height;
  });
  const res = handleDataList();
  // @ts-ignore
  return flatten(res);
};

export default initData;
