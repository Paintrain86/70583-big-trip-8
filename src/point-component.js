import utils from './util.js';

class PointComponent {
  constructor() {
    if (new.target === PointComponent) {
      throw new Error(`Can't create an instance of PointComponent. You can only extend your classes with it.`);
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

export default PointComponent;
