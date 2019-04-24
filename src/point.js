import utils from './util.js';
import BaseComponent from './base-component.js';

class Point extends BaseComponent {
  constructor(object) {
    super();
    this._type = object.type;
    this._destinationPoint = object.destinationPoint;
    this._timeStart = object.timeStart;
    this._timeEnd = object.timeEnd;
    this._price = object.price;
    this._offers = object.offers;
    this._icons = object.icons;

    this._element = null;

    this._onEdit = null;
    this._onEditBtnClick = this._onEditBtnClick.bind(this);
  }

  _onEditBtnClick(e) {
    e.preventDefault();

    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  get offersHtml() {
    const offersHtml = this._offers.map((offer) => {
      return (!offer.accepted ? `` : `
      <li>
        <button class="trip-point__offer">${offer.title} +&euro;&nbsp;${offer.price}</button>
      </li>`);
    }).join(``);

    return (offersHtml === ``) ? offersHtml : `<ul class="trip-point__offers">${offersHtml}</ul>`;
  }

  get offersPrice() {
    if (this._offers.length === 0) {
      return 0;
    }

    return this._offers.reduce((acc, offer) => {
      return {price: ((typeof acc.accepted === `undefined` || acc.accepted === true) ? acc.price : 0) + (offer.accepted ? offer.price : 0)};
    }).price;
  }

  get template() {
    return `
      <article class="trip-point">
        <i class="trip-icon">${this._icons.get(this._type)}</i>
        <h3 class="trip-point__title">${this._type} to ${this._destinationPoint}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${utils.getHoursAndMinutes(this._timeStart)}&nbsp;&mdash; ${utils.getHoursAndMinutes(this._timeEnd)}</span>
          <span class="trip-point__duration">${utils.getTimeDifference(this._timeStart, this._timeEnd)}</span>
        </p>
        <p class="trip-point__price">&euro;&nbsp;${this._price + this.offersPrice}</p>
        ${this.offersHtml}
      </article>
    `;
  }

  set onEdit(cb) {
    this._onEdit = cb;
  }

  bind() {
    this._element.addEventListener(`click`, this._onEditBtnClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onEditBtnClick);
  }

  update(data) {
    this._type = data.type;
    this._destinationPoint = data.destinationPoint;
    this._price = data.price;
    this._offers = data.offers;
  }
}


export default Point;
