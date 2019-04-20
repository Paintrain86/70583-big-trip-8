const iconsMap = new Map([
  [`taxi`, `🚕`],
  [`bus`, `🚌`],
  [`train`, `🚄`],
  [`ship`, `🚢`],
  [`transport`, `🚀`],
  [`drive`, `🚗`],
  [`flight`, `✈️`],
  [`check-in`, `🏨`],
  [`sightseeing`, `🎆`],
  [`restaurant`, `🍴`]
]);

class ModelPoint {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.timeStart = new Date(data[`date_from`]);
    this.timeEnd = new Date(data[`date_to`]);
    this.price = data[`base_price`];
    this.isFavourite = data[`is_favorite`];
    this.destinationPoint = data[`destination`][`name`];
    this.pictures = data[`destination`][`pictures`];
    this.sights = data[`destination`][`description`];
    this.offers = data[`offers`];
    this.icons = iconsMap;
  }

  convertToServerFormat() {
    return {
      id: this.id
    };
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}

export default ModelPoint;
