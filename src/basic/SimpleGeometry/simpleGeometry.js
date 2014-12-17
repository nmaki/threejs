//Need to wait until window load. Waiting until document ready will not work if the other javascript files have not loaded in time
$(window).load(function() {
  init();
});

//Bare minimum things needed to display anything with threejs
var renderer, scene, camera;

var meshes = [];

function init() {

  //variables needed to instantiate a perspective camera in threejs. fov- field of view, near&far - clipping distances
  var fov, near, far;
  fov = 75;
  near = 0.1;
  far = 1000

  //Initialize our objects from before
  renderer = new THREE.WebGLRenderer();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
  camera.position.z = 50;
  //Set up the renderer
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement);

  draw();
  render();
}

//Basic function to add objects to the scene
function draw() {
  //Some geometries that we want to draw, all provided by threejs library
  var boxGeometry, cylinderGeometry, octahedronGeometry, sphereGeometry, torusGeometry;

  //Materials we will apply to the geometries
  var boxMat, cylinderMat, octahedronMat, sphereMat, torusMat;

  //Meshes that get sent to the scene for each geometry
  var boxMesh, cylinderMesh, octahedronMesh, sphereMesh, torusMesh;

  boxGeometry = new THREE.BoxGeometry(2, 2, 2);
  boxMat = new THREE.MeshBasicMaterial( { "color": "#FF0000" } );
  boxMesh = new THREE.Mesh(boxGeometry, boxMat);
  scene.add(boxMesh);
  boxMesh.position.set( 15, 15, 0 );
  meshes.push(boxMesh);

  cylinderGeometry = new THREE.CylinderGeometry(4, 4, 16, 32);
  cylinderMat = new THREE.MeshBasicMaterial( { "color": "#80FFFF" } );
  cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMat);
  scene.add(cylinderMesh);
  cylinderMesh.position.set( -15, 15, 0 );
  meshes.push(cylinderMesh);

  octahedronGeometry = new THREE.OctahedronGeometry(4, 0);
  octahedronMat = new THREE.MeshBasicMaterial( { "color": "#008000" } );
  octahedronMesh = new THREE.Mesh(octahedronGeometry, octahedronMat);
  scene.add(octahedronMesh);
  octahedronMesh.position.set( 15, -15, 0 );
  meshes.push(octahedronMesh);

  sphereGeometry = new THREE.SphereGeometry(4, 32, 32);
  sphereMat = new THREE.MeshBasicMaterial( { "color": "#8000FF" } );
  sphereMesh = new THREE.Mesh(sphereGeometry, sphereMat);
  scene.add(sphereMesh);
  sphereMesh.position.set( 0, 0, 0 );
  meshes.push(sphereMesh);

  torusGeometry = new THREE.TorusGeometry(12, 3, 20, 120);
  torusMat = new THREE.MeshBasicMaterial( { "color": "#182427" } );
  torusMesh = new THREE.Mesh(torusGeometry, torusMat);
  scene.add(torusMesh);
  torusMesh.position.set( -15, -15, 0 );
  meshes.push(torusMesh);
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