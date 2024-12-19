fn sdCircle(p: vec2f, r: f32, z: u32) -> f32 {
    // Angle is calculated starting with 0 for the positive x-axis, and working anticlockwise
    var angle: f32;
    if (p.y > 0) {
      angle = degrees(acos(p.y / r));
    } else {
      angle = degrees(acos(p.y / r)) + 180;
    }
    let anglePerTooth = 360 / f32(z);
    let anglePerToothHalf = anglePerTooth / 2;

    // if (i32(trunc(angle / anglePerToothHalf)) % 2 == 0) {
    //   return length(p) - 0.9 * r;
    // } else {
    //   return length(p) - r;
    // }
    if (angle > -45 && angle < 90) {
      return length(p) - 0.9 * r;
    } else {
      return length(p) - r;
    }
}

struct Uniforms {
  iResolution: vec3f,
};

@group(0) @binding(0) var<uniform> u: Uniforms;

fn mainImage(fragCoord: vec2f) -> vec4f {
    let p = (2.0*fragCoord-u.iResolution.xy)/u.iResolution.y;
    var d = sdCircle(p, 0.5, 10);
    
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