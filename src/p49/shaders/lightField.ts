/**
 * A single physically-motivated shader: a blade of daylight entering a dark
 * room through an opening, scattering in air, landing on textured plaster.
 * Used where light is the information (LIGHT portal preview and experience).
 * `u_sun` 0..1 moves the sun from morning to evening; `u_quality` trims noise octaves.
 */
export const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`;

export const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_sun;
uniform float u_quality;
uniform vec2 u_mouse;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p){
  float v = 0.0, amp = 0.5;
  for (int i = 0; i < 5; i++) {
    if (float(i) >= u_quality) break;
    v += amp * noise(p); p *= 2.03; amp *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv; p.x *= u_res.x / u_res.y;
  float angle = mix(-0.9, 0.9, u_sun);
  vec2 dir = normalize(vec2(sin(angle), -cos(angle)));
  vec2 origin = vec2(0.5 * u_res.x / u_res.y + angle * 0.25, 1.05);
  vec2 rel = p - origin;
  float along = dot(rel, dir);
  float across = abs(dot(rel, vec2(-dir.y, dir.x)));
  float width = 0.05 + along * 0.12;
  float beam = smoothstep(width, width * 0.35, across) * smoothstep(0.0, 0.15, along);
  float dust = fbm(p * 6.0 + vec2(u_time * 0.02, -u_time * 0.015));
  float plaster = fbm(p * 38.0) * 0.5 + fbm(p * 5.0) * 0.5;
  vec3 dark = vec3(0.043, 0.043, 0.035);
  vec3 warm = mix(vec3(0.95, 0.88, 0.74), vec3(1.0, 0.78, 0.55), abs(angle));
  float torch = smoothstep(0.35, 0.0, distance(uv, u_mouse)) * 0.12;
  vec3 col = dark + plaster * 0.035;
  col += warm * beam * (0.22 + dust * 0.35);
  col += warm * torch * plaster;
  col += (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.015;
  gl_FragColor = vec4(col, 1.0);
}
`;
