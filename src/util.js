const Codes = {
  'ESCAPE': 27
};

const getTwoDigitsString = (num) => (num > 9) ? `${num}` : `0${num}`;

const getHoursAndMinutesString = (date) => `${getTwoDigitsString(date.getHours())}:${getTwoDigitsString(date.getMinutes())}`;

const getTimeDifferenceString = (dateStart, dateEnd) => {
  const timestampDiff = dateEnd.getTime() - dateStart.getTime();
  const daysDiff = Math.floor(timestampDiff / (24 * 60 * 60 * 1000));
  const hoursDiff = Math.floor((timestampDiff - daysDiff * 24 * 60 * 60 * 1000) / (60 * 60 * 1000));
  const minutesDiff = Math.floor((timestampDiff - daysDiff * 24 * 60 * 60 * 1000 - hoursDiff * 60 * 60 * 1000) / (60 * 1000));

  return `${(daysDiff > 0) ? `${daysDiff}d ` : ``}${hoursDiff}h ${minutesDiff}m`;
};

const getRandomIntegerFromRange = (min = 0, max = 5) => Math.floor(min + Math.random() * (max - min));

const getRandomBooleanValue = () => Math.random() >= 0.5;

const getRandomValueFromArray = (array) => array[getRandomIntegerFromRange(0, array.length)];

const getUniqueListFromArray = (count, array) => {
  const tempArray = array.slice();
  const resultArray = [];
  const maxCount = (array.length > count) ? count : array.length;

  for (let i = 0; i < maxCount; i++) {
    resultArray.push(tempArray.splice(getRandomIntegerFromRange(0, tempArray.length), 1)[0]);
  }

  return resultArray;
};

const insertElementsFromHtml = (parent, htmlString) =>{
  const parser = new DOMParser();
  const html = parser.parseFromString(htmlString, `text/html`);
  const fragment = document.createDocumentFragment();

  html.body.childNodes.forEach((node) => {
    fragment.appendChild(node);
  });

  parent.appendChild(fragment);
};

const createSingleElement = (elemHtml) => {
  const newElement = document.createElement(`div`);

  insertElementsFromHtml(newElement, elemHtml);
  return newElement.firstChild;
};

export default {
  keyCodes: Codes,
  getTwoDigits: getTwoDigitsString,
  getHoursAndMinutes: getHoursAndMinutesString,
  getTimeDifference: getTimeDifferenceString,
  getRandomInteger: getRandomIntegerFromRange,
  getRandomBoolean: getRandomBooleanValue,
  getRandomFromArray: getRandomValueFromArray,
  getUniqueArray: getUniqueListFromArray,
  insertElements: insertElementsFromHtml,
  createElement: createSingleElement
};
