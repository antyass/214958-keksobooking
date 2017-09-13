'use strict';

window.backend = (function () {
  var GET_DATA_URL = 'https://1510.dump.academy/keksobooking/data';
  var SEND_DATA_URL = 'https://1510.dump.academy/keksobooking';

  /**
   * Возвращает объект XMLHttpRequest
   * @param {Function} loadEventHandler
   * @param {Function} errorEventHandler
   * @return {XMLHttpRequest}
   */
  var setup = function (loadEventHandler, errorEventHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        loadEventHandler(xhr.response);
      } else {
        errorEventHandler('Неизвестный статус: ' + xhr.status + '' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      errorEventHandler('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      errorEventHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  };

  /**
   * Загружает данные
   * @param {Function} loadEventHandler
   * @param {Function} errorEventHandler
   */
  var load = function (loadEventHandler, errorEventHandler) {
    var xhr = setup(loadEventHandler, errorEventHandler);

    xhr.open('GET', GET_DATA_URL);
    xhr.send();
  };

  /**
   * Отправляет данные
   * @param {FormData} data
   * @param {Function} loadEventHandler
   * @param {Function} errorEventHandler
   */
  var save = function (data, loadEventHandler, errorEventHandler) {
    var xhr = setup(loadEventHandler, errorEventHandler);

    xhr.open('POST', SEND_DATA_URL);
    xhr.send(data);
  };

  return {
    load: load,
    save: save
  };

})();
