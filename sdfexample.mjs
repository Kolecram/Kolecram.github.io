const shaderCode = await fetch("sdfexample.wgsl").then(r => r.text());
const adapter = await navigator.gpu?.requestAdapter();
const device = await adapter?.requestDevice();
if (!device) {
    alert('need webgpu');
}

function drawImageOnCanvas() {
    const canvas = document.querySelector("canvas")
    const context = canvas.getContext('webgpu');
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'opaque',
    });

    const resolution = new Float32Array([512, 512, 0, 0]);
    const resolutionBuffer = device.createBuffer({
        size: resolution.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const module = device.createShaderModule({ code: shaderCode });
    const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            module,
            entryPoint: 'vs',
        },
        fragment: {
            module,
            entryPoint: 'fs',
            targets: [{ format: presentationFormat }],
        }
    });

    const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: resolutionBuffer } },
        ],
    });

    function render() {
        device.queue.writeBuffer(resolutionBuffer, 0, resolution);

        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
            colorAttachments: [{
                view: context.getCurrentTexture().createView(),
                clearColor: [0, 0, 0, 0],
                loadOp: 'clear',
                storeOp: 'store',
            }]
        });
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.draw(3);
        pass.end();

        device.queue.submit([encoder.finish()]);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function winLoad(callback) {
    if (document.readyState === 'complete') {
        callback();
    } else {
        window.addEventListener("load", callback);
    }
}

winLoad(drawImageOnCanvas);