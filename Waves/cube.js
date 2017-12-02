var camera;
var scene;
var renderer;
var controls;
var params = {
			color: '#ffffff',
			scale: 4,
			flowX: 1,
			flowY: 1
		};


function init() {
    
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(-0, 10, 30);

	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 1, 0);
    scene.add(light);
    
	loadSkyBox();

	renderer = new THREE.WebGLRenderer( { antialias:true} );
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 0, 0);     
}
init();

function loadSkyBox() {
	
		var materials = [
			createMaterial( 'https://lunarowlet.github.io/Waves/img/box_right.bmp' ), 
			createMaterial( 'https://lunarowlet.github.io/Waves/img/box_left.bmp' ), 
			createMaterial( 'https://lunarowlet.github.io/Waves/img/box_top.bmp' ), 
			createMaterial( 'https://lunarowlet.github.io/Waves/img/seabed.png' ), 
			createMaterial( 'https://lunarowlet.github.io/Waves/img/box_front.bmp' ),
			createMaterial( 'https://lunarowlet.github.io/Waves/img/box_back.bmp' ) 
		];
		
		var mesh = new THREE.Mesh( new THREE.BoxGeometry( 300, 300, 300, 1, 1, 1 ), new THREE.MeshFaceMaterial( materials ) );
		
		mesh.scale.set(-1,1,1);
		scene.add( mesh );	
}

function createMaterial( path ) {
	var texture = THREE.ImageUtils.loadTexture(path);
	var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

	return material; 
}

var bmap =  THREE.ImageUtils.loadTexture("https://lunarowlet.github.io/Waves/img/seabed.png", {}, function(){});

var planeGeometry = new THREE.PlaneGeometry(300, 300, 300, 300);
var planeMaterial = new THREE.MeshPhongMaterial({  color: 0xA1C5EE, shading: THREE.FlatShading, transparent: true, map: bmap });
var mesh = new THREE.Mesh(planeGeometry, planeMaterial);

mesh.rotation.x = -1.6;

mesh.position.set(0, 0, 0);

scene.add(mesh);


function animate(ts) {
	
	if(controls != null) {
		controls.update();
	}
	
	renderer.render( scene, camera );

    requestAnimationFrame( animate );
 
    var center = new THREE.Vector2(0,0);
    var vLength = mesh.geometry.vertices.length;

    for (var i = 0; i < vLength; i++) {
    	var v = mesh.geometry.vertices[i];
    	var dist = new THREE.Vector2(v.x, v.y).sub(center);
    	var size = 7.0;
    	var magnitude = 3;
    	v.z = Math.sin(dist.length()/-size + (ts/500)) * magnitude;
  	}
  	mesh.geometry.verticesNeedUpdate = true;
  	renderer.render(scene, camera);
    
}
animate();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
