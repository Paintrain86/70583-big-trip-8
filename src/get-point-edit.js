import utils from './util.js';

class PointEdit {
  constructor(object) {
    this._type = object.type;
    this._timeStart = object.timeStart;
    this._timeEnd = object.timeEnd;
    this._price = object.price;
    this._sights = object.sights;
    this._pictures = object.pictures;
    this._offers = object.offers;
    this._offersSelected = object.offersSelected;
    this._icons = object.icons;
    this._iconSelected = object.icons.get(object.type);

    this._element = null;

    this._onSubmit = null;
    this._onReset = null;
  }

  _onSubmit(e) {
    e.preventDefault();

    if (typeof this._onSubmit === `function`) {
      this._onSubmit();
    }
  }

  _onReset(e) {
    e.preventDefault();

    if (typeof this._onReset === `function`) {
      this._onReset();
    }
  }

  get fullPrice() {
    let price = this._price;

    this._offersSelected.forEach((offer) => {
      price += offer.price;
    });

    return price;
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

  get waysTemplate() {
    const wayGroups = [
      [`taxi`, `bus`, `train`, `flight`],
      [`check-in`, `sightseeing`]
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
            <input class="point__input" type="text" placeholder="MAR 18" name="day">
          </label>

          <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle">${this._iconSelected}</label>

            <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

            <div class="travel-way__select">
              ${this.waysTemplate}
            </div>
          </div>

          <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination">Flight to</label>
            <input class="point__destination-input" list="destination-select" id="destination" value="${window.wayDestinations[0]}" name="destination">
            <datalist id="destination-select">
              <option value="airport"></option>
              ${window.wayDestinations.map((dest) => `<option value="${dest}"></option>`).join(``)}
              <option value="hotel"></option>
            </datalist>
          </div>

          <label class="point__time">
            choose time
            <input class="point__input" type="text" value="00:00 — 00:00" name="time" placeholder="00:00 — 00:00">
          </label>

          <label class="point__price">
            write price
            <span class="point__price-currency">€</span>
            <input class="point__input" type="text" value="${this.fullPrice}" name="price">
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

  get element() {
    return this._element;
  }

  set onSubmit(cb) {
    this._onSubmit = cb;
  }

  set onReset(cb) {
    this._onReset = cb;
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
    this._element.querySelector(`form`).addEventListener(`submit`, this._onSubmit.bind(this));
    this._element.querySelector(`[type="reset"]`).addEventListener(`click`, this._onReset.bind(this));
  }

  unbind() {
    this._element.querySelector(`form`).removeEventListener(`submit`, this._onSubmit.bind(this));
    this._element.querySelector(`[type="reset"]`).removeEventListener(`click`, this._onReset);
  }
}

export default PointEdit;
