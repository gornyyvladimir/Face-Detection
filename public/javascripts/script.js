  var form = document.forms.photo;
  var imageContainer = document.querySelector('.container');
  // var img = imageContainer.querySelector('.image');

  function faceRectangle(faces) {

      for (var i = 0; i < faces.length; i++) {

          var rect = document.createElement('DIV');
          rect.classList.add('face-rectangle');

          rect.style.width = faces[i].face_rectangle.width + 'px';
          rect.style.height = faces[i].face_rectangle.height + 'px';
          rect.style.top = faces[i].face_rectangle.top + 'px';
          rect.style.left = faces[i].face_rectangle.left + 'px';

          if (faces[i].attributes) {
              var info = document.createElement('SPAN');
              info.innerHTML = 'Age: ' + faces[i].attributes.age.value.toString() + ' Gender: ' + faces[i].attributes.gender.value;
              rect.append(info);
          }
          
          imageContainer.append(rect);
      }

  }

  function showImage(file) {
      var reader = new FileReader();

      reader.onload = function(e) {
          var dataURL = reader.result;
          var img = document.createElement('IMG');
          img.src = dataURL;
          imageContainer.append(img);
      }

      reader.readAsDataURL(file);
  }

  function upload(file) {

      var formData = new FormData();
      formData.append("photo", file);

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/detect");
      xhr.send(formData);

      xhr.onreadystatechange = function() {
          if (this.readyState != 4) return;

          // по окончании запроса доступны:
          // status, statusText
          // responseText, responseXML (при content-type: text/xml)

          if (this.status != 200) {
              // обработать ошибку
              alert('ошибка: ' + (this.status ? this.statusText : 'запрос не удался'));
              return;
          }
          // alert("All good");
          // console.log(this.responseText);
          console.log(JSON.parse(this.responseText));

          var faces = JSON.parse(this.responseText).faces;

          faceRectangle(faces);
      }

  }

  form.addEventListener('submit', function(event) {
      event.preventDefault();

      var file = form.photo.files[0];
      if (file) {
          imageContainer.innerHTML = '';
          showImage(file);
          upload(file);
      }
  });