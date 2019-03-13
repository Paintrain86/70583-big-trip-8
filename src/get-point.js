import utils from './util.js';

class Point {
  constructor(object) {
    this._type = object.type;
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
  }

  _onEdit(e) {
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

  get template() {
    return `
      <article class="trip-point">
        <i class="trip-icon">${this._iconSelected}</i>
        <h3 class="trip-point__title">${this._type} to Airport</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${utils.getHoursAndMinutes(this._timeStart)}&nbsp;&mdash; ${utils.getHoursAndMinutes(this._timeEnd)}</span>
          <span class="trip-point__duration">${utils.getTimeDifference(this._timeStart, this._timeEnd)}</span>
        </p>
        <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
        ${this.offersHtml}
      </article>
    `;
  }


  get element() {
    return this._element;
  }

  set onEdit(cb) {
    this._onEdit = cb;
  }

  render() {
    this._element = utils.createElement(this.template);
    this.bind();

    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }

  bind() {
    this._element.addEventListener(`click`, this._onEdit.bind(this));
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onEdit);
  }
}


export default Point;
