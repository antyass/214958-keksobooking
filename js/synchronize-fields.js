'use strict';

window.sync = (function () {

  /**
   * Синхронизирует значения полей
   * @param {HTMLSelectElement} firstField
   * @param {HTMLSelectElement} secondField
   * @param {array} firstValues
   * @param {array} secondValues
   * @param {Function} callback
   */
  var synchronizeFields = function (firstField, secondField, firstValues, secondValues, callback) {
    synchronizeHandler(firstField, secondField, firstValues, secondValues, callback);
    firstField.addEventListener('change', function () {
      synchronizeHandler(firstField, secondField, firstValues, secondValues, callback);
    });
  };

  var synchronizeHandler = function (firstField, secondField, firstValues, secondValues, callback) {
    var index = firstValues.indexOf(firstField.value);
    callback(secondField, secondValues[index]);
  };

  return {
    synchronizeFields: synchronizeFields
  };

})();
