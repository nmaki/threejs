/*
 * Most of this code is made up of bits and pieces from 
 * http://threejs.org/examples/#webgl_lights_hemisphere & http://threejs.org/docs/#Manual/Introduction/Creating_a_scene
 */

//Need to wait until window load. Waiting until document ready will not work if the other javascript files have not loaded in time
$(window).load(function() {
  initAudio();
  initGraphics();
});

//Stuff needed for audio analysation
var audioCtx, analyser, bufferLength, dataArray

//Bare minimum things needed to display anything with threejs
var renderer, scene, camera, dirLight, hemiLight;

//array that holds all the meshes in the scene
var meshes = [];


function initAudio() {
  ctx = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
  var audio = document.getElementById('myAudio');
  audioSrc = ctx.createMediaElementSource(audio);
  analyser = ctx.createAnalyser();
  
  audioSrc.connect(analyser);
  analyser.connect(ctx.destination);
  analyser.fftSize = 2048;

  bufferLength = analyser.frequencyBinCount;
  
  dataArray = new Uint8Array(bufferLength);
 
  audio.play(); 
}

function initGraphics() {

  //variables needed to instantiate a perspective camera in threejs. fov- field of view, near&far - clipping distances
  var fov, near, far;
  fov = 75;
  near = 0.1;
  far = 1500

  //Initialize our objects from before
  renderer = new THREE.WebGLRenderer({ antialiasing: true });
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
  camera.position.x = 1250;
  camera.position.y = 125;
  camera.position.z = 950;


  //Setup the renderer
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement);
  renderer.shadowMapEnabled = true;

  //Setup lights
  hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.9);
  //set hue, saturation, lightness
  hemiLight.color.setHSL(0.6, 1, 0.9);
  hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set( 0, 500, 0 );
  scene.add( hemiLight );

  dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.color.setHSL( 0.1, 1, 0.95 );
  dirLight.position.set( 0, 40, 20 );
  dirLight.position.multiplyScalar( 50 );
  scene.add( dirLight );

  dirLight.castShadow = true;

  dirLight.shadowMapWidth = 2048;
  dirLight.shadowMapHeight = 2048;

  var d = 50;

  dirLight.shadowCameraLeft = -d;
  dirLight.shadowCameraRight = d;
  dirLight.shadowCameraTop = d;
  dirLight.shadowCameraBottom = -d;

  dirLight.shadowCameraFar = 3500;
  dirLight.shadowBias = -0.0001;
  dirLight.shadowDarkness = 0.5;
  //dirLight.shadowCameraVisible = true;

  draw();
  render();
}

//Basic function to add objects to the scene
function draw() {
  //Some geometries that we want to draw, all provided by threejs library
  var boxGeometry;

  //Materials we will apply to the geometries
  var boxMat;

  //Meshes that get sent to the scene for each geometry
  var boxMesh;

  for(var i=0;i<256;i++) {
    //Setup geometry, materials and meshes. Then add to scene and array
    boxGeometry = new THREE.BoxGeometry(10, 1, 10);
    boxMat = new THREE.MeshPhongMaterial( { ambient: 0xa585b2, color: 0xa585b2, specular: 0x050505 } );
    boxMesh = new THREE.Mesh(boxGeometry, boxMat);
    scene.add(boxMesh);
    boxMesh.position.set( i*10, 0, 0 );
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    meshes.push(boxMesh);
  }


  groundGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );
  groundMat = new THREE.MeshPhongMaterial( { ambient: 0x000000, color: 0x000000, specular: 0xFFFFFF } );
  //groundMat.color.setHSL( 0.095, 1, 0.75 );
  groundMesh = new THREE.Mesh( groundGeometry, groundMat );
  //groundMesh.rotation.x = -Math.PI/2;
  groundMesh.position.z = -5;
  groundMesh.position.y = 0;
  scene.add( groundMesh );

  groundMesh.receiveShadow = true;
}

function render(){
  //Call the render method, renders @ 60 fps
  requestAnimationFrame( render );
  //put our adio data into the buffer
  analyser.getByteTimeDomainData(dataArray);
  //Shrink the bar every time, no reasoning behind the .85 rate of decay
  meshes.forEach(function(entry) {
    entry.scale.y *= .85;
  });
  //Add two every time, also no reasoning behind a growth of 2
  for(var i=0;i<bufferLength;i++) {
      var v = Math.floor(dataArray[i]);
      //if(!(meshes[v].scale.y > 550))
        meshes[v].scale.y +=2;
  }
  
  renderer.render( scene, camera );
}