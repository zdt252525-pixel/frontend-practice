// ===== 场景、相机、渲染器 =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
scene.fog = new THREE.Fog(0x87CEEB, 50, 200);

const camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(30, 25, 40);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById("scene-container").appendChild(renderer.domElement);

// ===== 控制器 =====
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 5, 0);

// ===== 光源 =====
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(30, 50, 20);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(1024, 1024);
dirLight.shadow.camera.left = -50;
dirLight.shadow.camera.right = 50;
dirLight.shadow.camera.top = 50;
dirLight.shadow.camera.bottom = -50;
scene.add(dirLight);

// ===== 地面 =====
const groundGeo = new THREE.PlaneGeometry(100, 100);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x7CB342 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// ===== 道路 =====
const roadMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
const road1 = new THREE.Mesh(new THREE.PlaneGeometry(100, 6), roadMat);
road1.rotation.x = -Math.PI / 2;
road1.position.y = 0.01;
road1.receiveShadow = true;
scene.add(road1);
const road2 = new THREE.Mesh(new THREE.PlaneGeometry(6, 100), roadMat);
road2.rotation.x = -Math.PI / 2;
road2.position.y = 0.01;
road2.receiveShadow = true;
scene.add(road2);

// ===== 教学楼 =====
function createBuilding(w, h, d, color, x, z) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, h / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
}

createBuilding(12, 8, 8, 0xE53935, -15, -15);   // 主教学楼
createBuilding(10, 12, 10, 0x1E88E5, 15, -15);  // 图书馆
createBuilding(8, 6, 12, 0x43A047, -15, 15);    // 实验楼
createBuilding(14, 5, 6, 0xFB8C00, 15, 15);     // 行政楼

// ===== 树木 =====
function createTree(x, z) {
    const treeGroup = new THREE.Group();
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 2),
        new THREE.MeshStandardMaterial({ color: 0x8D6E63 })
    );
    trunk.position.y = 1;
    trunk.castShadow = true;
    treeGroup.add(trunk);
    const crown = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x2E7D32 })
    );
    crown.position.y = 3;
    crown.castShadow = true;
    treeGroup.add(crown);
    treeGroup.position.set(x, 0, z);
    scene.add(treeGroup);
}

const treePositions = [
    [-20, -10], [-20, -5], [-20, 0], [-20, 5], [-20, 10],
    [20, -10], [20, -5], [20, 0], [20, 5], [20, 10],
    [-10, -20], [-5, -20], [0, -20], [5, -20], [10, -20],
    [-10, 20], [-5, 20], [0, 20], [5, 20], [10, 20]
];
treePositions.forEach(([x, z]) => createTree(x, z));

// ===== 喷泉 =====
const fountainBase = new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3.5, 0.5, 32),
    new THREE.MeshStandardMaterial({ color: 0x9E9E9E })
);
fountainBase.position.y = 0.25;
fountainBase.castShadow = true;
fountainBase.receiveShadow = true;
scene.add(fountainBase);

const water = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 16, 16),
    new THREE.MeshStandardMaterial({
        color: 0x29B6F6, transparent: true, opacity: 0.8
    })
);
water.position.y = 1.3;
water.castShadow = true;
scene.add(water);

// ===== 动画循环 =====
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.02;
    water.position.y = 1.3 + Math.sin(time) * 0.2;
    controls.update();
    renderer.render(scene, camera);
}
animate();

// ===== 窗口自适应 =====
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});