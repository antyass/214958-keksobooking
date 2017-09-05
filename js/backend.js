'use strict';

window.backend = (function () {
  var GET_DATA_URL = 'https://1510.dump.academy/keksobooking/data';
  var SEND_DATA_URL = 'https://1510.dump.academy/keksobooking';

  /**
   * Возвращает объект XMLHttpRequest
   * @param {Function} onLoad
   * @param {Function} onError
   * @return {XMLHttpRequest}
   */
  var setup = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + '' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  };

  /**
   * Загружает данные
   * @param {Function} onLoad
   * @param {Function} onError
   */
  var load = function (onLoad, onError) {
    var xhr = setup(onLoad, onError);

    xhr.open('GET', GET_DATA_URL);
    xhr.send();
  };

  /**
   * Отправляет данные
   * @param {FormData} data
   * @param {Function} onLoad
   * @param {Function} onError
   */
  var save = function (data, onLoad, onError) {
    var xhr = setup(onLoad, onError);

    xhr.open('POST', SEND_DATA_URL);
    xhr.send(data);
  };

  return {
    load: load,
    save: save
  };

})();
