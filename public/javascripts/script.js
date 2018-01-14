  var form = document.forms.photo;
  var imageContainer = document.querySelector('.container');
  var facesGlobal;
  // var img = imageContainer.querySelector('.image');

  function demoVanilla(file) {
		var vEl = document.querySelector('.container'),
			vanilla = new Croppie(vEl, {
			viewport: { width: 100, height: 100 },
			boundary: { width: 800, height: 600 },
			showZoomer: false,
            enableOrientation: true
		});

    function readFile(file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        vanilla.bind({
          url: e.target.result
        });
      }
      reader.readAsDataURL(file);
    }


      var btn = document.querySelector('.crop');
      btn.addEventListener('click', function(e) {
      var img=new Image();
			vanilla.result({
				type: 'base64'
			}).then(function (base64) {
					img.src=base64;
          imageContainer.appendChild(img);
			});
    });


      readFile(file);
	// }
}


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

          facesGlobal = JSON.parse(this.responseText).faces;
          var faces = JSON.parse(this.responseText).faces;

          faceRectangle(faces);
      }

  }

  function add() {

    var json = JSON.stringify({faceToken: facesGlobal[0].face_token});


    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/add");
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
            // обработать ошибку
            alert('ошибка: ' + (this.status ? this.statusText : 'запрос не удался'));
            return;
        }
        // alert("All good");
        // console.log(this.responseText);
        console.log(JSON.parse(this.responseText));
    }
    xhr.send(json);
  }

  var button = document.querySelector('.add');
  button.addEventListener("click", function(event){
    add();
  });

  form.addEventListener('submit', function(event) {
      event.preventDefault();

      var file = form.photo.files[0];
      if (file) {
          imageContainer.innerHTML = '';
          // showImage(file);
          demoVanilla(file);
          upload(file);
      }
  });
