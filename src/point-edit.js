import moment from 'moment';
import flatpickr from 'flatpickr';
import utils from './util.js';
import BaseComponent from './base-component.js';

class PointEdit extends BaseComponent {
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
    this._isFavourite = object.isFavourite;
    this._icons = object.icons;

    this._tempType = null;
    this._tempDestination = null;

    this._element = null;

    this._onSubmit = null;
    this._onReset = null;
    this._onDelete = null;

    this._onSubmitBtnClick = this._onSubmitBtnClick.bind(this);
    this._onResetBtnClick = this._onResetBtnClick.bind(this);
    this._onDeleteBtnClick = this._onDeleteBtnClick.bind(this);
    this._onChangeType = this._onChangeType.bind(this);
    this._onChangeDestination = this._onChangeDestination.bind(this);
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
    const offersBlock = this._element.querySelector(`.point__offers-wrap`);
    const target = e.target;
    const typeObject = window.offerTypes.filter((item) => item.type === target.value)[0];

    typeLabel.textContent = this._icons.get(target.value);
    destinationLabel.textContent = `${target.value} to`;
    typeTrigger.checked = false;

    this._element.classList.add(`point--progress`);
    offersBlock.innerHTML = ``;

    if (typeof typeObject !== `undefined` && typeObject.offers.length > 0) {
      this._tempType = typeObject;

      utils.insertElements(offersBlock, typeObject.offers.map((offer) => `
        <input
          class="point__offers-input visually-hidden"
          type="checkbox"
          id="${offer.name.replace(/ /g, `-`).toLowerCase()}"
          name="offer"
          value="${offer.name}"
        >
        <label for="${offer.name.replace(/ /g, `-`).toLowerCase()}" class="point__offers-label">
          <span class="point__offer-service">${offer.name}</span> + €<span class="point__offer-price">${offer.price}</span>
        </label>
      `).join(``));
    } else {
      offersBlock.textContent = `There's no available offers for this trip type`;
    }
    this._element.classList.remove(`point--progress`);
  }

  _onChangeDestination(e) {
    const dest = e.target.value;
    const destObject = window.wayDestinations.filter((item) => dest === item.name)[0];
    const descrElement = this._element.querySelector(`.point__destination-text`);
    const picturesElement = this._element.querySelector(`.point__destination-images`);

    this._element.classList.add(`point--progress`);
    descrElement.innerHTML = ``;
    picturesElement.innerHTML = ``;

    if (typeof destObject === `undefined`) {
      descrElement.textContent = `Unfortunately, there's no description for this way point :(`;
    } else {
      this._tempDestination = destObject;

      descrElement.textContent = destObject.description;
      utils.insertElements(picturesElement, destObject.pictures.map((img) => `
        <img src="${img.src}" alt="${img.description}" class="point__destination-image">
      `).join(``));
    }
    this._element.classList.remove(`point--progress`);
  }

  _getSubmitData() {
    const formData = new FormData(this._element.querySelector(`form`));
    const allOffers = (this._tempType) ? this._tempType.offers : this._offers;

    const updateOffers = (data) => {
      const dataOffers = data.getAll(`offer`);

      return allOffers.map((item) => {
        const title = (typeof item.title === `undefined`) ? item.name : item.title;
        return {
          'title': title,
          'price': item.price,
          'accepted': dataOffers.indexOf(title) > -1
        };
      });
    };

    return {
      type: formData.get(`travel-way`),
      destinationPoint: formData.get(`destination`),
      sights: (this._tempDestination) ? this._tempDestination.description : this._sights,
      pictures: (this._tempDestination) ? this._tempDestination.pictures : this._pictures,
      price: Number(formData.get(`price`)),
      offers: updateOffers(formData),
      isFavourite: formData.get(`favorite`) === `on`
    };
  }

  get offersHtml() {
    const result = this._offers.map((offer) => `
      <input
        class="point__offers-input visually-hidden"
        type="checkbox"
        id="${offer.title.replace(/ /g, `-`).toLowerCase()}"
        name="offer"
        value="${offer.title}"
        ${(offer.accepted) ? `checked` : ``}
      >
      <label for="${offer.title.replace(/ /g, `-`).toLowerCase()}" class="point__offers-label">
        <span class="point__offer-service">${offer.title}</span> + €<span class="point__offer-price">${offer.price}</span>
      </label>
    `).join(``);

    return (result === ``) ? `No offers available for this destination point` : result;
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
              ${window.wayDestinations.map((dest) => `<option value="${dest.name}" ${(dest.name === this._destinationPoint) ? `selected` : ``}></option>`).join(``)}
              <option value="hotel"></option>
            </datalist>
          </div>

          <label class="point__time">
            choose time
            <input class="point__input" type="text" value="${utils.getHoursAndMinutes(this._timeStart)}" name="date-start" placeholder="19:00">
            <input class="point__input" type="text" value="${utils.getHoursAndMinutes(this._timeEnd)}" name="date-end" placeholder="21:00">
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
            <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${(this._isFavourite) ? `checked` : ``}>
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
            <p class="point__destination-text">${this._sights}</p>
            <div class="point__destination-images">
              ${this._pictures.map((img) => `
                <img src="${img.src}" alt="${img.description}" class="point__destination-image">
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

    flatpickr(this._element.querySelector(`.point__time [name="date-start"]`), {enableTime: true, noCalendar: true, altInput: true, altFormat: `h:i K`, dateFormat: `H:i`, defaultDate: this._timeStart});
    flatpickr(this._element.querySelector(`.point__time [name="date-end"]`), {enableTime: true, noCalendar: true, altInput: true, altFormat: `h:i K`, dateFormat: `H:i`, defaultDate: this._timeEnd});

    this._element.querySelector(`#destination`).addEventListener(`change`, this._onChangeDestination);
  }

  unbind() {
    this._element.querySelector(`form`).removeEventListener(`submit`, this._onSubmitBtnClick);
    this._element.querySelector(`button[type="reset"]`).removeEventListener(`click`, this._onDeleteBtnClick);
    this._element.querySelector(`.travel-way__select`).removeEventListener(`change`, this._onChangeType);
    this._element.querySelector(`#destination`).removeEventListener(`change`, this._onChangeDestination);
  }

  update(data) {
    this._type = data.type;
    this._destinationPoint = data.destinationPoint;
    this._sights = data.sights;
    this._pictures = data.pictures;
    this._price = data.price;
    this._offers = data.offers;
    this._isFavourite = data.isFavourite;
  }
}

export default PointEdit;
