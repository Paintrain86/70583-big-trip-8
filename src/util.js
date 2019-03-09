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

export default {
  getRandomInteger: getRandomIntegerFromRange,
  getRandomBoolean: getRandomBooleanValue,
  getRandomFromArray: getRandomValueFromArray,
  getUniqueArray: getUniqueListFromArray,
  insertElements: insertElementsFromHtml
};
