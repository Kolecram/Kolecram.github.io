fn sdCircle(p: vec2f, r: f32) -> f32 {
    return length(p)-r;
}

struct Uniforms {
  iResolution: vec3f,
};

@group(0) @binding(0) var<uniform> u: Uniforms;

fn mainImage(fragColor: ptr<function, vec4f>, fragCoord: vec2f) {
    let p = (2.0*fragCoord-u.iResolution.xy)/u.iResolution.y;
    var d = sdCircle(p,0.5);
    
    // coloring
    var col = select(vec3(0.9,0.6,0.3), vec3(0.65,0.85,1.0), d>0.0);
    col *= 1.0 - exp(-6.0*abs(d));
    col *= 0.8 + 0.2*cos(150.0*d);
    col = mix( col, vec3f(1.0), 1.0-smoothstep(0.0,0.01,abs(d)) );

    *fragColor = vec4f(col,1.0);
}

@vertex fn vs(@builtin(vertex_index) VertexIndex : u32) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 3>(
    vec2(-1.0, -1.0),
    vec2( 3.0, -1.0),
    vec2(-1.0,  3.0)
  );

  return vec4(pos[VertexIndex], 0.0, 1.0);
}

@fragment fn fs(@builtin(position) fragCoord : vec4f) -> @location(0) vec4f {
  var color = vec4f(0);
  mainImage(&color, vec2f(fragCoord.x, u.iResolution.y - fragCoord.y));
  return color;
}