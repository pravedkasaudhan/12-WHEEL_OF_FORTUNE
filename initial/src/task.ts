import {Application, Container, DEG_TO_RAD, Graphics,Resource, Sprite, Text, Texture,Ticker} from "pixi.js";

import { gsap } from 'gsap';
import { preloader } from "./preloader";
import list from './assets';
import { loadtexture, selectTexture } from "./texture";
export class Game {
    app: Application;
    stage: Container;
    fps: Text|undefined;
    wheel: Sprite | undefined;
    tl: any | undefined;
    deg: number;
    needle: Graphics | undefined;
    prizes: Array<number>
    arcangle: number;
    score: number = 0;
    cc: any | undefined;
    moving: boolean | undefined;
    amount:number|undefined;
    message:Text|undefined;
    congo:Sprite|undefined;
    bg:Sprite|undefined;
    constructor(app: Application) {
        this.app = app;
        this.stage = app.stage
        this.deg = 0;
        this.prizes = [100, 200, 300, 400, 500, 600,700];
        this.arcangle = 360 / this.prizes.length;
        preloader(list, () => {
            this.bg = this.createSprite(selectTexture('bg') as Texture, this.app.view.width / 2, this.app.view.height / 2 + 20);
            this.bg.scale.set(2.1);
            this.fps = this.createText("", 0, 0, 0);
            this.wheel = this.createSprite(selectTexture('wheel') as Texture, this.app.view.width / 2, this.app.view.height / 2 + 20);
            this.wheel.scale.set(0.8);
            this.congo = this.createSprite(selectTexture('congo') as Texture, this.app.view.width / 2, this.app.view.height / 2 + 20);
            this.congo.scale.set(0.15);
            this.congo.visible=false;
            // this.wheel.scale.set(0.5);

           this.needle=this.createNeedle();
            

            this.message=this.createText("YOU WON",this.app.view.width/2,60,0.5);
            this.message.scale.set(2);
            this.message.visible=false;
            // let cc=undefined;
            


          
            this.wheel.interactive=true;
            (this.wheel as Sprite).on('click', () => {
                const audio=document.querySelector("audio")as HTMLAudioElement;
                audio.src="../assets/audio/finalspin.wav";
                audio.play();
                (this.wheel as Sprite).interactive=false;
                (this.message as Text).visible=false;
                (this.congo as Sprite).visible=false;
                console.log((this.wheel as Sprite).interactive);
               this.generatingAmount();
            });
            console.log(this.app);
            
         } );
    }
    generatingAmount(){
        let win = Math.floor(Math.random() * this.prizes.length)
        console.log(win);
        console.log(this.arcangle);
        this.amount=this.prizes[win];
        // if(win<2)
        // this.generatingAmount();
        if(win>0){
        win-=1
        this.amount=this.prizes[win];
        }
        console.log((win) * this.arcangle);
        this.deg = 3*360+((win) * this.arcangle)+(Math.random()-0.5)*(this.arcangle*0.92);
        console.log(this.deg);
        this.moving = true;
        this.rotatingWheel();
        this.score += win;
        console.log(this.tl);
    }
    rotatingWheel() {
        if (this.wheel)
            gsap.fromTo(this.wheel, { rotation: 0 }, {
                rotation: DEG_TO_RAD * (this.deg),
                duration: 10,
                ease: 'Sine.easeOut',
                onComplete: () => {
                    this.moving = false;
                    this.deg=0;
                    console.log("CONGO U WON",this.amount);
                    (this.wheel as Sprite).interactive=true;
                    (this.message as Text).visible=true;
                    (this.needle as Graphics).visible=false;
                    (this.congo as Sprite).visible=true;
                    const audio=document.querySelector("audio") as HTMLAudioElement;
                    audio.src="../assets/audio/spinwon.wav";
                    audio.play();
                    setTimeout(()=>{
                        (this.congo as Sprite).visible=false;
                        (this.needle as Graphics).visible=true;
                        (this.message as Text).visible=false;
                    },4000);

                }
            });
    }
    createNeedle():Graphics{
        const needle = new Graphics();
            needle.lineStyle(5, 0xa)
            needle.beginFill(0xeeff);
            needle.moveTo(this.app.view.width / 2 - 10, 20);
            needle.lineTo(this.app.view.width / 2 - 10, 100);
            needle.lineTo(this.app.view.width / 2 - 40, 100);
            needle.lineTo(this.app.view.width / 2, 125);
            needle.lineTo(this.app.view.width / 2 + 40, 100);
            needle.lineTo(this.app.view.width / 2 + 10, 100);
            needle.lineTo(this.app.view.width / 2 + 10, 20);
            needle.lineTo(this.app.view.width / 2 - 10, 20);
            needle.endFill();
            // this.needle = needle;
            needle.position.set(this.app.view.width / 2, 20);
            needle.pivot.set(this.app.view.width / 2, 20);
            return this.stage.addChild(needle);
    }
    createText(entry: string, x: number, y: number, a: number): Text {
        let text: Text = new Text(entry);
        text.position.set(x, y);
        text.anchor.set(a);
        return this.stage.addChild(text);
    }
    createSprite(texture: Texture<Resource>, x: number, y: number): Sprite {
        let img = Sprite.from(texture);
        img.position.set(x, y);
        img.anchor.set(0.5);
        return this.stage.addChild(img);
    }
    animate(delta: number) {
        if(this.fps)
        this.fps.text = Ticker.shared.FPS.toFixed(2);
        if(this.message)
        this.message.text="YOU WON $ "+this.amount ;
        if (this.wheel) {
            // this.wheel.rotation+=delta*DEG_TO_RAD
        }
        // this.rotatingWheel();
        let tilt = 0.05;
        if (this.moving && this.cc == undefined) {
            this.cc = (setInterval(() => {
                tilt = -1 * tilt;
                (this.needle as Graphics).rotation = tilt;

            }, 10));
        }
        else if (this.moving == false) {
            clearInterval(this.cc);
            this.cc=undefined;
        }

        console.log(this.cc, this.moving,this.wheel?.interactive);
    }
}