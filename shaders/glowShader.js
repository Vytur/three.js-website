import * as THREE from 'three';

export const glowShader = {
    uniforms: {
        glowColor: { value: new THREE.Color(0x00ff00) }, // Green glow color
    },
    vertexShader: `
        varying vec3 vNormal;
        void main() {
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
            float intensity = pow(dot(vNormal, vec3(0.0, 0.0, 1.0)), 1.5);
            gl_FragColor = vec4(glowColor * intensity, 1.0);
        }
    `,
};