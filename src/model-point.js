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
      'id': this.id,
      'type': this.type,
      'date_from': this.timeStart.getTime(),
      'date_to': this.timeend.getTime(),
      'base_price': this.price,
      'is_favorite': this.isFavourite,
      'destination': {
        'name': this.destinationPoint,
        'description': this.sights,
        'pictures': this.pictures
      },
      'offers': this.offers
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
