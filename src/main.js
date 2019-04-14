import utils from './util.js';
import getFilter from './get-filter.js';
import getObjects from './get-objects.js';
import Point from './point.js';
import PointEdit from './point-edit.js';

window.wayDestinations = [`Bologoe`, `Ulan-Ude`, `San-Francisco`, `Tyumen`, `Tegeran`];

const pointsCount = 10;
const points = getObjects(pointsCount);

const initFilters = (onChange) => {
  const filterItems = [{
    name: `everything`,
    isChecked: true
  },
  {
    name: `future`
  },
  {
    name: `past`
  }];
  const filterBlock = document.querySelector(`.trip-filter`);

  const onFilterChange = (e) => {
    e.preventDefault();
    let filteredPoints = [];

    switch (e.target.value) {
      case `future`:
        filteredPoints = points.filter((point) => point && Date.now() < point.timeStart.getTime());
        break;
      case `past`:
        filteredPoints = points.filter((point) => point && Date.now() >= point.timeStart.getTime());
        break;
      default:
        filteredPoints = points;
    }

    onChange(filteredPoints);
  };

  const renderFilters = (filters) => {
    const filtersHtml = filters.map((item) => {
      return getFilter(item.name, item.isChecked);
    }).join(``);

    filterBlock.innerHTML = ``;
    utils.insertElements(filterBlock, filtersHtml);
    filterBlock.addEventListener(`change`, onFilterChange);
  };

  renderFilters(filterItems);
};

const renderPoints = (pointsArr) => {
  const pointsBlock = document.querySelector(`.trip-day__items`);

  const renderSinglePoint = (index) => {
    let object = pointsArr[index];

    if (!object) {
      return;
    }

    object.destinationPoint = utils.getRandomFromArray(window.wayDestinations);

    const point = new Point(object);
    const pointEdit = new PointEdit(object);

    point.onEdit = () => {
      pointEdit.render();
      pointsBlock.replaceChild(pointEdit.element, point.element);
      point.unrender();
    };

    pointEdit.onReset = () => {
      point.render();
      pointsBlock.replaceChild(point.element, pointEdit.element);
      pointEdit.unrender();
    };

    pointEdit.onDelete = () => {
      pointsBlock.removeChild(pointEdit.element);
      pointEdit.unrender();
      pointsArr[index] = null;
    };

    pointEdit.onSubmit = (newObject) => {
      point.update(updatePoint(newObject, index));
      point.render();
      pointsBlock.replaceChild(point.element, pointEdit.element);
      pointEdit.unrender();
    };

    pointsBlock.appendChild(point.render());
  };

  const updatePoint = (newObject, i) => {
    pointsArr[i] = Object.assign({}, pointsArr[i], newObject);

    return pointsArr[i];
  };

  pointsBlock.innerHTML = ``;

  for (let i = 0; i < pointsArr.length; i++) {
    renderSinglePoint(i);
  }
};

const setPageTitle = () => {
  const title = document.querySelector(`.trip__points`);

  const getNewTitleHtml = () => {
    return window.wayDestinations.map((dest, i) => {
      return (i === 0) ? `${dest}` : `&nbsp;&mdash; ${dest}`;
    }).join(``);
  };

  const newTitleHtml = `<h1 class="trip__points">${getNewTitleHtml()}</h1>`;

  title.parentNode.replaceChild(utils.createElement(newTitleHtml), title);
};

setPageTitle();
initFilters(renderPoints);
renderPoints(points);
