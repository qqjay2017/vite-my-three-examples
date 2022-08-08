import OBJLoader from "three/examples/jsm/loaders/OBJLoader";
import { getCamera } from "/@/lib-common/camera";
import { getRenderer } from "/@/lib-common/renderer";
import { getScene } from "/@/lib-common/scene";
import * as THREE from 'three'
import { Model } from "./Model";
export class WebGl{
    scene = getScene()
    camera = getCamera()
    renderer = getRenderer({
        alpha:!0
    })
    model:Model=null!;
    stats = null;
    fov = 20;
    fromZ = -1500;
    toZ = 1e3;
    cameraZ = 2200;
    floatSystem = null;
    spotLightPos = [
        [600, 0, -800],
        [-600, 0, -800],
        [600, 0, -800],
        [-600, 0, -800],
        [600, 0, -800],
    ]


    init(){
        // this.camera.fov = this.fov;
        // this.camera.near = this.cameraZ - this.toZ;
        // this.camera.far = this.cameraZ - this.fromZ;
        // this.camera.position.set(0,0,this.cameraZ)
        // this.camera.lookAt(0,0,0)
        // this.renderer.setClearColor(0,0)
        // this.renderer.setSize(window.innerWidth, window.innerHeight)

        //model

        this.model = new Model({
                scene:this.scene
        })
        this.model.init()



    }
    render(){
        this.renderer.render(this.scene,this.camera)

        


    }
    
    onSwiper(){

    }
    // fetchData(){
    //     Promise.all([
    //         this.fetchSurfacceModel(),
    //         this.fetchParticleModel()
    //     ])

    // }
    // fetchSurfacceModel(){
    //   return new Promise((resolve,reject)=>{
    //     new   OBJLoader().load('/model/model-surface.obj',
    //     (e)=>{
    //         console.log(e);
    //         resolve(e)
    //       },
    //       (e)=>{
    //         console.log(e,'onProgress-fetchSurfacceModel');
    //       },    
    //       (e)=>{
    //         reject(e)
    //       }
    //       )
    //   })
    // }
    // fetchParticleModel(){
    //     return new Promise((resolve,reject)=>{
    //         new THREE.FileLoader().load('/model/model-particle.obj',(e)=>{
    //             resolve(e)
    //         },(e)=>{
    //             console.log(e,'onProgress-fetchParticleModel');
    //         },(e)=>{
    //             reject(e)
    //         })
    //     })

    // }
    onMouseMove(){

    }
    onResize(){

    }

}