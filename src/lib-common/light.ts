import * as THREE from 'three'
export function getAmbientLight(){
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    ambientLight.position.set(50,50,50)
    return ambientLight
}