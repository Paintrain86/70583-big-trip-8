import getFilter from './get-filter.js';
import getPoint from './get-point.js';

(function initPage() {
  const pointsCount = {
    min: 0,
    max: 10,
    default: 7
  };

  const getRandomIntegerFromRange = (min = 0, max = 5) => Math.floor(min + Math.random() * (max - min));

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
      filterBlock.insertAdjacentHTML(`afterBegin`, filtersHtml);
      filterBlock.addEventListener(`change`, onFilterChange);
    };

    renderFilters(filterItems);
  };

  const renderPoints = (isFirst) => {
    const pointsBlock = document.querySelector(`.trip-day__items`);
    const count = (isFirst) ? pointsCount.default : getRandomIntegerFromRange(pointsCount.min, pointsCount.max);
    let pointsHtml = ``;

    for (let i = 1; i <= count; i++) {
      pointsHtml += getPoint();
    }

    pointsBlock.innerHTML = ``;
    pointsBlock.insertAdjacentHTML(`afterBegin`, pointsHtml);
  };

  initFilters(renderPoints);
  renderPoints(true);
})();
