document.addEventListener("DOMContentLoaded", Start);

// cena, câmara e um render em webgl
var cena = new THREE.Scene();
var camara = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
var renderer = new THREE.WebGLRenderer();

// Tamanho da janela de visualização
renderer.setSize(window.innerWidth - 15, window.innerHeight - 15);

// Adiciona o render ao html
document.body.appendChild(renderer.domElement);

// Criar um cubo - é necessário criar a geometria
var geometria = new THREE.BoxGeometry(1, 1, 1);

// Criar um cubo - é necessário criar o material
var material = new THREE.MeshStandardMaterial({ color: 0xff0000 });

// A mesh é o component necessário para fazer as diferetens transformações ao objeto
var cubo = new THREE.Mesh(geometria, material);

// Variável que vai guardar que rotação aplicar ao cubo
var cuboCoordRotation;

// Variável que irá guardar para que direções a camara se irá movimentar
var objetoAndar = { x: 0, y: 0, z: 0 };

// Velocidade de movimentação que a camara irá andar
var velocidadeAndar = 0.05;

// Variável que guardará o objeto importado
var objetoImportado;

// Variável que irá guardar o controlador de animações do objeto importado
var mixerAnimation;

// Variável que é responsável por controlar o tempo da aplicação
var relogio = new THREE.Clock();

// Variável com o objeto responsável por importar focheiros FBX
var importer = new THREE.FBXLoader();

function LoadFBXModel(_callback) {
  // Função utilizada para importar objetos FBX
  importer.load("./objetos/Samba Dancing.fbx", function (object) {
    // Inicializar mixerAnimation
    mixerAnimation = new THREE.AnimationMixer(object);

    // Reproduzir a animação
    var action = mixerAnimation.clipAction(object.animations[0]);
    action.play();

    // Percorrer os filhos do objetos
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Adiciona o objeto importar à cena
    cena.add(object);

    // Quando o objeto é imporatdo, este tem uma escala de 1 nos três eixos. Então vamos reduzir a escala do objeto
    object.scale.x = 0.01;
    object.scale.y = 0.01;
    object.scale.z = 0.01;

    // Mudamos a posição do objeto importado para que este não fique na mesma posição que o cubo
    object.position.x = 3;

    // Guardamos o objeto importado na variável objetoImportado
    object;

    _callback(object);
  });
}
document.addEventListener("mousemove", (ev) => {
  console.log("mousemove");
  // A posição do rato encontra-se de 0 até ao tamanho do ecrã em pixeis. É então
  // necessário converte-lo para a escala de -1 a 1. Para isso utilizamos o código abaixo

  var x = ((ev.clientX - 0) / (window.innerWidth - 0)) * (1 - -1) + -1;
  var y = ((ev.clientY - 0) / (window.innerHeight - 0)) * (1 - -1) + -1;

  //Adicionamos a rotação que devemos aplicar na variável cuboCoordRotation
  cuboCoordRotation = {
    x: x,
    y: y,
  };
});

// Adicionamos um evento que é ativado ao pressionar numa tecla
document.addEventListener("keydown", (ev) => {
  console.log("Keydown");

  // Iniciailiza a variável de controlo
  var coords = {
    x: 0,
    y: 0,
    z: 0,
  };

  //W
  if (ev.keyCode == 87) coords.z -= velocidadeAndar;
  //S
  if (ev.keyCode == 83) coords.z += velocidadeAndar;
  //A
  if (ev.keyCode == 65) coords.x -= velocidadeAndar;
  //D
  if (ev.keyCode == 68) coords.x += velocidadeAndar;
  // Aplica a variável coords à variável camaraAndar
  objetoAndar = coords;
});

// Adicionamos um evento que é ativado sempre que a tecla deixa de ser premida
document.addEventListener("keyup", (ev) => {
  console.log("keyup");

  // Inicializa a variável de controlo
  var coords = {
    x: 0,
    y: 0,
    z: 0,
  };

  //W
  if (ev.keyCode == 87) coords.z += velocidadeAndar;
  //S
  if (ev.keyCode == 83) coords.z -= velocidadeAndar;
  //A
  if (ev.keyCode == 65) coords.x += velocidadeAndar;
  //D
  if (ev.keyCode == 68) coords.x -= velocidadeAndar;
  // Aplica a variável coords à variável camaraAndar
  objetoAndar = coords;
});

function Start() {
  cena.add(cubo);

  LoadFBXModel((object) => {
    objetoImportado = object;

    // Criação de um foco de luz com a cord branca, com intendisade 1 (normal)
    // var light = new THREE.SpotLight("#ffffff", 1);
    // DESAFIO2
    var light = new THREE.SpotLight("#4169e1", 1);

    // Mudar a posição da luz para ficar a 5 unidades a cima de onde a câmara se encontra
    light.position.y = 5;
    light.position.z = 10;
    light.position.z = 10;

    // Dizemos a light para ficar a apontar para a posição do cubo
    // light.lookAt(cubo.position);

    // DESAFIO3
    light.lookAt(objetoImportado.position);

    // Aidionamos a luz à cena
    cena.add(light);

    camara.position.z = 4;
  });

  // Atualiza a cada frame
  requestAnimationFrame(update);
}

function update() {
  // A cada frame mudamos a rotação do cubo no eixo tendo em conta da posição do rato
  if (cuboCoordRotation != null) {
    cubo.rotation.x += cuboCoordRotation.y * 0.1;
    cubo.rotation.y += cuboCoordRotation.x * 0.1;
  }

  // A cada frame mudamos a posiaçõa do objeto Importado tendo em conta as teclas premidas
  // DESAFIO1 - Movimento do objeto importado de acordo com os inputs
  if (objetoAndar != null && objetoImportado !== undefined) {
    objetoImportado.position.x += objetoAndar.x;
    objetoImportado.position.z += objetoAndar.z;
  }
  // Necessário atualizar o mixerAnimação tendo em conta o tempo desde o último update
  // relogio.getDelta() indica quanto tempo passou desde o último frame renderizado
  if (mixerAnimation) mixerAnimation.update(relogio.getDelta());

  // Reiniciar a variável
  objetoAndar = {
    x: 0,
    y: 0,
    z: 0,
  };

  // Renderizamos a cena tendo em conta qual a cena que queremos visualizar e a câmara que pretendemos
  renderer.render(cena, camara);

  requestAnimationFrame(update);
}
