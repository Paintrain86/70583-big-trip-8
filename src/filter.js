import BaseComponent from './base-component.js';

class Filter extends BaseComponent {
  constructor() {
    super();
    this._items = [{
      name: `everything`,
      isChecked: true
    },
    {
      name: `future`
    },
    {
      name: `past`
    }];

    this._element = null;

    this._onFilter = null;

    this._onFilterChanged = this._onFilterChanged.bind(this);
  }

  _onFilterChanged(e) {
    e.preventDefault();

    if (typeof this._onFilter === `function`) {
      this._onFilter(e.target.value);
    }
  }

  set onFilter(cb) {
    this._onFilter = cb;
  }

  get itemsHtml() {
    return this._items.map((item) => `
      <input type="radio" id="filter-${item.name}" name="filter" value="${item.name}" ${item.isChecked ? `checked` : ``}>
      <label class="trip-filter__item" for="filter-${item.name}">${item.name}</label>
    `).join(``);
  }

  get template() {
    return `<form class="trip-filter">${this.itemsHtml}</form>`;
  }

  bind() {
    this._element.addEventListener(`change`, this._onFilterChanged);
  }
  unbind() {
    this._element.removeEventListener(`change`, this._onFilterChanged);
  }
}

export default Filter;
