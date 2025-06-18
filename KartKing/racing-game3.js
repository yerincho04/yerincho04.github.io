import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'stats-js';
//import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';


// 씬, 카메라, 렌더러 셋업
const scene = new THREE.Scene();

// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/'); 

// 스카이 돔
const textureLoader = new THREE.TextureLoader();
const skyDomeTexture = textureLoader.load('assets/sky2.jpg');
const domeGeom = new THREE.SphereGeometry(800, 60, 40);
const domeMat = new THREE.MeshBasicMaterial({ map: skyDomeTexture, side: THREE.BackSide });
const skyDome = new THREE.Mesh(domeGeom, domeMat);
skyDome.position.x = -200.0;
skyDome.position.z = 200.0;
skyDome.position.y = -13.0;
scene.add(skyDome);

// 바닥 원판
const circleRadius = 800;
const circleSegments = 64;
const groundTexture = textureLoader.load('assets/grass.png', tex => {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  const tileSize = 10;
  const repeats = (circleRadius * 2) / tileSize;
  tex.repeat.set(repeats, repeats);
});
const circleGeom = new THREE.CircleGeometry(circleRadius, circleSegments);
const circleMat = new THREE.MeshPhongMaterial({ map: groundTexture, side: THREE.DoubleSide });
const groundCircle = new THREE.Mesh(circleGeom, circleMat);
groundCircle.rotation.x = -Math.PI / 2;
groundCircle.position.y = -13.0;
groundCircle.position.x = -200.0;
groundCircle.position.z = 200.0;
// groundCircle.receiveShadow = true;
scene.add(groundCircle);

// 카메라
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(50, 30, 50);
// camera.position.set(50, 1000, 20);
camera.lookAt(0, 0, 0);

let isFirstPerson = true;
let isThirdPerson = false;
//let isFree = true;
const thirdPersonOffset = new THREE.Vector3(0, 8, -14);   // 3인칭 카메라 상대 위치
const firstPersonOffset = new THREE.Vector3(5, 5, 5);   // 1인칭 카메라 상대 위치
const freeOffset = new THREE.Vector3(15, 20, -20);

function updateCamera() {
  if (!car) return;

  if(isFirstPerson){
    // 카트 회전 축(0,1,0)을 기준으로 오프셋 회전
    const rotY = car.dirRotation;
    const fp = firstPersonOffset.clone().applyAxisAngle(new THREE.Vector3(0,1,0), rotY);
    camera.position.copy(car.position).add(fp);
    // 시점은 카트 앞쪽 약간 위를 바라보게
    camera.lookAt(
      car.position.x + Math.sin(rotY) * 50,
      car.position.y - 1,
      car.position.z + Math.cos(rotY) * 50
    );
  }

  if(isThirdPerson){
    const rotY = car.dirRotation;
    const tp = thirdPersonOffset.clone().applyAxisAngle(new THREE.Vector3(0,1,0), rotY);
    camera.position.copy(car.position).add(tp);
    camera.lookAt(car.position.x, car.position.y+2, car.position.z);    
  }

}

window.addEventListener('keydown', e => {
  if (e.code === 'KeyG') {
  if (isFirstPerson) {
    isFirstPerson = false;
    isThirdPerson = true;
  } else {
    isFirstPerson = true;
    isThirdPerson = false;
  }
}
});

// 렌더러 (쉐도우 활성화)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

// 컨트롤러
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;
controls.enablePan = true;
controls.screenSpacePanning = true;
controls.minDistance = 10;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2;
controls.target.set(0, 0, 0);
controls.panSpeed = 1.0;
controls.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };

controls.listenToKeyEvents(window);

// 조명 설정
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 5.0);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 6.0);
dirLight.position.set(100, 100, 50);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 500;
dirLight.shadow.camera.left = -100;
dirLight.shadow.camera.right = 100;
dirLight.shadow.camera.top = 100;
dirLight.shadow.camera.bottom = -100;
scene.add(dirLight);
const ambLight = new THREE.AmbientLight(0xffffff, 3.0);
scene.add(ambLight);

// 성능 모니터
const stats = new Stats();
document.body.appendChild(stats.dom);

// GLTF 로더
const gltfLoader = new GLTFLoader();

// 부스트 패드 생성 함수 및 배열 선언 [부스트]
function createBoostPad(x, z) {
  let width = 5;
  let depth = 40;
  const geom = new THREE.BoxGeometry(width, 0.1, depth);
  const mat = new THREE.MeshPhongMaterial({ color: 0x00ffff, opacity: 0.6, transparent: true });
  const pad = new THREE.Mesh(geom, mat);
  pad.position.set(x, 0.1, z);
  pad.boostBox = {
    minX: x - width/2, maxX: x + width/2,
    minZ: z - depth/2, maxZ: z + depth/2
  };
  // pad.receiveShadow = true; pad.castShadow = false;
  pad.position.x = x;
  pad.position.z = z;
  pad.position.y = 0.5;
  scene.add(pad);
  return pad;
}
const boostPads = [];
// 예시: 부스트 패드 추가
boostPads.push(createBoostPad(-10, 0)); // (x=50, z=0, 20 단위 크기)

// 맵 로드 및 중앙 정렬 (쉐도우 캐스팅 enable)
const mapScale = 2;
let mapMesh;
gltfLoader.load('assets/map.glb', gltf => {
  // console.log('map animations count:', gltf.animations.length);
  mapMesh = gltf.scene;
  mapMesh.scale.set(mapScale, mapScale, mapScale);
  const box = new THREE.Box3().setFromObject(mapMesh);
  const center = box.getCenter(new THREE.Vector3());
  mapMesh.position.sub(center);
  mapMesh.position.y = 0.0;

  scene.add(mapMesh);

  mapMixer = new THREE.AnimationMixer(mapMesh);

  const mapClip = gltf.animations;
  mapClip.forEach((clip) => {
    const action = mapMixer.clipAction(clip);
    action.loop = THREE.LoopRepeat;
    action.setEffectiveTimeScale(0.2);
    action.play();
  });

}, undefined, err => console.error('맵 모델 로드 실패:', err));

// 자동차 GLB 로드 (쉐도우 설정) 및 부스트 상태 변수 추가 [부스트]
const carScale = 2;
let car;
let boostActive = false; // [부스트]
let boostEndTime = 0;   // [부스트]

const clock = new THREE.Clock();
let mixer, wheelAction1, wheelAction2, wheelAction3, wheelAction4, mapMixer, mapClip;

gltfLoader.load('assets/kart5.glb', gltf => {
  car = gltf.scene;
  car.scale.set(carScale, carScale, carScale);
  car.rotation.y = Math.PI / 2;
  car.traverse(child => { if (child.isMesh) { child.castShadow=true; child.receiveShadow=true; }});
  const box = new THREE.Box3().setFromObject(car);
  const center = box.getCenter(new THREE.Vector3());
  car.position.sub(center);
  car.position.set(-137.71, 0.20, 436.97);
  car.speed = 0; car.maxSpeed = 0.75; car.acceleration = 0.04; car.deceleration = 0.03;
  car.rSpeed = 0; car.dirRotation = Math.PI / 2; car.run = false; car.reverse = false;
  car.brake = function() { this.deceleration = 1.0; this.speed *= 0.8; };
  car.cancelBrake = function() { this.deceleration = 0.03; };
  scene.add(car);
  
  requestAnimationFrame(() => {
    updateCamera();
  });

  const clips = gltf.animations;
  mixer = new THREE.AnimationMixer(car);

  wheelAction1 = mixer.clipAction(clips[0]);
  wheelAction1.loop = THREE.LoopRepeat;
  wheelAction1.enabled = true;
  wheelAction1.setEffectiveTimeScale(0);
  wheelAction1.play();

  wheelAction2 = mixer.clipAction(clips[1]);
  wheelAction2.loop = THREE.LoopRepeat;
  wheelAction2.enabled = true;
  wheelAction2.setEffectiveTimeScale(0);
  wheelAction2.play();

  wheelAction3 = mixer.clipAction(clips[2]);
  wheelAction3.loop = THREE.LoopRepeat;
  wheelAction3.enabled = true;
  wheelAction3.setEffectiveTimeScale(0);
  wheelAction3.play();

  wheelAction4 = mixer.clipAction(clips[3]);
  wheelAction4.loop = THREE.LoopRepeat;
  wheelAction4.enabled = true;
  wheelAction4.setEffectiveTimeScale(0);
  wheelAction4.play();

}, undefined, err => console.error('자동차 모델 로드 실패:', err));

// 충돌 및 높이 계산
const raycaster = new THREE.Raycaster();
// function checkCollision(x, z) {
//   const box = { minX: x - 2, maxX: x + 2, minZ: z - 4, maxZ: z + 4 };
//   return buildings.some(b => box.minX < b.collisionBox.maxX && box.maxX > b.collisionBox.minX
//     && box.minZ < b.collisionBox.maxZ && box.maxZ > b.collisionBox.minZ);
// }
function getHeightOnMap(x, z) {
  if (!mapMesh) return 0;

  raycaster.set(new THREE.Vector3(x, 100, z), new THREE.Vector3(0, -1, 0));
  const hits = raycaster.intersectObject(mapMesh, true);

  if (hits.length > 0) {
    return hits[0].point.y;
  } else {
    return 0;
  }
}

// 입력
window.addEventListener('keydown', e => { if (!car) return; switch(e.code) {
  case 'KeyW': 
    car.run=true; 
    car.reverse=false; 
    wheelAction1.setEffectiveTimeScale(1.0); 
    wheelAction2.setEffectiveTimeScale(1.0); 
    wheelAction3.setEffectiveTimeScale(1.0); 
    wheelAction4.setEffectiveTimeScale(1.0); 
    break;
  case 'KeyS': 
    car.run=true; 
    car.reverse=true; 
    wheelAction1.setEffectiveTimeScale(-1.0); 
    wheelAction2.setEffectiveTimeScale(-1.0); 
    wheelAction3.setEffectiveTimeScale(-1.0); 
    wheelAction4.setEffectiveTimeScale(-1.0); 
    break;
  case 'KeyA': car.rSpeed=0.03; break;
  case 'KeyD': car.rSpeed=-0.03; break;
  case 'Space': car.brake(); break;
}});
window.addEventListener('keyup', e => { if (!car) return; switch(e.code) {
  case 'KeyW': case 'KeyS': car.run=false; break;
  case 'KeyA': case 'KeyD': car.rSpeed=0; break;
  case 'Space': car.cancelBrake(); break;
}});

// 애니메이션 루프 (부스트 로직 추가) [부스트]
let lastTime=0;
function animate(time) {
  requestAnimationFrame(animate);
  const delta=(time-lastTime)/1000; lastTime=time;

  if (car) {
    // 부스트 기간 만료 체크 [부스트]
    if(boostActive && time>=boostEndTime) {
      car.maxSpeed /=3;
      boostActive=false;
    }
    // 주행 로직
    car.speed = car.run ? Math.min(car.speed+car.acceleration, car.maxSpeed)
                        : Math.max(car.speed-car.deceleration, 0);
    if(car.speed) {
      car.dirRotation += car.rSpeed;
      const vx=Math.sin(car.dirRotation)*car.speed;
      const vz=Math.cos(car.dirRotation)*car.speed;
      const nx=car.position.x+(car.reverse?-vx:vx);
      const nz=car.position.z+(car.reverse?-vz:vz);
      // 부스트 패드 충돌 체크 [부스트]
      boostPads.forEach(pad=>{
        const b=pad.boostBox;
        if(nx>b.minX&&nx<b.maxX&&nz>b.minZ&&nz<b.maxZ&& !boostActive) {
          boostActive=true;
          car.maxSpeed*=3;               // 속도 3배
          car.speed*=3;               // 속도 3배
          boostEndTime = time+3000;
        }
      });
      car.position.set(nx, getHeightOnMap(nx, nz) + 0.2, nz);

      car.rotation.y=car.dirRotation;
      // if(!checkCollision(nx,nz)) {
      //   car.position.set(nx,getHeightOnMap(nx,nz)+0.2,nz);
      //   car.rotation.y=car.dirRotation;
      // } else car.speed*=0.5;
    } 
    else {
      car.position.y = getHeightOnMap(car.position.x, car.position.z) + 0.2;
      wheelAction1.setEffectiveTimeScale(0.0); 
      wheelAction2.setEffectiveTimeScale(0.0); 
      wheelAction3.setEffectiveTimeScale(0.0); 
      wheelAction4.setEffectiveTimeScale(0.0); 
    }
    
    if (mixer) mixer.update(delta);
    if (isFirstPerson || isThirdPerson) updateCamera();
  }
  
  if (mapMixer) mapMixer.update(delta);
  stats.begin(); renderer.render(scene,camera); stats.end();
}
animate(0);
