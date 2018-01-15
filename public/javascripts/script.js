  var form = document.forms.photo;
  var imageContainer = document.querySelector('.container');
  // var img = imageContainer.querySelector('.image');

  function cropImage() {

		var container = document.querySelector('.crop-image__wrapper');
		var croppie = new Croppie(container, {
			viewport: { width: 200, height: 200 },
			boundary: { width: 600, height: 600 },
      enableResize: true,
      enableOrientation: true
		});

    function readFile(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          document.querySelector('.crop-image').classList.add('ready');
          croppie.bind({
            url: e.target.result
          });
        }
        reader.readAsDataURL(input.files[0]);
      }
      else {
        console.log("Your browser does not support the FileReader API")
      }
    }

    var upload = document.querySelector('#upload');
    upload.addEventListener('change', function(){readFile(this)});

      var btn = document.querySelector('.crop');
      btn.addEventListener('click', function(e) {
        croppie.result({
          type: 'base64',
          format: 'jpeg'
        }).then(function (base64) {
            var img=new Image();
  					img.src=base64;
            var result = document.querySelector('.crop-image__result');
            result.innerHTML = '';
            result.appendChild(img);
  			});
    });
}


  function faceRectangle(faces, container) {

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
          container.appendChild(rect);
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

  function detect() {

    var result = document.querySelector('.crop-image__result img');
    //удалить сначала data:base64...
    var imageBase64 = result.src.split(',')[1];

    console.log(imageBase64);

    fetch('/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_base64: imageBase64
      })
    })
    .then(function(response){
      return response.json()
    })
    .then(function(data){
      console.log(data);
      faceRectangle(data.faces, document.querySelector('.crop-image__result'));
    })
    .catch(function(error) {
      console.log('request failed', error)
    });
  }


  // function add() {

  //   var json = JSON.stringify({faceToken: facesGlobal[0].face_token});


  //   var xhr = new XMLHttpRequest();
  //   xhr.open("POST", "/add");
  //   xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

  //   xhr.onreadystatechange = function() {
  //       if (this.readyState != 4) return;
  //       if (this.status != 200) {
  //           // обработать ошибку
  //           alert('ошибка: ' + (this.status ? this.statusText : 'запрос не удался'));
  //           return;
  //       }
  //       // alert("All good");
  //       // console.log(this.responseText);
  //       console.log(JSON.parse(this.responseText));
  //   }
  //   xhr.send(json);
  // }

  // var button = document.querySelector('.add');
  // button.addEventListener("click", function(event){
  //   add();
  // });

  form.addEventListener('submit', function(event) {
      event.preventDefault();

      // var file = form.photo.files[0];
      // if (file) {
      //     imageContainer.innerHTML = '';
      //     // showImage(file);
      //     demoVanilla(file);
      //     upload(file);
      // }
      detect();
  });

  cropImage();
