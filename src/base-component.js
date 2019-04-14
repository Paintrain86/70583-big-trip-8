import utils from './util.js';

class BaseComponent {
  constructor() {
    if (new.target === BaseComponent) {
      throw new Error(`Can't create an instance of BaseComponent. You can only extend your classes with it.`);
    }

    this._element = null;
    this._state = {};
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`No template for ${new.target} is defined`);
  }

  bind() {}

  unbind() {}

  render() {
    this._element = utils.createElement(this.template);
    this.bind();

    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}

export default BaseComponent;
