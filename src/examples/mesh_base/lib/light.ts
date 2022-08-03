import * as THREE from 'three'
export const getLight = ()=>{
    const ambientLight = new THREE.AmbientLight(0xffffff,0.1)
    ambientLight.position.set(10,10,10)
    return {
        ambientLight
    }
}