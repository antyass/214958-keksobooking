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
  var pinMap = document.querySelector('.tokyo__pin-map');
  var pinMain = pinMap.querySelector('.pin__main');
  var form = document.querySelector('.notice__form');
  var addressField = form.querySelector('#address');

  /**
   * Запускает функцию открытия диалога при активации пина
   * @param {number} adIndex
   */
  window.pin.onActivate = function (adIndex) {
    window.card.open(ads[adIndex]);
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
    var pins = window.pin.createPins(response);
    pinMap.appendChild(pins);
  };

  window.backend.load(getAds, window.util.errorHandler);

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
