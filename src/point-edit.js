import moment from 'moment';
import utils from './util.js';
import PointComponent from './point-component.js';

class PointEdit extends PointComponent {
  constructor(object) {
    super();
    this._type = object.type;
    this._destinationPoint = object.destinationPoint;
    this._timeStart = object.timeStart;
    this._timeEnd = object.timeEnd;
    this._price = object.price;
    this._sights = object.sights;
    this._pictures = object.pictures;
    this._offers = object.offers;
    this._offersSelected = object.offersSelected;
    this._icons = object.icons;

    this._element = null;

    this._onSubmit = null;
    this._onReset = null;
    this._onDelete = null;

    this._onSubmitBtnClick = this._onSubmitBtnClick.bind(this);
    this._onResetBtnClick = this._onResetBtnClick.bind(this);
    this._onDeleteBtnClick = this._onDeleteBtnClick.bind(this);
    this._onChangeType = this._onChangeType.bind(this);
  }

  _onSubmitBtnClick(e) {
    e.preventDefault();

    const changedData = this._getSubmitData();

    if (typeof this._onSubmit === `function`) {
      this._onSubmit(changedData);
    }

    this.update(changedData);
  }

  _onResetBtnClick(e) {
    e.preventDefault();

    if (typeof this._onReset === `function`) {
      this._onReset();
    }
  }

  _onDeleteBtnClick(e) {
    e.preventDefault();

    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  _onChangeType(e) {
    e.preventDefault();
    const typeTrigger = this._element.querySelector(`#travel-way__toggle`);
    const typeLabel = this._element.querySelector(`label[for="travel-way__toggle"]`);
    const destinationLabel = this._element.querySelector(`label[for="destination"]`);
    const target = e.target;

    typeLabel.textContent = this._icons.get(target.value);
    destinationLabel.textContent = `${target.value} to`;
    typeTrigger.checked = false;
  }

  _getSubmitData() {
    const formData = new FormData(this._element.querySelector(`form`));
    const allOffers = this._offers;

    const getSelectedOffers = (data) => {
      const offers = data.getAll(`offer`);

      return allOffers.filter((item) => {
        return offers.indexOf(item.id) > -1;
      });
    };

    return {
      type: formData.get(`travel-way`),
      destinationPoint: formData.get(`destination`),
      price: Number(formData.get(`price`)),
      offersSelected: getSelectedOffers(formData)
    };
  }

  get offersHtml() {
    return this._offers.map((offer) => `
      <input
        class="point__offers-input visually-hidden"
        type="checkbox"
        id="${offer.id}"
        name="offer"
        value="${offer.id}"
        ${(this._offersSelected.filter((it) => it.id === offer.id).length > 0) ? `checked` : ``}
      >
      <label for="${offer.id}" class="point__offers-label">
        <span class="point__offer-service">${offer.displayName}</span> + €<span class="point__offer-price">${offer.price}</span>
      </label>
    `).join(``);
  }

  get typesTemplate() {
    const wayGroups = [
      [`taxi`, `bus`, `train`, `flight`, `ship`],
      [`check-in`, `sightseeing`, `restaurant`]
    ];

    const getWayGroupHtml = (array) => array.map((item) => {
      return `
        <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-${item}" name="travel-way" value="${item}" ${(item === this._type) ? `checked` : ``}>
        <label class="travel-way__select-label" for="travel-way-${item}">${this._icons.get(item)} ${item}</label>
      `;
    }).join(``);

    return wayGroups.map((group) => {
      return `<div class="travel-way__select-group">${getWayGroupHtml(group)}</div>`;
    }).join(``);
  }

  get template() {
    return `
    <article class="point">
      <form action="" method="get">
        <header class="point__header">
          <label class="point__date">
            choose day
            <input class="point__input" type="text" placeholder="MAR 18" name="day" value="${moment(this._timeStart).format(`MMM DD`)}">
          </label>

          <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle">${this._icons.get(this._type)}</label>

            <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

            <div class="travel-way__select">
              ${this.typesTemplate}
            </div>
          </div>

          <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination">${this._type} to</label>
            <input class="point__destination-input" list="destination-select" id="destination" value="${this._destinationPoint}" name="destination">
            <datalist id="destination-select">
              <option value="airport"></option>
              ${window.wayDestinations.map((dest) => `<option value="${dest}" ${(dest === this._destinationPoint) ? `selected` : ``}></option>`).join(``)}
              <option value="hotel"></option>
            </datalist>
          </div>

          <label class="point__time">
            choose time
            <input class="point__input" type="text" value="${utils.getHoursAndMinutes(this._timeStart)} - ${utils.getHoursAndMinutes(this._timeEnd)}" name="time" placeholder="00:00 — 00:00">
          </label>

          <label class="point__price">
            write price
            <span class="point__price-currency">€</span>
            <input class="point__input" type="text" value="${this._price}" name="price">
          </label>

          <div class="point__buttons">
            <button class="point__button point__button--save" type="submit">Save</button>
            <button class="point__button" type="reset">Delete</button>
          </div>

          <div class="paint__favorite-wrap">
            <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
            <label class="point__favorite" for="favorite">favorite</label>
          </div>
        </header>

        <section class="point__details">
          <section class="point__offers">
            <h3 class="point__details-title">offers</h3>

            <div class="point__offers-wrap">
              ${this.offersHtml}
            </div>

          </section>
          <section class="point__destination">
            <h3 class="point__details-title">Destination</h3>
            <p class="point__destination-text">${this._sights.join(``)}</p>
            <div class="point__destination-images">
              ${this._pictures.map((url) => `
                <img src="${url}" alt="picture from place" class="point__destination-image">
              `).join(``)}
            </div>
          </section>
          <input type="hidden" class="point__total-price" name="total-price" value="">
        </section>
      </form>
    </article>
    `;
  }

  set onSubmit(cb) {
    this._onSubmit = cb;
  }

  set onReset(cb) {
    this._onReset = cb;
  }

  set onDelete(cb) {
    this._onDelete = cb;
  }

  bind() {
    this._element.querySelector(`form`).addEventListener(`submit`, this._onSubmitBtnClick);
    this._element.querySelector(`button[type="reset"]`).addEventListener(`click`, this._onDeleteBtnClick);
    this._element.querySelector(`.travel-way__select`).addEventListener(`change`, this._onChangeType);

    /*  flatpickr(this._element.querySelector(`.point__date .point_input`), {altInput: true, altFormat: `j F`, dateFormat: `Y-m-d`, defaultDate: this._timeStart});
    flatpickr(this._element.querySelector(`.point__time`), {enableTime: true, noCalendar: true, altInput: true, altFormat: `h:i K`, dateFormat: `H:i`, defaultDate: this._timeStart});*/
  }

  unbind() {
    this._element.querySelector(`form`).removeEventListener(`submit`, this._onSubmitBtnClick);
    this._element.querySelector(`button[type="reset"]`).removeEventListener(`click`, this._onDeleteBtnClick);
    this._element.querySelector(`.travel-way__select`).removeEventListener(`change`, this._onChangeType);
  }

  update(data) {
    this._type = data.type;
    this._destinationPoint = data.destinationPoint;
    this._price = data.price;
    this._offersSelected = data.offersSelected;
  }
}

export default PointEdit;
