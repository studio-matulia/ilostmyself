// Get WebGL context
const canvas = document.getElementById('shader');
const gl = canvas.getContext('webgl');

if (!gl) {
    console.error('WebGL not supported');
    document.body.innerHTML = 'WebGL is not supported by your browser.';
}

// Vertex shader source
const vsSource = `
    attribute vec4 aVertexPosition;
    void main() {
        gl_Position = aVertexPosition;
    }
`;

// Fragment shader source
const fsSource = `
    precision mediump float;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_a, u_b, u_c, u_d;

    #define PI 3.14159265359
    #define rot(a) mat2(cos(a), -sin(a), sin(a), cos(a))


    float nsin(float x) {
        return sin(x) * 0.5 + 0.5;
    }

    float s1(vec2 p, float t) {
        vec2 p1 = p * p * 0.4;
        vec2 p2 = rot(t * 0.1) * p1;
        p1 = p1 / p2 * 0.2;

        p1.x = nsin(p1.x * 8.0 + t) * 2.0;
        p1.y = nsin(p1.y * 4.0);

        float d1 = length(p1 * p) / distance(p1 * p1, p2);
        d1 = step(nsin(p1.y), d1) - step(nsin(p1.x) + p1.y, d1);

        return d1;
    }

    void main() {
        vec2 p = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.y;
        p = p * rot(0.5 * PI);

        // Adjust rotation with d
        float d = mix(p.y, p.y / p.x, u_d);
        
        // Adjust bending with c
        p = rot(mix(p.y * cos(p.x + u_time * 0.2) * PI, 2.0 * PI * d, u_c)) * p;

        // Adjust size with a
        p = p * p * mix(1.0, 20.0, u_a);
        
        // Adjust shape with b
        float s = mix(cos(p.x * p.x) * 4.0 + u_time * 2.0, sin(p.y) * 8.0 + u_time * 2.0, u_b);

        float c1 = s1(p, s);
        vec3 color = vec3(c1);

        gl_FragColor = vec4(color, 1.0);
    }
`;

// Compile shader
function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Create shader program
function createShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// Initialize buffers
function initBuffers(gl) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        -1.0,  1.0,
         1.0,  1.0,
        -1.0, -1.0,
         1.0, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return positionBuffer;
}

// Main function
export function runShader(a, b, c, d) {
    const shaderProgram = createShaderProgram(gl, vsSource, fsSource);
    const positionBuffer = initBuffers(gl);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            time: gl.getUniformLocation(shaderProgram, 'u_time'),
            resolution: gl.getUniformLocation(shaderProgram, 'u_resolution'),
            a: gl.getUniformLocation(shaderProgram, 'u_a'),
            b: gl.getUniformLocation(shaderProgram, 'u_b'),
            c: gl.getUniformLocation(shaderProgram, 'u_c'),
            d: gl.getUniformLocation(shaderProgram, 'u_d'),
        },
    };

    // Resize the canvas to match its displayed size and update the WebGL viewport
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Bind the position buffer and set up the vertex attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    // Use the shader program
    gl.useProgram(programInfo.program);

    // Set static uniform values for 'a', 'b', 'c', 'd', and 'resolution'
    gl.uniform1f(programInfo.uniformLocations.a, a);
    gl.uniform1f(programInfo.uniformLocations.b, b);
    gl.uniform1f(programInfo.uniformLocations.c, c);
    gl.uniform1f(programInfo.uniformLocations.d, d);
    gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height);

    // Render loop
    function render(time) {
        time *= 0.001;  // convert to seconds

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(programInfo.uniformLocations.time, time);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

// Resize canvas
function resizeCanvasToDisplaySize(canvas) {
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
        console.log(`Resized canvas to ${canvas.width}x${canvas.height}`);
    }
}
