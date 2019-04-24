import ModelPoint from './model-point.js';
import Notice from './notice.js';

const Methods = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const getJSON = (response) => {
  return response.json();
};

class Request {
  constructor({endPoint, auth}) {
    this._endPoint = endPoint;
    this._auth = auth;
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(getJSON);
  }

  getOfferTypes() {
    return this._load({url: `offers`})
      .then(getJSON);
  }

  getPoints() {
    return this._load({url: `points`})
      .then(getJSON)
      .then(ModelPoint.parsePoints)
      .catch((err) => {
        const notice = new Notice(`Something went wrong while loading your route info. Check your connection or try again later. Error description: ${err}`);
        notice.showNotice();
      });
  }

  updatePoint({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: Methods.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then(getJSON)
    .then((object) => {
      const notice = new Notice(`Point update was successfuly performed`, `success`);
      notice.showNotice();

      return ModelPoint.parsePoint(object);
    });
  }

  deletePoint({id}) {
    return this._load({
      url: `points/${id}`,
      method: Methods.DELETE
    })
    .then(() => {
      const notice = new Notice(`Deletion was successfuly performed`, `success`);
      notice.showNotice();
    });
  }

  _load({url, method = Methods.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._auth);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        const notice = new Notice(`fetch error: ${err}`);
        notice.showNotice();

        throw err;
      });
  }
}

export default Request;
