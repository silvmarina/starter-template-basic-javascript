// Importar a próxima cena
import { cena2 } from "./cena2.js";

// Criar a cena 1
var cena1 = new Phaser.Scene("Cena 1");

// Variáveis locais
var map;
var tileset0;
var kit;
var door;
var terreno;
var tileset1;
var plataforma;
var porta;
var ARCas;
var player1;
var player2;
var parede;
var voz;
var cursors;
var timedEvent;
var trilha;
var jogador;
var ice_servers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
var localConnection;
var remoteConnection;
var midias;
const audio = document.querySelector("audio");

cena1.preload = function () {
  // Tilesets
  this.load.image("terreno", "./assets/terreno.png");

  this.load.image("plataforma", "./assets/box_2x1.png");

  this.load.image("kit", "./assets/images/kitmedico.png");

  this.load.image("door", "./assets/door.png");

  // Jogador 1
  this.load.spritesheet("player1", "./assets/player1.png", {
    frameWidth: 32,
    frameHeight: 32,
  });

  // Jogador 2
  this.load.spritesheet("player2", "./assets/player2.png", {
    frameWidth: 32,
    frameHeight: 32,
  });

  // Trilha sonora
  this.load.audio("trilha", "./assets/cena1.mp3");

  // Efeitos sonoros
  this.load.audio("parede", "./assets/parede.mp3");
 // this.load.audio("voz", "./assets/voz.mp3");

  // Tela cheia
  this.load.spritesheet("fullscreen", "./assets/fullscreen.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
};

cena1.create = function () {
  this.add.image(960, 540, "terreno")

  // Trilha sonora
  trilha = this.sound.add("trilha");
  trilha.play();

  // Efeitos sonoros
  parede = this.sound.add("parede");
 // voz = this.sound.add("voz");

  // Personagens
  player1 = this.physics.add.sprite(100, 750, "player1");
  player2 = this.physics.add.sprite(150, 750, "player2");

  plataforma = this.physics.add.staticGroup();
  porta = this.physics.add.staticGroup();
  kit = this.physics.add.staticGroup();
  door = this.physics.add.staticGroup();

  kit.create(300, 613, "kit")
  kit.create(140, 525, "kit")
  kit.create(430, 523, "kit")
  kit.create(380, 363, "kit")
  kit.create(30, 428, "kit")
  kit.create(200, 393, "kit")
  kit.create(540, 423, "kit")
  kit.create(720, 363, "kit")
  kit.create(560, 283, "kit")
  kit.create(250, 193, "kit")
  kit.create(100, 303, "kit")
  kit.create(400, 123, "kit")
  kit.create(110, 93, "kit")
  kit.create(550, 133, "kit")

  door.create(690, 78, "door")

  plataforma.create(300, 650, "plataforma")
  plataforma.create(140, 565, "plataforma")
  plataforma.create(430, 560, "plataforma")
  plataforma.create(380, 400, "plataforma")
  plataforma.create(30, 465, "plataforma")
  plataforma.create(200, 430, "plataforma")
  plataforma.create(540, 460, "plataforma")
  plataforma.create(720, 400, "plataforma")
  plataforma.create(560, 320, "plataforma")
  plataforma.create(250, 230, "plataforma")
  plataforma.create(100, 340, "plataforma")
  plataforma.create(400, 160, "plataforma")
  plataforma.create(110, 130, "plataforma")
  plataforma.create(550, 170, "plataforma")
  porta.create(690, 123, "plataforma")

  player1.body.collideWorldBounds = true;
  player2.body.collideWorldBounds = true;

  player1.body.setAllowGravity(false);
  player2.body.setAllowGravity(false);

  this.physics.add.collider(player1, plataforma, null, null, this);
  this.physics.add.collider(player2, plataforma, null, null, this);

  this.physics.add.collider(player1, porta, gameover, null, this);
  this.physics.add.collider(player2, porta, gameover, null, this);

  this.physics.add.overlap(player1, kit, colectKit, null, this);
  this.physics.add.overlap(player2, kit, colectKit, null, this);

  // Animação do jogador 1: a esquerda
  this.anims.create({
    key: "left1",
    frames: this.anims.generateFrameNumbers("player1", {
      start: 10,
      end: 16,
    }),
    frameRate: 10,
    repeat: -1,
  });

  // Animação do jogador 2: a esquerda
  this.anims.create({
    key: "left2",
    frames: this.anims.generateFrameNumbers("player2", {
      start: 0,
      end: 5,
    }),
    frameRate: 10,
    repeat: -1,
  });

  // Animação do jogador 1: a direita
  this.anims.create({
    key: "right1",
    frames: this.anims.generateFrameNumbers("player1", {
      start: 10,
      end: 16,
    }),
    frameRate: 10,
    repeat: -1,
  });

  // Animação do jogador 2: a direita
  this.anims.create({
    key: "right2",
    frames: this.anims.generateFrameNumbers("player2", {
      start: 0,
      end: 5,
    }),
    frameRate: 10,
    repeat: -1,
  });

  // Animação do jogador 1: ficar parado (e virado para a direita)
  this.anims.create({
    key: "stopped1",
    frames: this.anims.generateFrameNumbers("player1", {
      start: 0,
      end: 1,
    }),
    frameRate: 5,
    repeat: -1,
  });

  // Animação do jogador 2: ficar parado (e virado para a direita)
  this.anims.create({
    key: "stopped2",
    frames: this.anims.generateFrameNumbers("player2", {
      start: 5,
      end: 5,
    }),
    frameRate: 5,
    repeat: -1,
  });

  // Direcionais do teclado
  cursors = this.input.keyboard.createCursorKeys();

  // Botão de ativar/desativar tela cheia
  var button = this.add
    .image(800 - 16, 16, "fullscreen", 0)
    .setOrigin(1, 0)
    .setInteractive()
    .setScrollFactor(0);

  // Ao clicar no botão de tela cheia
  button.on(
    "pointerup",
    function () {
      if (this.scale.isFullscreen) {
        button.setFrame(0);
        this.scale.stopFullscreen();
      } else {
        button.setFrame(1);
        this.scale.startFullscreen();
      }
    },
    this
  );

  // Tecla "F" também ativa/desativa tela cheia
  var FKey = this.input.keyboard.addKey("F");
  FKey.on(
    "down",
    function () {
      if (this.scale.isFullscreen) {
        button.setFrame(0);
        this.scale.stopFullscreen();
      } else {
        button.setFrame(1);
        this.scale.startFullscreen();
      }
    },
    this
  );

  // Conectar no servidor via WebSocket
  this.socket = io();

  // Disparar evento quando jogador entrar na partida
  var self = this;
  var physics = this.physics;
  var time = this.time;
  var socket = this.socket;

  this.socket.on("jogadores", function (jogadores) {
    if (jogadores.primeiro === self.socket.id) {
      // Define jogador como o primeiro
      jogador = 1;

      // Personagens colidem com os limites da cena
      player1.setCollideWorldBounds(true);

      // Detecção de colisão: terreno
      player1.body.setAllowGravity(true);

      // Detecção de colisão e disparo de evento: ARCas
      
     
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          midias = stream;
        })
        .catch((error) => console.log(error));

    } else if (jogadores.segundo === self.socket.id) {
      // Define jogador como o segundo
      jogador = 2;

      // Personagens colidem com os limites da cena
      player2.setCollideWorldBounds(true);
      player2.body.setAllowGravity(true);

      // Detecção de colisão: terreno
      //physics.add.collider(player2, terreno, hitCave, null, this);

      // Detecção de colisão e disparo de evento: ARCas
      //physics.add.collider(player2, ARCas, hitARCa, null, this);
     
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          midias = stream;
          localConnection = new RTCPeerConnection(ice_servers);
          midias
            .getTracks()
            .forEach((track) => localConnection.addTrack(track, midias));
          localConnection.onicecandidate = ({ candidate }) => {
            candidate &&
              socket.emit("candidate", jogadores.primeiro, candidate);
          };
          console.log(midias);
          localConnection.ontrack = ({ streams: [midias] }) => {
            audio.srcObject = midias;
          };
          localConnection
            .createOffer()
            .then((offer) => localConnection.setLocalDescription(offer))
            .then(() => {
              socket.emit(
                "offer",
                jogadores.primeiro,
                localConnection.localDescription
              );
            });
        })
        .catch((error) => console.log(error));
    }

    // Os dois jogadores estão conectados
    console.log(jogadores);
    
  });

  this.socket.on("offer", (socketId, description) => {
    remoteConnection = new RTCPeerConnection(ice_servers);
    midias
      .getTracks()
      .forEach((track) => remoteConnection.addTrack(track, midias));
    remoteConnection.onicecandidate = ({ candidate }) => {
      candidate && socket.emit("candidate", socketId, candidate);
    };
    remoteConnection.ontrack = ({ streams: [midias] }) => {
      audio.srcObject = midias;
    };
    remoteConnection
      .setRemoteDescription(description)
      .then(() => remoteConnection.createAnswer())
      .then((answer) => remoteConnection.setLocalDescription(answer))
      .then(() => {
        socket.emit("answer", socketId, remoteConnection.localDescription);
      });
  });

  socket.on("answer", (description) => {
    localConnection.setRemoteDescription(description);
  });

  socket.on("candidate", (candidate) => {
    const conn = localConnection || remoteConnection;
    conn.addIceCandidate(new RTCIceCandidate(candidate));
  });

  // Desenhar o outro jogador
  this.socket.on("desenharOutroJogador", ({ frame, x, y }) => {
    if (jogador === 1) {
      player2.setFrame(frame);
      player2.x = x;
      player2.y = y;
    } else if (jogador === 2) {
      player1.setFrame(frame);
      player1.x = x;
      player1.y = y;
    }
  });
};
cena1.update = function (time, delta) {
  // Controle do personagem por direcionais
  if (jogador === 1 ){
    if (cursors.left.isDown) {
      player1.body.setVelocityX(-100);
      player1.anims.play("left1", true);
    } else if (cursors.right.isDown) {
      player1.body.setVelocityX(100);
      player1.anims.play("right1", true);
    } else {
      player1.body.setVelocityX(0);
      player1.anims.play("stopped1", true);
    }
    if (cursors.up.isDown && player1.body.blocked.down)  {
      player1.body.setVelocityY(-330);
    } 
    this.socket.emit("estadoDoJogador", {
      frame: player1.anims.currentFrame.index,
      x: player1.body.x + 16,
      y: player1.body.y + 16,
    });
  } else if (jogador === 2 ) {
    if (cursors.left.isDown) {
      player2.body.setVelocityX(-100);
      player2.anims.play("left2", true);
    } else if (cursors.right.isDown) {
      player2.body.setVelocityX(100);
      player2.anims.play("right2", true);
    } else {
      player2.body.setVelocityX(0);
      player2.anims.play("stopped2", true);
    }
    if (cursors.up.isDown && player2.body.blocked.down) {
      player2.body.setVelocityY(-330);
    }
    this.socket.emit("estadoDoJogador", {
      frame: player2.anims.currentFrame.index,
      x: player2.body.x + 16,
      y: player2.body.y + 16,
    });
  }
};

function gameover(player, plataforma) {
  this.scene.start(cena2)

}

function colectKit(player, kit){
  kit.disableBody(true, true)
}

// Exportar a cena
export { cena1 };
