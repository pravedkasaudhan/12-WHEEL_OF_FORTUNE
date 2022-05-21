import { Application } from "pixi.js";
import { Game } from "./task";
import '../css/style.css';

const audio=document.createElement("audio");
audio.style.visibility='none';
document.body.append(audio);
const canvas:HTMLCanvasElement=document.getElementById("canvas")as HTMLCanvasElement;
const app= new Application({
    view:canvas,
    width:innerWidth,
    height:innerHeight,
    backgroundColor:0xE191C4,
    sharedTicker:true,
    sharedLoader:true
});

const task=new Game(app);
app.ticker.add(task.animate.bind(task));