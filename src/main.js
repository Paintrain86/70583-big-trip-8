import utils from './util.js';
import getFilter from './get-filter.js';
import getObjects from './get-objects.js';
import Point from './point.js';
import PointEdit from './point-edit.js';

window.wayDestinations = [`Bologoe`, `Ulan-Ude`, `San-Francisco`, `Tyumen`, `Tegeran`];

const pointsCount = {
  min: 0,
  max: 10,
  default: 7
};

const initFilters = (onChange) => {
  const filterItems = [
    {
      name: `everything`,
      isChecked: true
    },
    {
      name: `future`
    },
    {
      name: `past`
    }
  ];
  const filterBlock = document.querySelector(`.trip-filter`);

  const onFilterChange = (e) => {
    e.preventDefault();

    onChange();
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

const renderPoints = (isFirst) => {
  const pointsBlock = document.querySelector(`.trip-day__items`);
  const count = (isFirst) ? pointsCount.default : utils.getRandomInteger(pointsCount.min, pointsCount.max);
  const points = getObjects(count);

  const renderSinglePoint = (index) => {
    let object = points[index];

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
      points[index] = null;
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
    points[i] = Object.assign({}, points[i], newObject);

    return points[i];
  };

  const createAllPoints = () => {
    pointsBlock.innerHTML = ``;

    for (let i = 0; i < points.length; i++) {
      renderSinglePoint(i);
    }
  };

  createAllPoints();
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
renderPoints(true);
