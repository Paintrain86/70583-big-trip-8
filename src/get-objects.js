import utils from './util.js';

const sightDescriptionsSet = new Set(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`. `));

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

const ranges = {
  offers: {
    min: 0,
    max: 3
  },
  sights: {
    min: 1,
    max: 3
  },
  pictures: {
    min: 1,
    max: 7
  },
  time: {
    min: 0,
    max: 18 * 60 * 60 * 1000
  }
};
const offersAvailable = [
  {
    id: `add-luggage`,
    displayName: `Add luggage`,
    price: 12
  },
  {
    id: `switch-to-comfort-class`,
    displayName: `Switch to comfort class`,
    price: 24
  },
  {
    id: `add-meal`,
    displayName: `Add meal`,
    price: 36
  },
  {
    id: `choose-seats`,
    displayName: `Choose seats`,
    price: 48
  }
];

const eventTypes = [
  {
    name: `taxi`,
    price: 25,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `bus`,
    price: 5,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `train`,
    price: 35,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `ship`,
    price: 45,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `transport`,
    price: 11,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `drive`,
    price: 8,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `flight`,
    price: 115,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `check-in`,
    price: 80,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `sightseeing`,
    price: 0,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `restaurant`,
    price: 50,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  }
];

const getPictures = (isPictures) => {
  let pictures = [];

  if (isPictures) {
    for (let i = 0; i < utils.getRandomInteger(ranges.pictures.min, ranges.pictures.max); i++) {
      pictures.push({
        src: `http://picsum.photos/300/150?r=${Math.random()}`,
        description: ``
      });
    }
  }

  return pictures;
};

const getSingleObject = () => {
  const curType = utils.getRandomFromArray(eventTypes);

  return {
    type: curType.name,
    price: curType.price,
    offers: offersAvailable,
    offersSelected: (curType.isOffers) ? utils.getUniqueArray(utils.getRandomInteger(ranges.offers.min, ranges.offers.max), offersAvailable) : [],
    sights: (curType.isSights) ? utils.getUniqueArray(utils.getRandomInteger(ranges.sights.min, ranges.sights.max), [...sightDescriptionsSet]) : [],
    pictures: getPictures(curType.isSights),
    timeStart: new Date(Date.now() - utils.getRandomInteger(ranges.time.min, ranges.time.max)),
    timeEnd: new Date(Date.now() + utils.getRandomInteger(ranges.time.min, ranges.time.max)),
    icons: iconsMap
  };
};

const getObjects = (count) => {
  let objects = [];

  for (let i = 0; i < count; i++) {
    objects.push(getSingleObject());
  }

  return objects;
};

export default getObjects;
