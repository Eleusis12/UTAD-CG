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
var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// A mesh é o component necessário para fazer as diferetens transformações ao objeto
var cubo = [new THREE.Mesh(geometria, material)];

// Variável que vai guardar que rotação aplicar ao cubo
var cuboCoordRotation;

// Variável que irá guardar para que direções a camara se irá movimentar
var camaraAndar = { x: 0, y: 0, z: 0 };

// Velocidade de movimentação que a camara irá andar
var velocidadeAndar = 0.05;

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
  camaraAndar = coords;
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
  camaraAndar = coords;
});

// DESAFIO2 - Criar cubos aleatoriamente
document.addEventListener("keypress", (ev) => {
  if (ev.keyCode == 32) {
    console.log("Criar Cubo");
    // const geometry = new THREE.BoxGeometry(1, 1, 1);

    // var coords = {
    //   x: THREE.MATH.randINT(min, max),
    //   y: THREE.MATH.randINT(min, max),
    //   z: THREE.MATH.randINT(min, max),
    // };

    console.log();
    let material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
    let novoCubo = new THREE.Mesh(geometria, material);
    novoCubo.position.set(
      THREE.MathUtils.randInt(-7, 7),
      THREE.MathUtils.randInt(-4, 4),
      THREE.MathUtils.randInt(-5, 5)
    );

    cubo.push(novoCubo);
    cena.add(cubo[cubo.length - 1]);
  }
});

function Start() {
  SnowMan();
  cena.add(cubo[0]);

  camara.position.z = 6;

  requestAnimationFrame(update);
}

function update() {
  // A cada frame mudamos a rotação do cubo no eixo tendo em conta da posição do rato
  if (cuboCoordRotation != null) {
    cubo.forEach((element) => {
      element.rotation.x += cuboCoordRotation.y * 0.1;
      element.rotation.y += cuboCoordRotation.x * 0.1;
    });
  }

  // A cada frame mudamos a posiaçõa da camra tendo em conta as teclas premidas
  if (camaraAndar != null) {
    camara.position.x += camaraAndar.x;
    camara.position.z += camaraAndar.z;
  }
  // Reiniciar a variável
  camaraAndar = {
    x: 0,
    y: 0,
    z: 0,
  };

  // Renderizamos a cena tendo em conta qual a cena que queremos visualizar e a câmara que pretendemos
  renderer.render(cena, camara);

  requestAnimationFrame(update);
}

// Gera uma cor aleatória
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// DESAFIO1 - Boneco de neve
function SnowMan() {
  // O boneco de neve precisa de 4 geometrias
  var geometriaBase = new THREE.CircleGeometry(1.5, 32);
  var geometriaCabeca = new THREE.CircleGeometry(0.75, 32);
  var geometriaOlhos = new THREE.CircleGeometry(0.1, 32);
  const geometriaBoca = new THREE.TorusGeometry(3, 1, 2, 80, -3);

  // Branco
  var materialBranco = new THREE.MeshBasicMaterial({ color: 0xffffff });
  // Preto
  var materialPreto = new THREE.MeshBasicMaterial({ color: 0x000000 });
  // Vermelho
  var materialVermelho = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  var base = new THREE.Mesh(geometriaBase, materialBranco);
  var cabeca = new THREE.Mesh(geometriaCabeca, materialBranco);
  var olhos = new THREE.Mesh(geometriaOlhos, materialPreto);
  var olhos2 = new THREE.Mesh(geometriaOlhos, materialPreto);
  var boca = new THREE.Mesh(geometriaBoca, materialVermelho);

  base.position.set(-6, -2, 0);
  cabeca.position.set(-6, 0, 0);
  olhos.position.set(-6.3, 0, 0);
  olhos2.position.set(-5.7, 0, 0);
  boca.position.set(-6, -0.2, 0);

  // Colocar o sorriso mais pequeno
  boca.scale.set(0.1, 0.1, 0);

  cena.add(base);
  cena.add(cabeca);
  cena.add(olhos);
  cena.add(olhos2);
  cena.add(boca);
}
