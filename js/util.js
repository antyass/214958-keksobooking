'use strict';

window.util = (function () {

  var KEYS = {
    ESC: 27,
    ENTER: 13
  };
  var DEBOUNCE_INTERVAL = 500;

  /**
   * Обрабатывает событие нажатия клавиши enter
   * @param {Event} evt
   * @param {Function} callback
   */
  var isEnterEvent = function (evt, callback) {
    if (evt.keyCode === KEYS.ENTER) {
      callback(evt);
    }
  };

  /**
   * Обрабатывает событие нажатия клавиши escape
   * @param {Event} evt
   * @param {Function} callback
   */
  var isEscEvent = function (evt, callback) {
    if (evt.keyCode === KEYS.ESC) {
      callback(evt);
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

  /**
   * «Устраняет дребезг» при частом вызове той функции, которую ей передают
   * @param {Function} func
   * @return {number}
   */
  var debounce = function (func) {
    var lastTimeout;
    return function () {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(func, DEBOUNCE_INTERVAL);
      return lastTimeout;
    };
  };

  /**
   * Обрабатывает загрузку файла
   * @param {File} file
   * @param {Function} callback
   */
  var loadFileAsDataUrl = function (file, callback) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      callback(reader);
    });
    reader.readAsDataURL(file);
  };

  return {
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent,
    getFragment: getFragment,
    errorHandler: errorHandler,
    debounce: debounce,
    loadFileAsDataUrl: loadFileAsDataUrl
  };

})();
