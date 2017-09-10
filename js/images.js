'use strict';

(function () {

  var FILE_TYPES = ['gif', 'png', 'jpg', 'jpeg'];
  var UPLOAD_HOVER = 'upload-highlighted';
  var draggedItem;
  var cellForImage;
  var photoContainer = document.querySelector('.form__photo-container');
  var cells = photoContainer.querySelectorAll('.form__photo');
  var avatarUpload = document.querySelector('.notice__photo .upload');
  var avatarChooser = avatarUpload.querySelector('input[type=file]');
  var preview = document.querySelector('.notice__preview img');
  var imgUpload = photoContainer.querySelector('.form__photo-container .upload');
  var imgChooser = imgUpload.querySelector('input[type=file]');
  var imgPin = document.querySelector('.pin__main img');

  /**
   * Добавляет изображения в ячейки
   * @param {Array.<File>} files
   */
  var previewImages = function (files) {
    var emptyCells = document.querySelectorAll('.form__photo:empty');
    if (emptyCells.length < files.length) {
      var cellsNeeded = files.length - emptyCells.length;
      var imgToClear = Array.from(photoContainer.querySelectorAll('.user-photo')).slice(-cellsNeeded);

      imgToClear.forEach(function (img) {
        img.remove();
      });

      emptyCells = document.querySelectorAll('.form__photo:empty');

      emptyCells.forEach(function (emptyCell) {
        photoContainer.insertBefore(emptyCell, cells[0]);
      });

      cells = photoContainer.querySelectorAll('.form__photo');
    }

    files.forEach(function (file, index) {
      window.util.loadFileAsDataUrl(file, function (reader) {
        var img = document.createElement('img');
        img.classList.add('user-photo');
        img.src = reader.result;
        emptyCells[index].appendChild(img);
      });
    });
  };

  /**
   * Проверяет файл по расширению
   * @param {File} file
   * @return {Boolean}
   */
  var isFileMatch = function (file) {
    var fileName = file.name.toLowerCase();
    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  };

  avatarChooser.addEventListener('change', function () {
    var file = avatarChooser.files[0];
    if (isFileMatch(file)) {
      window.util.loadFileAsDataUrl(file, function (reader) {
        imgPin.src = preview.src = reader.result;
      });
    }
  });

  avatarChooser.addEventListener('dragenter', function (evt) {
    avatarUpload.classList.add(UPLOAD_HOVER);
    evt.preventDefault();
  });

  avatarChooser.addEventListener('dragleave', function (evt) {
    avatarUpload.classList.remove(UPLOAD_HOVER);
    evt.preventDefault();
  });

  avatarChooser.addEventListener('drop', function () {
    avatarUpload.classList.remove(UPLOAD_HOVER);
  });

  imgChooser.addEventListener('change', function () {
    previewImages(Array.from(imgChooser.files).filter(isFileMatch).slice(0, 16));
  });

  imgChooser.addEventListener('dragenter', function () {
    imgUpload.classList.add(UPLOAD_HOVER);
  });

  imgChooser.addEventListener('dragleave', function (evt) {
    imgUpload.classList.remove(UPLOAD_HOVER);
    evt.preventDefault();
  });

  imgChooser.addEventListener('drop', function () {
    imgUpload.classList.remove(UPLOAD_HOVER);
  });

  photoContainer.addEventListener('dragstart', function (evt) {
    if (evt.target.tagName.toLowerCase() === 'img') {
      draggedItem = evt.target;
      evt.dataTransfer.setData('text/plain', evt.target.alt);
      cellForImage = evt.target.parentElement;
    }
  });

  photoContainer.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });

  photoContainer.addEventListener('drop', function (evt) {
    if (evt.target.classList.contains('form__photo') && !evt.target.hasChildNodes()) {
      evt.target.appendChild(draggedItem);
    } else if (evt.target.parentElement.classList.contains('form__photo') && draggedItem) {
      evt.target.parentElement.appendChild(draggedItem);
      cellForImage.appendChild(evt.target.parentElement.firstChild);
    }
    return false;
  });

})();
