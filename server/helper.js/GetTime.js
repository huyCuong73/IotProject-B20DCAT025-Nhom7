import moment from "moment-timezone";


export function getTime(timezone) {

  let date = moment().tz(timezone);

  let formatted = date.format('DD-MM-YYYY HH:mm:ss');

  return formatted;
}
























































































function compareDates(a, b) {
    let dateA = new Date(a);
    let dateB = new Date(b);
    return dateA - dateB;
}

function sortArrayByDate(array, order) {
    let sortedArray = [...array];
    sortedArray.sort((a, b) => compareDates(a.date, b.date));
    if (order === -1) {
      sortedArray.reverse();
    }
    return sortedArray;
}

