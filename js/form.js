'use strict';

(function () {
  var REG_TIMES = ['12:00', '13:00', '14:00'];
  var APARTMENT_TYPES = ['flat', 'bungalo', 'house'];
  var PRICES = [1000, 0, 10000];
  var ROOM_NUMBERS = ['1', '2', '3', '100'];
  var CAPACITY_COUNTS = [['1'], ['1', '2'], ['1', '2', '3'], ['0']];

  var form = document.querySelector('.notice__form');
  var titleField = form.querySelector('#title');
  var timeInField = form.querySelector('#timein');
  var timeOutField = form.querySelector('#timeout');
  var flatTypeField = form.querySelector('#type');
  var priceField = form.querySelector('#price');
  var roomNumberField = form.querySelector('#room_number');
  var capacityField = form.querySelector('#capacity');
  var formElems = form.querySelectorAll('input:not([type="submit"]), select');
  var formSubmit = form.querySelector('.form__submit');

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
    Array.from(element.options).forEach(function (option) {
      option.disabled = !values.includes(option.value);
      if (!option.disabled) {
        element.value = option.value;
      }
    });
  };

  window.sync.synchronizeFields(timeInField, timeOutField, REG_TIMES, REG_TIMES, syncValues);
  window.sync.synchronizeFields(timeOutField, timeInField, REG_TIMES, REG_TIMES, syncValues);

  window.sync.synchronizeFields(flatTypeField, priceField, APARTMENT_TYPES, PRICES, syncValuesWithMin);

  window.sync.synchronizeFields(roomNumberField, capacityField, ROOM_NUMBERS, CAPACITY_COUNTS, syncSelectOptions);

  titleField.addEventListener('input', function () {
    titleField.setCustomValidity(
        titleField.validity.patternMismatch ?
          'Пожалуйста, используйте не менее 30 и не более 100 символов' :
          ''
    );
  });

  form.addEventListener('invalid', function () {
    Array.from(formElems).forEach(function (elem) {
      elem.classList.toggle('invalid', !elem.validity.valid);
    });
  }, true);

  form.addEventListener('submit', function (evt) {
    Array.from(formElems).forEach(function (elem) {
      elem.classList.remove('invalid');
    });
    evt.preventDefault();
    formSubmit.disabled = true;
    window.backend.save(new FormData(form), function () {
      formSubmit.disabled = false;
      form.reset();
    }, function (errorMessage) {
      formSubmit.disabled = false;
      window.util.errorHandler(errorMessage);
    });
  });

})();
