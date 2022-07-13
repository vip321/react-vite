import React, { FC, useState, useEffect } from "react";
import "./index.less";

interface Interface {
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
  left?: string;
  width?: string;
  column?: any;
}

const DayTimeList: FC = () => {
  const [hourTitles] = useState(() => {
    return Array.from({ length: 24 }).map(function (_value, index) {
      const hour = index % 24;
      return (hour < 10 ? "0" : "") + hour + ":00";
    });
  });

  const [testData, setTestData] = useState<Array<Interface>>();

  useEffect(() => {
    const res: Array<Interface> = [
      {
        id: 1,
        startTime: 1657299600000, //01
        endTime: 1657306800000, // 03
        title: "成就和女权",
        width: "25%",
        left: "0%",
      },
      {
        id: 2,
        startTime: 1657296000000, //01
        endTime: 1657301400000, // 03
        title: "北京和沟通",
        width: "25%",
        left: "25%",
      },
      {
        id: 3,
        startTime: 1657303200000, //02
        endTime: 1657310400000, // 04
        title: "的结题报告如",
        width: "25%",
        left: "25%",
      },
      {
        id: 4,
        startTime: 1657299600000, //01
        endTime: 1657306800000, // 03
        title: "二极管合同",
        width: "25%",
        left: "50%",
      },
      {
        id: 5,
        startTime: 1657296000000, //00
        endTime: 1657310400000, // 06
        title: "飞日本和全国",
        width: "25%",
        left: "75%",
      },
      {
        id: 6,
        startTime: 1657314000000, //05
        endTime: 1657321200000, // 07
        title: "口诀胳膊疼item",
        width: "25%",
        left: "0",
      },
      {
        id: 7,
        startTime: 1657344600000, //05
        endTime: 1657362600000, // 07
        title: "口诀胳膊疼item",
        width: "100%",
        left: "0",
      },
    ];
    setTestData(res);
  }, []);
  // 判断与其他是否有重叠
  const isOverlap = (StartA, EndA, StartB, EndB) => {
    const getT = (t) => new Date(t);
    return !(getT(EndA) <= getT(StartB) || getT(StartA) >= getT(EndB));
  };

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
                  left: item.left,
                  top: item.top + "px",
                  // width: "100%",
                  width: item.width,
                  height: item.height + "px",
                }}
                key={item.id}
              >
                <span className="day-content-show-tex">
                  {item.title}-{item.id}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DayTimeList;
