import ModelPoint from './model-point.js';

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

  getOffers() {
    return this._load({url: `offers`})
      .then(getJSON);
  }

  getPoints() {
    return this._load({url: `points`})
      .then(getJSON)
      .then(ModelPoint.parsePoints);
  }

  /*  createPoint({point}) {
    return this._load({
      url: `tasks`,
      method: Methods.POST,
      body: JSON.stringify(task),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }

  updatePoint({id, data}) {
  }

  deletePoint({id}) {
  }*/

  _load({url, method = Methods.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._auth);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        console.error(`fetch error: ${err}`);
        throw err;
      });
  }
}

export default Request;
