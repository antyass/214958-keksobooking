'use strict';

window.map = (function () {

  /**
   * Объявление
   * @typedef {object} Ad
   */

  var MAIN_PIN_SIZE = {
    WIDTH: 75,
    HEIGHT: 94
  };
  var LOCATION = {
    X: {
      MIN: 300,
      MAX: 900
    },
    Y: {
      MIN: 100,
      MAX: 500
    }
  };

  var ads;
  var filtered;
  var pinMap = document.querySelector('.tokyo__pin-map');
  var pinMain = pinMap.querySelector('.pin__main');
  var form = document.querySelector('.notice__form');
  var addressField = form.querySelector('#address');
  var filtersForm = document.querySelector('.tokyo__filters');
  var houseField = filtersForm.querySelector('#housing_type');
  var priceField = filtersForm.querySelector('#housing_price');
  var roomsField = filtersForm.querySelector('#housing_room-number');
  var guestsField = filtersForm.querySelector('#housing_guests-number');
  var featuresSet = filtersForm.querySelectorAll('.tokyo__filter-set input');

  /**
   * Запускает функцию открытия диалога при активации пина
   * @param {number} adIndex
   */
  window.pin.onActivate = function (adIndex) {
    window.card.open(filtered[adIndex]);
  };

  /**
   * Запускает функцию деактивации пина при закрытии диалога
   */
  window.card.onDeactivate = function () {
    window.pin.deactivate();
  };

  /**
   * Синхронизирует координаты поля с пином
   * @param {number} x
   * @param {number} y
   */
  var syncFieldWithPin = function (x, y) {
    addressField.value = 'x: ' + parseInt(x, 10) + ', y: ' + parseInt(y, 10);
  };

  /**
   * Синхронизирует координаты пина с полем
   */
  var syncPinWithField = function () {
    var coords = addressField.value.match(/\d+/g);

    var coordX = checkLimit(parseInt(coords[0], 10), LOCATION.X.MIN, LOCATION.X.MAX);
    var coordY = checkLimit(parseInt(coords[1], 10), LOCATION.Y.MIN, LOCATION.Y.MAX);

    setPinCoords(coordX, coordY);
  };

  /**
   * Устанавливает положение пина на карте
   * @param {number} x
   * @param {number} y
   */
  var setPinCoords = function (x, y) {
    pinMain.style.left = x - MAIN_PIN_SIZE.WIDTH / 2 + 'px';
    pinMain.style.top = y - MAIN_PIN_SIZE.HEIGHT + 'px';
  };

  /**
   * Возвращает число в заданные границы
   * @param {number} number
   * @param {number} limitMin
   * @param {number} limitMax
   * @return {number}
   */
  var checkLimit = function (number, limitMin, limitMax) {
    return Math.min(Math.max(number, limitMin), limitMax);
  };

  /**
   * Возвращает массив объявлений
   * @param {Array.<Ad>} response
   */
  var getAds = function (response) {
    ads = response;
    filtered = response;
    updatePins(ads);
  };

  window.backend.load(getAds, window.util.errorHandler);

  /**
   * Обновляет количество пинов на карте
   * @param {Array.<Ad>} adverts
   */
  var updatePins = function (adverts) {
    window.card.close();
    var pins = window.pin.createPins(adverts);
    var oldPins = pinMap.querySelectorAll('.pin:not(.pin__main)');
    oldPins.forEach(function (pin) {
      pin.parentElement.removeChild(pin);
    });
    pinMap.appendChild(pins);
  };

  var refreshPins = window.util.debounce(function () {
    updatePins(filtered);
  });

  /**
   * Фильтрует пины по типу жилья
   * @param {Ad} ad
   * @return {Boolean}
   */
  var isTypeMatch = function (ad) {
    return houseField.value === 'any' ?
      true :
      ad.offer.type === houseField.value;
  };

  /**
   * Фильтрует пины по количеству комнат
   * @param {Ad} ad
   * @return {Boolean}
   */
  var isRoomsMatch = function (ad) {
    return roomsField.value === 'any' ?
      true :
      ad.offer.rooms === parseInt(roomsField.value, 10);
  };

  /**
   * Фильтрует пины по количеству гостей
   * @param {Ad} ad
   * @return {Boolean}
   */
  var isGuestsMatch = function (ad) {
    return guestsField.value === 'any' ?
      true :
      ad.offer.guests === parseInt(guestsField.value, 10);
  };

  /**
   * Фильтрует пины по цене
   * @param {Ad} ad
   * @return {Boolean}
   */
  var isPricesMatch = function (ad) {
    var priceFiltered;
    switch (priceField.value) {
      case 'any':
        priceFiltered = true;
        break;
      case 'middle':
        priceFiltered = ad.offer.price <= 50000 && ad.offer.price >= 10000;
        break;
      case 'low':
        priceFiltered = ad.offer.price < 10000;
        break;
      case 'high':
        priceFiltered = ad.offer.price > 50000;
        break;
    }
    return priceFiltered;
  };

  /**
   * Фильтрует пины по имеющимся особенностям
   * @param {Ad} ad
   * @return {Boolean}
   */
  var isFeaturesMatch = function (ad) {
    return Array.from(featuresSet).every(function (feature) {
      return !feature.checked || ad.offer.features.includes(feature.value);
    });
  };

  var fnFilters = [isTypeMatch, isRoomsMatch, isGuestsMatch, isPricesMatch, isFeaturesMatch];
  filtersForm.addEventListener('change', function () {
    filtered = ads.filter(function (ad) {
      return fnFilters.every(function (fn) {
        return fn(ad);
      });
    });
    refreshPins();
  });

  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var shift = {
      x: evt.clientX - pinMain.offsetLeft,
      y: evt.clientY - pinMain.offsetTop
    };

    var mouseMoveEventHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var newX = checkLimit(startCoords.x - shift.x + MAIN_PIN_SIZE.WIDTH / 2, LOCATION.X.MIN, LOCATION.X.MAX);
      var newY = checkLimit(startCoords.y - shift.y + MAIN_PIN_SIZE.HEIGHT, LOCATION.Y.MIN, LOCATION.Y.MAX);

      setPinCoords(newX, newY);
      syncFieldWithPin(newX, newY);
    };

    var mouseUpEventHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveEventHandler);
      document.removeEventListener('mouseup', mouseUpEventHandler);
    };

    document.addEventListener('mousemove', mouseMoveEventHandler);
    document.addEventListener('mouseup', mouseUpEventHandler);
  });

  addressField.addEventListener('keyup', syncPinWithField);

})();
