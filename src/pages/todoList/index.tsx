import React, { FC, useState, useEffect } from "react";
import "./index.less";
// @ts-ignore
import initData from "@/models/todo";

// @ts-ignore
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
  level?: number;
}

const DayTimeList: FC = () => {
  const [hourTitles] = useState(() => {
    return Array.from({ length: 24 }).map(function (_value, index) {
      const hour = index % 24;
      return (hour < 10 ? "0" : "") + hour + ":00";
    });
  });

  const [testData, setTestData] = useState<Array<ToDoItem>>();

  useEffect(() => {
    const res = initData();
    setTestData(res);
    // console.log('ecc',ecc)
  }, []);

  // @ts-ignore
  return (
    <div>
      <div className="day-content">
        <div className="day-hour-bar">
          {hourTitles &&
            hourTitles.map((item, index) => (
              <div className="day-hour-bar-item" key={index}>
                <div id={"hour-bar-" + index} className="item">
                  <div>
                    <span>{item}</span>
                  </div>
                </div>
                <div className="day-hour-context-item-div"></div>
              </div>
            ))}
        </div>
        <div className="day-content-item">
          {testData &&
            testData.map((item) => (
              <div
                className="day-content-item-sub day-content-show"
                style={{
                  position: "absolute",
                  left: item.left + "%",
                  top: item.top + "px",
                  // width: '100%',
                  width: item.width ? item.width + "%" : "100%",
                  height: item.height + "px",
                }}
                key={item.id}
              >
                <span className="day-content-show-tex">{item.id}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DayTimeList;
