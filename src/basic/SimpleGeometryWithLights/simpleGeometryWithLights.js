/*
 * Most of this code is made up of bits and pieces from 
 * http://threejs.org/examples/#webgl_lights_hemisphere & http://threejs.org/docs/#Manual/Introduction/Creating_a_scene
 */

//Need to wait until window load. Waiting until document ready will not work if the other javascript files have not loaded in time
$(window).load(function() {
  init();
});

//Bare minimum things needed to display anything with threejs
var renderer, scene, camera, dirLight, hemiLight;

//array that holds all the meshes in the scene
var meshes = [];

function init() {

  //variables needed to instantiate a perspective camera in threejs. fov- field of view, near&far - clipping distances
  var fov, near, far;
  fov = 75;
  near = 0.1;
  far = 1000

  //Initialize our objects from before
  renderer = new THREE.WebGLRenderer({ antialiasing: true });
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
  camera.position.z = 100;

  //Setup the renderer
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement);
  renderer.shadowMapEnabled = true;

  //Setup lights
  hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  //set hue, saturation, lightness
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set( 0, 500, 0 );
  scene.add( hemiLight );

  dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.color.setHSL( 0.1, 1, 0.95 );
  dirLight.position.set( -20, 50.75, -20 );
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
  var boxGeometry, cylinderGeometry, octahedronGeometry, sphereGeometry, torusGeometry, groundGeometry;

  //Materials we will apply to the geometries
  var boxMat, cylinderMat, octahedronMat, sphereMat, torusMat, groundMat;

  //Meshes that get sent to the scene for each geometry
  var boxMesh, cylinderMesh, octahedronMesh, sphereMesh, torusMesh, groundMesh;

  //Setup geometry, materials and meshes. Then add to scene and array
  boxGeometry = new THREE.BoxGeometry(15, 15, 15);
  boxMat = new THREE.MeshPhongMaterial( { ambient: 0xa585b2, color: 0xa585b2, specular: 0x050505 } );
  boxMesh = new THREE.Mesh(boxGeometry, boxMat);
  scene.add(boxMesh);
  boxMesh.position.set( 15, 15, 0 );
  boxMesh.castShadow = true;
  boxMesh.receiveShadow = true;
  meshes.push(boxMesh);

  cylinderGeometry = new THREE.CylinderGeometry(4, 4, 16, 32);
  cylinderMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xFF8000, specular: 0xFF9A35 } );
  cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMat);
  scene.add(cylinderMesh);
  cylinderMesh.position.set( -15, 15, 0 );
  cylinderMesh.castShadow = true;
  cylinderMesh.receiveShadow = true;
  meshes.push(cylinderMesh);

  octahedronGeometry = new THREE.OctahedronGeometry(4, 0);
  octahedronMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0x008040, specular: 0x008080 } );
  octahedronMesh = new THREE.Mesh(octahedronGeometry, octahedronMat);
  scene.add(octahedronMesh);
  octahedronMesh.position.set( 15, -15, 0 );
  octahedronMesh.castShadow = true;
  octahedronMesh.receiveShadow = true;
  meshes.push(octahedronMesh);

  sphereGeometry = new THREE.SphereGeometry(4, 32, 32);
  sphereMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xFF0000, specular: 0xFF2B2B } );
  sphereMesh = new THREE.Mesh(sphereGeometry, sphereMat);
  scene.add(sphereMesh);
  sphereMesh.position.set( 0, 0, 0 );
  sphereMesh.castShadow = true;
  sphereMesh.receiveShadow = true;
  meshes.push(sphereMesh);

  torusGeometry = new THREE.TorusGeometry(12, 3, 20, 120);
  torusMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0x400080, specular: 0x8000FF } );
  torusMesh = new THREE.Mesh(torusGeometry, torusMat);
  scene.add(torusMesh);
  torusMesh.position.set( -15, -15, 0 );
  torusMesh.castShadow = true;
  torusMesh.receiveShadow = true;
  meshes.push(torusMesh);

  groundGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );
  groundMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xffffff, specular: 0x050505 } );
  groundMat.color.setHSL( 0.095, 1, 0.75 );
  groundMesh = new THREE.Mesh( groundGeometry, groundMat );
  groundMesh.rotation.x = -Math.PI/2;
  groundMesh.position.y = -30;
  scene.add( groundMesh );

  groundMesh.receiveShadow = true;
}

function render(){
  requestAnimationFrame( render );
  meshes.forEach(function(entry) {
      entry.rotation.x += 0.01;
      entry.rotation.y += 0.01;
      entry.position
  });
  renderer.render( scene, camera );
}