import utils from './util.js';

const sightDescriptionsSet = new Set(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`. `));

const iconsMap = new Map([
  [`Taxi`, `🚕`],
  [`Bus`, `🚌`],
  [`Train`, `🚄`],
  [`Ship`, `🚢`],
  [`Transport`, `🚀`],
  [`Drive`, `🚗`],
  [`Flight`, `✈️`],
  [`Check-in`, `🏨`],
  [`Sightseeing`, `🎆`],
  [`Restaurant`, `🍴`]
]);

const ranges = {
  offers: {
    min: 0,
    max: 2
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
const offers = [
  {
    name: `Add luggage`,
    price: 12
  },
  {
    name: `Switch to comfort class`,
    price: 24
  },
  {
    name: `Add meal`,
    price: 36
  },
  {
    name: `Choose seats`,
    price: 48
  }
];

const eventTypes = [
  {
    name: `Taxi`,
    price: 25,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `Bus`,
    price: 5,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `Train`,
    price: 35,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `Ship`,
    price: 45,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `Transport`,
    price: 11,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `Drive`,
    price: 8,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `Flight`,
    price: 115,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `Check-in`,
    price: 80,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `Sightseeing`,
    price: 0,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  },
  {
    name: `Restaurant`,
    price: 50,
    isOffers: utils.getRandomBoolean(),
    isSights: utils.getRandomBoolean()
  }
];

const getPictures = (isPictures) => {
  let pictures = [];

  if (isPictures) {
    for (let i = 0; i < utils.getRandomInteger(ranges.pictures.min, ranges.pictures.max); i++) {
      pictures.push(`http://picsum.photos/300/150?r=${Math.random()}`);
    }
  }

  return pictures;
};

const getSingleObject = () => {
  const curType = utils.getRandomFromArray(eventTypes);

  return {
    type: curType.name,
    icon: iconsMap.get(curType.name),
    price: curType.price,
    offers: (curType.isOffers) ? utils.getUniqueArray(utils.getRandomInteger(ranges.offers.min, ranges.offers.max), offers) : [],
    sights: (curType.isSights) ? utils.getUniqueArray(utils.getRandomInteger(ranges.sights.min, ranges.sights.max), [...sightDescriptionsSet]) : [],
    pictures: getPictures(curType.isSights),
    timeStart: new Date(Date.now() - utils.getRandomInteger(ranges.time.min, ranges.time.max)),
    timeEnd: new Date(Date.now() + utils.getRandomInteger(ranges.time.min, ranges.time.max))
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
