'use strict';

(function () {

  /**
   * Синхронизирует значения полей
   * @param {HTMLSelectElement} firstField
   * @param {HTMLSelectElement} secondField
   * @param {array} firstValues
   * @param {array} secondValues
   * @param {Function} action
   */
  window.synchronizeFields = function (firstField, secondField, firstValues, secondValues, action) {
    firstField.addEventListener('change', function () {
      var index = firstValues.indexOf(firstField.value);
      action(secondField, secondValues[index]);
    });
  };

})();
