var cropImageContainer = document.querySelector('.crop-image');
var croppieContainer = document.querySelector('.crop-image-croppie');
var searchResultContainer = document.querySelector('.search-wrapper');
var cropImageResult = document.querySelector('.crop-image-result');

  function init() {
    cropImage();
  }

  function cropImage() {
    var container = croppieContainer;
    var croppie = new Croppie(container, {
      viewport: { width: 400, height: 400 },
      showZoomer: false,
      enableResize: true,
      enableOrientation: true
    });

    function readFile(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          cropImageContainer.classList.remove('result');
          cropImageContainer.classList.add('ready');
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
    upload.addEventListener('change', function() {
      readFile(this);
      searchResultContainer.classList.add('hidden');
    });

      var btn = document.querySelector('.crop');
      btn.addEventListener('click', function(e) {
        croppie.result({
          type: 'base64',
          format: 'jpeg'
        }).then(function (base64) {
            var img=new Image();
            img.src=base64;
            cropImageContainer.classList.remove('ready');
            cropImageContainer.classList.add('result');
            var result = cropImageResult;
            result.innerHTML = '';
            result.appendChild(img);
        });
    });

    var rotate = document.querySelectorAll('.rotate');
    console.log(rotate);
    for(var i=0; i<rotate.length; i++){
      rotate[i].addEventListener('click', function(e){
        croppie.rotate(parseInt(this.dataset.deg));
      });
    }
}


  function faceRectangle(data, container) {
    var faces = data.faces;
    if(!faces) return;
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
        var img = container.querySelector('img');
        img.dataset.faceToken = faces[i].face_token;
        container.appendChild(rect);
    }
  }

  function detectFace() {
    var result = cropImageResult.querySelector('img');
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
      faceRectangle(data, cropImageResult);
    })
    .catch(function(error) {
      console.log('request failed', error)
    });
  }

  function addFace() {

    var form = document.querySelector('form');
    var result = cropImageResult.querySelector('img');
    var imageBase64 = result.src.split(',')[1];
    var username = document.querySelector('#username')

    fetch('/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_base64: imageBase64,
          face_tokens: result.dataset.faceToken,
          username: username.value
        })
      })
      .then(function(response){
        return response.json()
      })
      .catch(function(error) {
        console.log('request failed', error)
      });
  }

  function searchFace() {
    var form = document.querySelector('form');
    var container = document.querySelector('.search-result');
    var result = cropImageResult.querySelector('img');
    var imageBase64 = result.src.split(',')[1];
    var username = document.querySelector('#username')

    fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          face_tokens: result.dataset.faceToken
        })
      })
      .then(function(response){
        return response.json();
      })
      .then(function(data){
        var imageBase64 = data.image;
        imageBase64 = 'data:image/jpeg;base64,' + imageBase64;
        var img = new Image();
        img.src = imageBase64;
        img.width = cropImageResult.offsetWidth;
        img.height = cropImageResult.offsetHeight;
        searchResultContainer.classList.remove('hidden');
        container.innerHTML = "";
        container.appendChild(img);
      })
      .catch(function(error) {
        console.log('request failed', error);
      });
  }

//клик по кнопке submit
var detect = document.querySelector('.detect');
detect.addEventListener('click', function(event) {
  detectFace();
});

var add = document.querySelector('.add');
add.addEventListener('click', function(e) {
  console.log('add');
  addFace();
})

var search = document.querySelector('.search');
search.addEventListener('click', function(e) {
  console.log('search');
  searchFace();
})

//запуск инициализации
init();
