'use strict';

window.util = (function () {

  var KEYS = {
    ESC: 27,
    ENTER: 13
  };

  /**
   * @param {number} min
   * @param {number} max
   * @return {number} Рандомное число от min до max
   */
  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  /**
   * @param {array} array
   * @return {*} Рандомный элемент массива
   */
  var getRandomArrayElem = function (array) {
    return array[window.util.getRandomNumber(0, array.length - 1)];
  };

  /**
   * Создаёт массив, состоящий из сгенерированных объектов
   * @param {number} length
   * @param {function} getItem
   * @param {boolean} uniq - Если true, элементы в массиве будут уникальными
   * @return {array}
   */
  var getRandomArray = function (length, getItem, uniq) {
    var items = [];
    while (items.length !== length) {
      var item = getItem();
      if (!(uniq && items.includes(item))) {
        items.push(item);
      }
    }
    return items;
  };

  /**
   * Обрабатывает событие нажатия клавиши enter
   * @param {Event} evt
   * @param {Function} action
   */
  var isEnterEvent = function (evt, action) {
    if (evt.keyCode === KEYS.ENTER) {
      action(evt);
    }
  };

  /**
   * Обрабатывает событие нажатия клавиши escape
   * @param {Event} evt
   * @param {Function} action
   */
  var isEscEvent = function (evt, action) {
    if (evt.keyCode === KEYS.ESC) {
      action(evt);
    }
  };

  /**
   * Заполняет блок DOM-элементами на основе массива JS-объектов
   * @param {array} array
   * @param {function} fn
   * @return {DocumentFragment}
   */
  var getFragment = function (array, fn) {
    var fragment = document.createDocumentFragment();

    array.forEach(function (elem, index) {
      fragment.appendChild(fn(elem, index));
    });

    return fragment;
  };

  return {
    getRandomNumber: getRandomNumber,
    getRandomArrayElem: getRandomArrayElem,
    getRandomArray: getRandomArray,
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent,
    getFragment: getFragment
  };

})();
