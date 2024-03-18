import Phaser from 'phaser'
import WebFontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin.js'


import Game from "./scenes/Game"
import UI from "./scenes/UI"
import Loading from "./scenes/Loading"
import MainMenu from "./scenes/MainMenu"
import ResultsMenu from "./scenes/ResultsMenu"


try { 



const config = {
    type: Phaser.WEBGL,
    transparent:false,
    parent:"phaserContainer",
    fps: {
      limit: 60
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      height: 1080,
      width: 1920,
    }, 
    physics: {
      default: "arcade",
      arcade:{
        gravity:{
          y:0
        },
        debug:false
      }
    },
    scene: [
      Loading,
      MainMenu,
      Game,
      UI,
      ResultsMenu
    ],
    dom: {
        createContainer: true
    },    
    plugins: {
      global: [{
        key: 'rexWebFontLoader',
        plugin: WebFontLoaderPlugin,
        start: true
      },
     
      ]
    }
};


  const game = new Phaser.Game(config);
  
} catch (er) {console.log(er.message,er.stack); throw er} 
