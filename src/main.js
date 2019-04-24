import utils from './util.js';
import Filter from './filter.js';
import Point from './point.js';
import PointEdit from './point-edit.js';
import Stats from './stats.js';
import Request from './request.js';
import ModelPoint from './model-point.js';

const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;
const AUTHORIZATION = `Basic HalleLuYa=1`;

const request = new Request({
  endPoint: END_POINT,
  auth: AUTHORIZATION
});

const pageTitle = document.querySelector(`.trip__points`);
const pointsBlock = document.querySelector(`.trip-day__items`);
const newPointBtn = document.querySelector(`.trip-controls__new-event`);

const requestActionDelay = 700;

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
  const renderSinglePoint = (object) => {
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
      request.deletePoint({
        id: object.id
      })
      .then(() => {
        setTimeout(function () {
          pointsBlock.removeChild(pointEdit.element);
          pointEdit.unrender();
          object = null;
          setTotalPrice(pointsArr);
        }, requestActionDelay);
      });
    };

    pointEdit.onSubmit = (newObject) => {
      object.update(newObject);

      request.updatePoint({
        id: object.id,
        data: object.convertToServerFormat()
      })
      .then(() => {
        setTimeout(function () {
          point.update(object);
          point.render();
          pointsBlock.replaceChild(point.element, pointEdit.element);
          pointEdit.unrender();
          setTotalPrice(pointsArr);
        }, requestActionDelay);
      })
      .catch((err) => {
        pointEdit._unblockForm(err);
      });
    };

    pointsBlock.appendChild(point.render());
  };

  pointsBlock.innerHTML = ``;

  for (let point of pointsArr) {
    renderSinglePoint(point);
  }
};

const initNewPoint = (pointsArr) => {
  const showPointCreation = (e) => {
    e.preventDefault();

    const object = new ModelPoint();
    const pointCreate = new PointEdit(object);

    pointCreate.render();
    pointCreate.element.querySelector(`button[type="reset"]`).classList.add(`visually-hidden`);
    pointsBlock.prepend(pointCreate.element);

    pointCreate.onReset = () => {
      pointsBlock.removeChild(pointCreate.element);
      pointCreate.unrender();
    };

    pointCreate.onSubmit = (newObject) => {
      object.update(newObject);

      request.createPoint({
        data: object.convertToServerFormat()
      })
      .then((newPointObject) => {
        createObject(newPointObject);

        setTimeout(function () {
          renderPoints(pointsArr);
          setTotalPrice(pointsArr);
        }, requestActionDelay);
      })
      .catch((err) => {
        pointCreate._unblockForm(err);
      });
    };
  };

  const createObject = (newObject) => {
    pointsArr.push(newObject);
  };

  newPointBtn.addEventListener(`click`, showPointCreation);
};

const setDestinations = (items) => {
  window.wayDestinations = items;
};

const setOfferTypes = (items) => {
  window.offerTypes = items;
};

const setDestinationsTitle = (points) => {
  const destinations = new Set();

  points.forEach((item) => destinations.add(item.destinationPoint));

  const getNewTitleHtml = () => {
    return [...destinations].map((dest, i) => {
      return (i === 0) ? `${dest}` : `&nbsp;&mdash; ${dest}`;
    }).join(``);
  };

  const newTitleHtml = `<h1 class="trip__points">${getNewTitleHtml()}</h1>`;

  pageTitle.parentNode.replaceChild(utils.createElement(newTitleHtml), pageTitle);
};

const setTotalPrice = (points) => {
  const totalPriceElem = document.querySelector(`.trip__total-cost`);
  let result = 0;

  const getOffersPrice = (point) => {
    if (point.offers.length === 0) {
      return 0;
    }

    return point.offers.reduce((acc, offer) => {
      return {price: ((typeof acc.accepted === `undefined` || acc.accepted === true) ? acc.price : 0) + (offer.accepted ? offer.price : 0)};
    }).price;
  };

  result = points.reduce((total, item) => {
    return {
      price: ((total) ? total.price : 0) + ((item) ? getOffersPrice(item) : 0) + ((typeof total.id === `undefined` && item) ? item.price : 0)
    };
  }).price;

  totalPriceElem.textContent = result.toLocaleString();
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

pageTitle.textContent = `Loading routes...`;
request.getPoints()
  .then((points) => {
    setDestinationsTitle(points);
    setTotalPrice(points);
    renderPoints(points);
    initNewPoint(points);
    initFilters(points, renderPoints);
    initStatistics(points);
  });

request.getDestinations()
  .then((destinations) => {
    setDestinations(destinations);
  });

request.getOfferTypes()
  .then((offers) => {
    setOfferTypes(offers);
  });
