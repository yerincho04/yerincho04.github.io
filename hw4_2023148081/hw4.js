/*-------------------------------------------------------------------------
08_Transformation.js
---------------------------------------------------------------------------*/
import { resizeAspectRatio, setupText, updateText, Axes } from './util.js';
import { Shader, readShaderFile } from './shader.js';

let isInitialized = false;
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');
let shader;
let vao;
let axes;
let finalTransform;
let lastTime = 0;

let sunRotation = 0;
let earthRotation = 0;
let earthOrbit = 0;
let moonRotation = 0;
let moonOrbit = 0;

function initWebGL() {
    if (!gl) {
        console.error('WebGL 2 is not supported by your browser.');
        return false;
    }

    canvas.width = 700;
    canvas.height = 700;
    resizeAspectRatio(gl, canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.2, 0.3, 0.4, 1.0);
    
    return true;
}

function setupBuffers() {
    const cubeVertices = new Float32Array([
        -0.5,  0.5,  // 좌상단
        -0.5, -0.5,  // 좌하단
         0.5, -0.5,  // 우하단
         0.5,  0.5   // 우상단
    ]);

    const indices = new Uint16Array([
        0, 1, 2,    // 첫 번째 삼각형
        0, 2, 3     // 두 번째 삼각형
    ]);

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
    shader.setAttribPointer("a_position", 2, gl.FLOAT, false, 0, 0);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.bindVertexArray(null);
}

function drawObject(transform, color) {
    shader.use();
    shader.setMat4("u_transform", transform);
    shader.setVec4("u_color", color);
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

function render() {

    gl.clear(gl.COLOR_BUFFER_BIT);

    //draw axes
    axes.draw(mat4.create(), mat4.create());

    // Sun
    let sun = mat4.create();
    mat4.rotateZ(sun, sun, sunRotation);
    mat4.scale(sun, sun, [0.2, 0.2, 1]);
    drawObject(sun, [1.0, 0.0, 0.0, 1.0]);

    // Earth
    let earth = mat4.create();
    mat4.rotateZ(earth, earth, earthOrbit);
    mat4.translate(earth, earth, [0.7, 0, 0]);
    mat4.rotateZ(earth, earth, earthRotation);
    mat4.scale(earth, earth, [0.1, 0.1, 1]);
    drawObject(earth, [0.0, 1.0, 1.0, 1.0]);

    // Moon
    let moon = mat4.create();
    mat4.rotateZ(moon, moon, earthOrbit); 
    mat4.translate(moon, moon, [0.7, 0, 0]); 
    mat4.rotateZ(moon, moon, moonOrbit); 
    mat4.translate(moon, moon, [0.2, 0, 0]);
    mat4.rotateZ(moon, moon, moonRotation); 
    mat4.scale(moon, moon, [0.05, 0.05, 1]);
    drawObject(moon, [1.0, 1.0, 0.0, 1.0]);
}

function animate(currentTime) {

    if (!lastTime) lastTime = currentTime;
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    sunRotation += Math.PI / 4 * deltaTime;      
    earthRotation += Math.PI * deltaTime;       
    earthOrbit += Math.PI / 6 * deltaTime;       
    moonRotation += Math.PI * deltaTime;         
    moonOrbit += 2 * Math.PI * deltaTime;        

    render();
    requestAnimationFrame(animate);
}

async function initShader() {
    const vertexShaderSource = await readShaderFile('shVert.glsl');
    const fragmentShaderSource = await readShaderFile('shFrag.glsl');
    shader = new Shader(gl, vertexShaderSource, fragmentShaderSource);
}

async function main() {
    try {
        if (!initWebGL()) throw new Error('WebGL 초기화 실패');

        finalTransform = mat4.create();

        await initShader();

        setupBuffers();
        axes = new Axes(gl, 0.8);

        return true;
    } catch (error) {
        console.error('Failed to initialize program:', error);
        alert('프로그램 초기화에 실패했습니다.');
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (isInitialized) return;
    main().then(success => {
        if (success) {
            isInitialized = true;
            requestAnimationFrame(animate);
        }
    }).catch(error => {
        console.error('프로그램 실행 중 오류 발생:', error);
    });
});
