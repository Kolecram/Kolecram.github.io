fn sdCircle(p: vec2f, r: f32) -> f32 {
    return length(p) - r;
}

struct Uniforms {
  iResolution: vec3f,
};

@group(0) @binding(0) var<uniform> u: Uniforms;

fn mainImage(fragCoord: vec2f) -> vec4f {
    let p = (2.0*fragCoord-u.iResolution.xy)/u.iResolution.y;
    var d = sdCircle(p,0.5);
    
    let black = vec3(0.0, 0.0, 0.0);
    let white = vec3(1.0, 1.0, 1.0);
    let color = mix(black, white, smoothstep(-0.005, 0.005, d));

    return vec4f(color,1.0);
}

@vertex fn vs(@builtin(vertex_index) vertexIndex : u32) -> @builtin(position) vec4f {
  var pos = array<vec2<f32>, 3>(
    vec2(-1.0, -1.0),
    vec2( 3.0, -1.0),
    vec2(-1.0,  3.0)
  );

  return vec4(pos[vertexIndex], 0.0, 1.0);
}

@fragment fn fs(@builtin(position) fragCoord : vec4f) -> @location(0) vec4f {
  var color = mainImage(vec2f(fragCoord.x, u.iResolution.y - fragCoord.y));
  return color;
}