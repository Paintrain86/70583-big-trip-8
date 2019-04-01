import utils from './util.js';
import PointComponent from './point-component.js';

class Point extends PointComponent {
  constructor(object) {
    super();
    this._type = object.type;
    this._destinationPoint = object.destinationPoint;
    this._timeStart = object.timeStart;
    this._timeEnd = object.timeEnd;
    this._price = object.price;
    this._sights = object.sights;
    this._pictures = object.pictures;
    this._offersSelected = object.offersSelected;
    this._icons = object.icons;
    this._iconSelected = object.icons.get(object.type);

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
    const offersHtml = this._offersSelected.map((offer) => `
    <li>
      <button class="trip-point__offer">${offer.displayName} +&euro;&nbsp;${offer.price}</button>
    </li>`).join(``);

    return (offersHtml === ``) ? offersHtml : `<ul class="trip-point__offers">${offersHtml}</ul>`;
  }

  get offersPrice() {
    if (this._offersSelected.length === 0) {
      return 0;
    }

    return this._offersSelected.reduce((acc, offer) => {
      return {price: acc.price + offer.price};
    }).price;
  }

  get template() {
    return `
      <article class="trip-point">
        <i class="trip-icon">${this._iconSelected}</i>
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
    this._price = data.price;
    this._destinationPoint = data.destinationPoint;
    this._offersSelected = data.offersSelected;
  }
}


export default Point;
