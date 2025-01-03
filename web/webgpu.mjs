if (!navigator.gpu) {
    throw new Error("WebGPU not supported on this browser.");
}
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
    throw new Error("No appropriate GPUAdapter found.");
}
const device = await adapter.requestDevice();

const shaderCode = await fetch("webgpushader.wgsl").then(r => r.text());

function drawImageOnCanvas() {
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("webgpu");
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device: device,
        format: canvasFormat,
    });
    const vertices = new Float32Array([
        //   X,    Y,
        -0.8, -0.8,
        0.8, -0.8,
        0.8, 0.8,
        -0.8, -0.8,
        0.8, 0.8,
        -0.8, 0.8,
    ]);
    const vertexBuffer = device.createBuffer({
        label: "Cell vertices",
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/ 0, vertices);
    const vertexBufferLayout = {
        arrayStride: 8,
        attributes: [{
            format: "float32x2",
            offset: 0,
            shaderLocation: 0, // Position, see vertex shader
        }],
    };
    const cellShaderModule = device.createShaderModule({
        label: "Cell shader",
        code: shaderCode
    });
    const cellPipeline = device.createRenderPipeline({
        label: "Cell pipeline",
        layout: "auto",
        vertex: {
            module: cellShaderModule,
            entryPoint: "vertexMain",
            buffers: [vertexBufferLayout]
        },
        fragment: {
            module: cellShaderModule,
            entryPoint: "fragmentMain",
            targets: [{
                format: canvasFormat
            }]
        }
    });
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
        colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            loadOp: "clear",
            clearValue: {
                r: 0,
                g: 0,
                b: 0.4,
                a: 1
            }, // New line
            storeOp: "store",
        }]
    });
    pass.setPipeline(cellPipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.draw(6); // 6 vertices
    pass.end();
    device.queue.submit([encoder.finish()]);
}

function winLoad(callback) {
    if (document.readyState === 'complete') {
        callback();
    } else {
        window.addEventListener("load", callback);
    }
}

winLoad(drawImageOnCanvas);