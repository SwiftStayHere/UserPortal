import { useEffect } from "react";
import generateDate from "./generateDate";
import specialDate from "./spisalDate";

export default function CalenderItem({ data = {}, select = [] }) {
  const days = ["D", "L", "M", "M", "G", "V", "S"];
  const dates = generateDate(data?.month, data?.year);

  useEffect(() => {
    const sl = document.querySelectorAll(".inselect");

    if (sl.length > 0) {
      sl[0].classList.add("frist");
      sl[sl.length - 1].classList.add("last");
    }
  }, [select.selectDate, data]);

  return (
    <div className="calender-item-wrp">
      <div className="calender-item-head">
        <strong> {dates[14].date.format("MMMM")}</strong>
        <span> {dates[14].date.year()}</span>
      </div>
      <div className="calender-item">
        {days.map((d, i) => (
          <div key={i} className="date">
            <p>{d}</p>
          </div>
        ))}
        {dates.map(({ date, current, today, hide }, i) => (
          <div
            key={i}
            className={` date ${
              (current && specialDate.cheap.includes(date.date()) && "cheap") ||
              (current &&
                specialDate.medium.includes(date.date()) &&
                "medium") ||
              (current &&
                specialDate.expensive.includes(date.date()) &&
                "expensive") ||
              ""
            } ${
              (select &&
                date &&
                select?.selectDate.includes(date.valueOf()) &&
                "selected") ||
              date
            } ${
              current &&
              select.selectDate.length === 2 &&
              current &&
              select.selectDate[0].valueOf() <= date.valueOf() &&
              current &&
              select.selectDate[1].valueOf() >= date.valueOf() &&
              "inselect"
            }`}
          >
            <button
              onClick={
                (current && (() => select.handler(date.valueOf()))) || null
              }
              className={`${(!current && "desable") || ""} ${
                (today && "today") || ""
              } ${(hide && "hide") || ""}  `}
            >
              {date.date()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
