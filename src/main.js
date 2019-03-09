import getFilter from './get-filter.js';
import getObjects from './get-objects.js';
import getPoint from './get-point.js';
import utils from './util.js';

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
  const objects = getObjects(count);

  const pointsHtml = objects.map((object) => getPoint(object)).join(``);

  pointsBlock.innerHTML = ``;
  utils.insertElements(pointsBlock, pointsHtml);
};

initFilters(renderPoints);
renderPoints(true);
