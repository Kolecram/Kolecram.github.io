const kernelCode = await fetch("raymarching_kernel.wgsl").then(r => r.text());
const shaderCode = await fetch("screen_shader.wgsl").then(r => r.text());

class Renderer {

    #canvas;

    // Device/Context objects
    #adapter;
    #device;
    #context;
    #format;

    //Assets
    #colorBuffer;
    #colorBufferView;
    #sampler;

    // Pipeline objects
    #pipeline
    #bindGroup
    #screenPipeline
    #screenBindGroup

    constructor(canvas) {
        this.canvas = canvas;
    }

    async Initialize() {
        await this.setupDevice();
        await this.createAssets();
        await this.makePipeline();
        this.render();
    }

    async setupDevice() {
        this.adapter = await navigator.gpu.requestAdapter();
        this.device = await this.adapter.requestDevice();
        this.context = this.canvas.getContext("webgpu");
        this.format = "bgra8unorm";
        this.context.configure({
            device: this.device,
            format: this.format,
            alphaMode: "opaque"
        });
    }

    async makePipeline() {

        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {
                        access: "write-only",
                        format: "rgba8unorm",
                        viewDimension: "2d"
                    }
                },
            ]

        });

        this.#bindGroup = this.device.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: this.color_buffer_view
                }
            ]
        });

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        this.#pipeline = this.device.createComputePipeline({
            layout: pipelineLayout,

            compute: {
                module: this.device.createShaderModule({
                    code: kernelCode,
                }),
                entryPoint: 'main',
            },
        });

        const screen_bind_group_layout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {}
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                },
            ]

        });

        this.#screenBindGroup = this.device.createBindGroup({
            layout: screen_bind_group_layout,
            entries: [
                {
                    binding: 0,
                    resource: this.sampler
                },
                {
                    binding: 1,
                    resource: this.color_buffer_view
                }
            ]
        });

        const screen_pipeline_layout = this.device.createPipelineLayout({
            bindGroupLayouts: [screen_bind_group_layout]
        });

        this.#screenPipeline = this.device.createRenderPipeline({
            layout: screen_pipeline_layout,

            vertex: {
                module: this.device.createShaderModule({
                    code: shaderCode,
                }),
                entryPoint: 'vert_main',
            },

            fragment: {
                module: this.device.createShaderModule({
                    code: shaderCode,
                }),
                entryPoint: 'frag_main',
                targets: [
                    {
                        format: "bgra8unorm"
                    }
                ]
            },

            primitive: {
                topology: "triangle-list"
            }
        });

    }

    async createAssets() {

        this.color_buffer = this.device.createTexture(
            {
                size: {
                    width: this.canvas.width,
                    height: this.canvas.height,
                },
                format: "rgba8unorm",
                usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING
            }
        );

        this.color_buffer_view = this.color_buffer.createView();

        const samplerDescriptor = {
            addressModeU: "repeat",
            addressModeV: "repeat",
            magFilter: "linear",
            minFilter: "nearest",
            mipmapFilter: "nearest",
            maxAnisotropy: 1
        };
        this.sampler = this.device.createSampler(samplerDescriptor);
    }

    render = () => {

        let start = performance.now();

        const commandEncoder = this.device.createCommandEncoder();

        const pass = commandEncoder.beginComputePass();
        pass.setPipeline(this.#pipeline);
        pass.setBindGroup(0, this.#bindGroup);
        pass.dispatchWorkgroups(this.canvas.width, this.canvas.height, 1);
        pass.end();

        const textureView = this.context.getCurrentTexture().createView();
        const renderpass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
                loadOp: "clear",
                storeOp: "store"
            }]
        });

        renderpass.setPipeline(this.#screenPipeline);
        renderpass.setBindGroup(0, this.#screenBindGroup);
        renderpass.draw(6, 1, 0, 0);

        renderpass.end();

        this.device.queue.submit([commandEncoder.finish()]);

        this.device.queue.onSubmittedWorkDone().then(
            () => {
                const end = performance.now();
                const performanceLabel = document.getElementById("render-time");
                performanceLabel.innerText = Math.round(end - start);
            }
        );

        requestAnimationFrame(this.render);
    }

}

const canvas =  document.querySelector("canvas");

const renderer = new Renderer(canvas);

renderer.Initialize();