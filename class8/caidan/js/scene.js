// ===== 场景、相机、渲染器 =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
scene.fog = new THREE.Fog(0x87CEEB, 50, 220);

const camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(35, 28, 45);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById("scene-container").appendChild(renderer.domElement);

// ===== 控制器 =====
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 6, 0);

// ===== 光源 =====
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 0.85);
sun.position.set(40, 60, 25);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -60;
sun.shadow.camera.right = 60;
sun.shadow.camera.top = 60;
sun.shadow.camera.bottom = -60;
scene.add(sun);

// ===== 地面 =====
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 120),
    new THREE.MeshStandardMaterial({ color: 0x7CB342 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// ===== 道路（十字） =====
const roadMat = new THREE.MeshStandardMaterial({ color: 0x424242 });
const hRoad = new THREE.Mesh(new THREE.PlaneGeometry(120, 7), roadMat);
hRoad.rotation.x = -Math.PI / 2;
hRoad.position.y = 0.01;
hRoad.receiveShadow = true;
scene.add(hRoad);

const vRoad = new THREE.Mesh(new THREE.PlaneGeometry(7, 120), roadMat);
vRoad.rotation.x = -Math.PI / 2;
vRoad.position.y = 0.01;
vRoad.receiveShadow = true;
scene.add(vRoad);

// ===== 教学楼 =====
function addBuilding(w, h, d, color, x, z) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({ color })
    );
    mesh.position.set(x, h / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
}

addBuilding(14, 10, 10, 0xE53935, -18, -18);   // 主教学楼
addBuilding(12, 14, 12, 0x1E88E5,  18, -18);   // 图书馆
addBuilding(10, 8, 14, 0x43A047, -18,  18);   // 实验楼
addBuilding(16, 6,  8, 0xFB8C00,  18,  18);    // 行政楼
addBuilding(10, 5, 10, 0x8D6E63,   0,  22);    // 食堂
addBuilding(8,  12, 8, 0x5C6BC0, -25,   0);    // 学生宿舍

// ===== 树木 =====
function addTree(x, z) {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 2),
        new THREE.MeshStandardMaterial({ color: 0x8D6E63 })
    );
    trunk.position.y = 1;
    trunk.castShadow = true;
    group.add(trunk);

    const crown = new THREE.Mesh(
        new THREE.SphereGeometry(1.6, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x2E7D32 })
    );
    crown.position.y = 3.2;
    crown.castShadow = true;
    group.add(crown);

    group.position.set(x, 0, z);
    scene.add(group);
}

const treePos = [
    [-25, -10], [-25, -5], [-25, 0], [-25, 5], [-25, 10],
    [ 25, -10], [ 25, -5], [ 25, 0], [ 25, 5], [ 25, 10],
    [-10, -25], [-5, -25], [0, -25], [5, -25], [10, -25],
    [-10,  25], [-5,  25], [0,  25], [5,  25], [10,  25]
];
treePos.forEach(([x, z]) => addTree(x, z));

// ===== 中心喷泉 =====
const fountainBase = new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3.6, 0.5, 32),
    new THREE.MeshStandardMaterial({ color: 0x9E9E9E })
);
fountainBase.position.y = 0.25;
fountainBase.castShadow = true;
fountainBase.receiveShadow = true;
scene.add(fountainBase);

const water = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 16, 16),
    new THREE.MeshStandardMaterial({
        color: 0x29B6F6, transparent: true, opacity: 0.85
    })
);
water.position.y = 1.4;
water.castShadow = true;
scene.add(water);

// ===== 动画循环 =====
let t = 0;
function animate() {
    requestAnimationFrame(animate);
    t += 0.02;
    water.position.y = 1.4 + Math.sin(t) * 0.25;
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
