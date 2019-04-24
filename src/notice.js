import BaseComponent from './base-component.js';

class Notice extends BaseComponent {
  constructor(message, type) {
    super();
    this._message = message;
    this._type = (typeof type === `undefined`) ? `fail` : type;
    this._timeout = 10000;
    this._delay = 200;
    this._delayRemove = 400;
    this._interval = null;

    this._element = null;
    this._parent = document.querySelector(`.notices`);

    this._onCloseBtnClick = this._onCloseBtnClick.bind(this);
  }

  _onCloseBtnClick(e) {
    e.preventDefault();

    this.hideNotice();
  }

  showNotice() {
    const element = this.render();
    this._parent.appendChild(element);

    setTimeout(function () {
      element.classList.add(`notices__item--active`);
    }, this._delay);

    this._interval = setTimeout(this.hideNotice.bind(this), this._timeout);
  }

  hideNotice() {
    this._element.classList.remove(`notices__item--active`);

    clearTimeout(this._interval);
    setTimeout(this.removeNotice.bind(this), this._delayRemove);
  }

  removeNotice() {
    this._parent.removeChild(this._element);
    this.unrender();
  }

  get template() {
    return `
      <div class="notices__item notices__item--${this._type}">
        <button class="notices__item-close">x</button>
        ${this._message}
      </div>
    `;
  }

  bind() {
    this._element.querySelector(`.notices__item-close`).addEventListener(`click`, this._onCloseBtnClick);
  }

  unbind() {
    this._element.querySelector(`.notices__item-close`).removeEventListener(`click`, this._onCloseBtnClick);
  }
}

export default Notice;
