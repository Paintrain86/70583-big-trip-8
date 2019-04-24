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
    const isNewPoint = typeof data === `undefined`;

    this.id = isNewPoint ? Math.ceil(Math.random() * 157458) : data[`id`];
    this.type = isNewPoint ? window.offerTypes[0][`type`] : data[`type`];
    this.timeStart = isNewPoint ? new Date() : new Date(data[`date_from`]);
    this.timeEnd = isNewPoint ? new Date(Date.now() + 5 * 60 * 60 * 1000) : new Date(data[`date_to`]);
    this.price = isNewPoint ? 0 : data[`base_price`];
    this.isFavourite = isNewPoint ? false : data[`is_favorite`];
    this.destinationPoint = isNewPoint ? window.wayDestinations[0][`name`] : data[`destination`][`name`];
    this.pictures = isNewPoint ? window.wayDestinations[0][`pictures`] : data[`destination`][`pictures`];
    this.sights = isNewPoint ? window.wayDestinations[0][`description`] : data[`destination`][`description`];
    this.offers = isNewPoint ? window.offerTypes[0][`offers`] : data[`offers`];
    this.icons = iconsMap;
  }

  convertToServerFormat() {
    return {
      'id': this.id,
      'type': this.type,
      'date_from': this.timeStart.getTime(),
      'date_to': this.timeEnd.getTime(),
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

  update(data) {
    this.type = data.type;
    this.destinationPoint = data.destinationPoint;
    this.timeStart = data.timeStart;
    this.timeEnd = data.timeEnd;
    this.sights = data.sights;
    this.pictures = data.pictures;
    this.price = data.price;
    this.offers = data.offers;
    this.isFavourite = data.isFavourite;
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}

export default ModelPoint;
