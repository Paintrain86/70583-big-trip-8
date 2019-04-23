import utils from './util.js';
import Filter from './filter.js';
import Point from './point.js';
import PointEdit from './point-edit.js';
import Stats from './stats.js';
import Request from './request.js';

const END_POINT = `https://es8-demo-srv.appspot.com/big-trip/`;
const AUTHORIZATION = `Basic HalleLuYa=1`;

const request = new Request({
  endPoint: END_POINT,
  auth: AUTHORIZATION
});

const initFilters = (pointsArr, onChange) => {
  const filter = new Filter();
  const filterBlock = document.querySelector(`.trip-filter`);

  filter.onFilter = (value) => {
    let filteredPoints = [];

    switch (value) {
      case `future`:
        filteredPoints = pointsArr.filter((point) => point && Date.now() < point.timeStart.getTime());
        break;
      case `past`:
        filteredPoints = pointsArr.filter((point) => point && Date.now() >= point.timeStart.getTime());
        break;
      default:
        filteredPoints = pointsArr;
    }

    onChange(filteredPoints);
  };

  filter.render();
  filterBlock.parentNode.replaceChild(filter.element, filterBlock);
};

const renderPoints = (pointsArr) => {
  const pointsBlock = document.querySelector(`.trip-day__items`);

  const renderSinglePoint = (index) => {
    let object = pointsArr[index];

    if (!object) {
      return;
    }

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

const setDestinations = (items) => {
  window.wayDestinations = items;
};

const setOfferTypes = (items) => {
  window.offerTypes = items;
};

const setDestinationsTitle = (points) => {
  const title = document.querySelector(`.trip__points`);
  const destinations = new Set();

  points.forEach((item) => destinations.add(item.destinationPoint));

  const getNewTitleHtml = () => {
    return [...destinations].map((dest, i) => {
      return (i === 0) ? `${dest}` : `&nbsp;&mdash; ${dest}`;
    }).join(``);
  };

  const newTitleHtml = `<h1 class="trip__points">${getNewTitleHtml()}</h1>`;

  title.parentNode.replaceChild(utils.createElement(newTitleHtml), title);
};

const initStatistics = (points) => {
  const buttons = document.querySelectorAll(`.view-switch__item`);
  const activeBtn = document.querySelector(`.view-switch__item--active`);
  const stat = new Stats();

  stat.onDraw = () => {
    stat._data = points;
    stat._drawStats();
  };

  const setView = (btnNode) => {
    const pointsTab = document.querySelector(`main.main`);
    const statsTab = document.querySelector(`section.statistic`);
    const filterBlock = document.querySelector(`form.trip-filter`);

    if (!btnNode) {
      return;
    }

    buttons.forEach((btn) => {
      btn.classList[(btnNode === btn) ? `add` : `remove`](`view-switch__item--active`);
    });

    if (btnNode.href.indexOf(`stats`) > -1) {
      pointsTab.classList.add(`visually-hidden`);
      filterBlock.classList.add(`visually-hidden`);
      statsTab.classList.remove(`visually-hidden`);
      stat._onDraw();
    } else {
      pointsTab.classList.remove(`visually-hidden`);
      filterBlock.classList.remove(`visually-hidden`);
      statsTab.classList.add(`visually-hidden`);
    }
  };

  const switchView = (e) => {
    e.preventDefault();
    setView(e.target);
  };

  buttons.forEach((btn) => {
    btn.addEventListener(`click`, switchView);
  });

  document.body.appendChild(stat.render());
  setView(activeBtn);
};

request.getDestinations()
  .then((destinations) => {
    setDestinations(destinations);
  });

request.getOfferTypes()
  .then((offers) => {
    setOfferTypes(offers);
  });

request.getPoints()
  .then((points) => {
    setDestinationsTitle(points);
    renderPoints(points);
    initFilters(points, renderPoints);
    initStatistics(points);
  });
