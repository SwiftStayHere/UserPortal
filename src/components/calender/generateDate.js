import dayjs from "dayjs";
import "dayjs/locale/it";

dayjs.locale("it");

const generateDate = (month = dayjs().month(), year = dayjs().year()) => {
  const firstDateOfMonth = dayjs().year(year).month(month).startOf("month");
  const lastDateOfMonth = dayjs().year(year).month(month).endOf("month");

  const arrayOfDate = [];

  // create prefix date
  for (let i = 0; i < firstDateOfMonth.day(); i++) {
    arrayOfDate.unshift({
      date: lastDateOfMonth.date(-i),
      current: false,
      hide: true,
    });
  }

  //   generate current date
  for (let i = firstDateOfMonth.date(); i <= lastDateOfMonth.date(); i++) {
    const today = dayjs();
    const passDate = firstDateOfMonth.date(i);

    if (today.diff(passDate, "day") <= 0) {
      arrayOfDate.push({
        date: firstDateOfMonth.date(i),
        current: true,
        hide: false,
        today:
          firstDateOfMonth.date(i).toDate().toDateString() ===
          dayjs().toDate().toDateString(),
      });
    } else {
      arrayOfDate.push({
        date: firstDateOfMonth.date(i),
        current: false,
        hide: false,
        today:
          firstDateOfMonth.date(i).toDate().toDateString() ===
          dayjs().toDate().toDateString(),
      });
    }
  }

  //generate suffix
  const remaining = 35 - arrayOfDate.length;

  for (
    let i = lastDateOfMonth.date() + 1;
    i <= lastDateOfMonth.date() + remaining;
    i++
  ) {
    arrayOfDate.push({
      date: lastDateOfMonth.date(i),
      current: false,
      hide: true,
    });
  }

  return arrayOfDate;
};

export default generateDate;
