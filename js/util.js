'use strict';

window.util = (function () {

  var KEYS = {
    ESC: 27,
    ENTER: 13
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

  /**
   * Создаёт DOM-элемент с сообщением об ошибке
   * @param {string} errorMessage
   */
  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error');
    node.textContent = errorMessage;

    document.body.appendChild(node);
  };

  return {
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent,
    getFragment: getFragment,
    errorHandler: errorHandler
  };

})();
