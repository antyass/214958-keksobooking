'use strict';

(function () {
  var form = document.querySelector('.notice__form');
  var titleField = form.querySelector('#title');
  var timeInField = form.querySelector('#timein');
  var timeOutField = form.querySelector('#timeout');
  var flatTypeField = form.querySelector('#type');
  var priceField = form.querySelector('#price');
  var roomNumberField = form.querySelector('#room_number');
  var capacityField = form.querySelector('#capacity');
  var formElems = form.querySelectorAll('input:not([type="submit"]), select');

  var REG_TIMES = ['12:00', '13:00', '14:00'];
  var APARTMENT_TYPES = ['flat', 'bungalo', 'house', 'palace'];
  var PRICE_PER_NIGHT = [1000, 0, 5000, 10000];
  var ROOM_NUMBERS = ['1', '2', '3', '100'];
  var CAPACITY_COUNT = [['1'], ['1', '2'], ['1', '2', '3'], ['0']];

  /**
   * Синхронизирует значение
   * @param {HTMLInputElement} element
   * @param {*} value
   */
  var syncValues = function (element, value) {
    element.value = value;
  };

  /**
   * Синхронизирует минимальное значение
   * @param {HTMLInputElement} element
   * @param {*} value
   */
  var syncValuesWithMin = function (element, value) {
    element.min = value;
  };

  /**
   * Синхронизирует значения
   * @param {HTMLSelectElement} element
   * @param {*} values
   */
  var syncSelectOptions = function (element, values) {
    for (var i = 0; i < element.options.length; i++) {
      element.options[i].disabled = !values.includes(element.options[i].value);
      if (!element.options[i].disabled) {
        element.value = element.options[i].value;
      }
    }
  };

  window.synchronizeFields(timeInField, timeOutField, REG_TIMES, REG_TIMES, syncValues);
  window.synchronizeFields(timeOutField, timeInField, REG_TIMES, REG_TIMES, syncValues);

  window.synchronizeFields(flatTypeField, priceField, APARTMENT_TYPES, PRICE_PER_NIGHT, syncValuesWithMin);

  window.synchronizeFields(roomNumberField, capacityField, ROOM_NUMBERS, CAPACITY_COUNT, syncSelectOptions);

  titleField.addEventListener('input', function () {
    titleField.setCustomValidity(
        titleField.validity.patternMismatch ?
          'Пожалуйста, используйте не менее 30 символов' :
          ''
    );
  });

  form.addEventListener('invalid', function () {
    formElems.forEach(function (elem) {
      elem.classList.toggle('invalid', !elem.validity.valid);
    });
  }, true);
})();
