'use strict';

window.map = (function () {

  var NUMBER_OF_ADS = 8;
  var ads = window.data.getAds(NUMBER_OF_ADS);
  var pins = window.pin.createPins(ads);
  var pinMap = document.querySelector('.tokyo__pin-map');
  pinMap.appendChild(pins);

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

})();
