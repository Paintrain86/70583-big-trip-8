const getOffers = (offers) => {
  const offersHtml = offers.map((offer) => `
  <li>
    <button class="trip-point__offer">${offer.name} +&euro;&nbsp;${offer.price}</button>
  </li>`).join(``);

  return (offersHtml === ``) ? offersHtml : `<ul class="trip-point__offers">${offersHtml}</ul>`;
};

const getTwoDigitsMinutes = (num) => (num > 9) ? `${num}` : `0${num}`;

const getHoursAndMinutes = (date) => `${getTwoDigitsMinutes(date.getHours())}:${getTwoDigitsMinutes(date.getMinutes())}`;
const getTimeDifference = (dateStart, dateEnd) => {
  const timestampDiff = dateEnd.getTime() - dateStart.getTime();
  const daysDiff = Math.floor(timestampDiff / (24 * 60 * 60 * 1000));
  const hoursDiff = Math.floor((timestampDiff - daysDiff * 24 * 60 * 60 * 1000) / (60 * 60 * 1000));
  const minutesDiff = Math.floor((timestampDiff - daysDiff * 24 * 60 * 60 * 1000 - hoursDiff * 60 * 60 * 1000) / (60 * 1000));

  return `${(daysDiff > 0) ? `${daysDiff}d ` : ``}${hoursDiff}h ${minutesDiff}m`;
};

const getPoint = (object) => `
  <article class="trip-point">
    <i class="trip-icon">${object.icon}</i>
    <h3 class="trip-point__title">${object.type} to Airport</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${getHoursAndMinutes(object.timeStart)}&nbsp;&mdash; ${getHoursAndMinutes(object.timeEnd)}</span>
      <span class="trip-point__duration">${getTimeDifference(object.timeStart, object.timeEnd)}</span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${object.price}</p>
    ${getOffers(object.offers)}
  </article>
`;

export default getPoint;
