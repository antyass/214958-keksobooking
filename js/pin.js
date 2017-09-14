'use strict';

window.pin = (function () {

  var ACTIVE_PIN = 'pin--active';
  var PIN_SIZE = {
    WIDTH: 56,
    HEIGHT: 75
  };

  /**
   * Активирует пин
   * @param {Event} evt
   */
  var activatePin = function (evt) {
    deactivatePin();
    var target = evt.currentTarget;
    target.classList.add(ACTIVE_PIN);
    window.pin.activateHandler(target.dataset.ad);
  };

  /**
   * Обрабатывает событие нажатия клавиши enter или клика на пин
   * @param {Event} evt
   */
  var pinEventHandler = function (evt) {
    window.util.isEnterEvent(evt, activatePin);
  };

  /**
   * Создаёт метку на карте
   * @param {Ad} ad
   * @param {number} index индекс элемента массива
   * @param {object} pinInfo объект с информацией о пине
   * @return {HTMLDivElement}
   */
  var createPin = function (ad, index) {
    var div = document.createElement('div');
    div.classList.add('pin');
    div.setAttribute('tabindex', '0');
    div.dataset.ad = index;
    div.style.left = ad.location.x - PIN_SIZE.WIDTH / 2 + 'px';
    div.style.top = ad.location.y - PIN_SIZE.HEIGHT + 'px';
    div.innerHTML = '<img src="' + ad.author.avatar + '" class="rounded" width="40" height="40">';
    div.addEventListener('click', activatePin);
    div.addEventListener('keydown', pinEventHandler);
    return div;
  };

  /**
   * Деактивирует активный пин
   */
  var deactivatePin = function () {
    var activePin = document.querySelector('.' + ACTIVE_PIN);
    if (activePin) {
      activePin.classList.remove(ACTIVE_PIN);
    }
  };

  /**
   * Создаёт пины из массива объектов
   * @param {Array.<Ad>} ads
   * @return {DocumentFragment}
   */
  var createPins = function (ads) {
    return window.util.getFragment(ads, createPin);
  };

  return {
    deactivate: deactivatePin,
    createPins: createPins
  };

})();
