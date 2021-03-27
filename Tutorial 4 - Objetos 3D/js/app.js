// A primeira coisa que é necessário é um elemento HTML do tipo canvas

var canvas = document.createElement("canvas");

// Em primeiro lugar temos que especificar qual o tamanho do canvas
// O tamanho do canvas vai ser o tamango da janela (window)
canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 45;

// Para podermos trabalhar sobre WebGL é necessário termos a Biblioteca Gráfica
// (GL sifgnifica Graphic Library)

var GL = canvas.getContext("webgl");

// Criar o vertex shader. Este shader é chamado por cada vértice do objeto
// de modo a indicar qual a posição do vértice
var vertexShader = GL.createShader(GL.VERTEX_SHADER);

// Criar o fragment shader. Este shader é chamado para todos os píxeis do objeto
// de modo a dar cor ao objeto
var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);

// Criar o programa que utilizará os shaders
var program = GL.createProgram();

var gpuArrayBuffer = GL.createBuffer();

// Variável que guarda a localização da variável 'transormationMatrix' do vertexShader
var finalMatrixLocation;

// Variável que guarda a rotação que de3ve ser aplicada ao objeto
var anguloDeRotacao = 0;

// Localização da variável 'visualizationMatrix'
var visualizationMatrixLocation;

// Localização da variável 'projectionMatrix'
var projectionMatrixLocation;

// Localização da variável 'viewportMatrix'
var viewportMatrixLocation;

// Variável que irá guardar a posição dos vértices
var vertexPosition;

// Variável que irá guardar o conjunto de vértices que constituem cada triângulo
var vertexIndex;

// Buffer que irá guardar todos o conjunto de vértices na GPU
var gpuIndexBuffer = GL.createBuffer();

// Função responsável por preparar o canvas
function PrepareCanvas() {
  GL.clearColor(0.65, 0.65, 0.65, 1.0);

  // Limpa os buffers de profundidade e de cor para aplicar a cor
  // atribúida acima
  GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

  // Permite o teste de profundidade
  GL.enable(GL.DEPTH_TEST);

  // Permite visualizar apenas os triângulos que tiverem as normais viradas para a câmara
  GL.enable(GL.CULL_FACE);

  // Adiciona o canvas ao body do documento.
  document.body.appendChild(canvas);

  //Depois do canvas adicionar um pequeno texto a dizer que o canvas
  // se encontra acima do texto
  canvas.insertAdjacentText(
    "afterend",
    "O canvas encontra-se acima deste texto"
  );
}

// Função responsável por preparar os shaders
function PrepareShaders() {
  // Atribui o código que está no ficheiro "shaders.js" ao vertexShader
  GL.shaderSource(vertexShader, codigoVertexShader);

  // Atribui o código que está no ficheiro "shaders.js" ao fragmentShader.
  GL.shaderSource(fragmentShader, codigoFragmentShader);

  // Esta linha de código compila o shader passado por parâmetro
  GL.compileShader(vertexShader); // Compila o vertexShader
  GL.compileShader(fragmentShader); // Compila o fragmentShader

  // Depois de compilado os shaders é necessário verificar se ocorreu algum erro
  // durante a compilação. Para o vertex shader usamos o código abaixo
  if (!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS)) {
    console.error(
      "Erro:: A compilação do vertex shader lançou uma excepção!",
      GL.getShaderInfoLog(vertexShader)
    );
  }
  if (!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS)) {
    console.error(
      "Erro:: A compilação do fragment shader lançou uma excepção!",
      GL.getShaderInfoLog(fragmentShader)
    );
  }
}
// função responsável por preparar o Programma que irá correr sobre a GPU
function PrepareProgram() {
  GL.attachShader(program, vertexShader);
  GL.attachShader(program, fragmentShader);

  GL.linkProgram(program);
  if (!GL.getProgramParameter(program, GL.LINK_STATUS)) {
    console.error(
      "Erro:: O linkProgram lançou uma excepção!",
      GL.getProgramInfoLog(program)
    );
  }
  GL.validateProgram(program);

  if (!GL.getProgramParameter(program, GL.VALIDATE_STATUS)) {
    console.error(
      "Erro:: A validação do program lançou uma excepção!",
      GL.getProgramInfoLog(program)
    );
  }

  GL.useProgram(program);
}

function PrepareTriangleData() {
  //   // prettier-ignore
  //   vertexPosition = [
  //     // X, Y, Z, R, G, B

  //     // Frente

  //     0,0,0,0,0,0,
  //     0,1,0,0,1,0,
  //     1,1,0,1,1,0,
  //     1,0,0,1,0,0,

  //     // Direita
  //     1,0,0,1,0,0,
  //     1,1,0,1,1,0,
  //     1,1,1,1,1,1,
  //     1,0,1,1,0,1,

  //     // Trás
  //     1,0,1,1,0,1,
  //     1,1,1,1,1,1,
  //     0,1,1,0,1,1,
  //     0,0,1,0,0,1,

  //     // Esquerda
  //     0,0,1,0,0,1,
  //     0,1,1,0,1,1,
  //     0,1,0,0,1,0,
  //     0,0,0,0,0,0,

  //     // Cima
  //     0,1,0,0,1,0,
  //     0,1,1,0,1,1,
  //     1,1,1,1,1,1,
  //     1,1,0,1,1,0,

  //     // Baixo
  //     1,0,0,1,0,0,
  //     1,0,1,1,0,1,
  //     0,0,1,0,0,1,
  //     0,0,0,0,0,0,
  //   ];

  // Desafio 2
  // prettier-ignore
  //   vertexPosition = [
  //     // X, Y, Z, R, G, B

  //     // Frente

  //     0,0,0,0,0,0,
  //     0,1,0,0,1,0,
  //     2,1,0,1,1,0,
  //     2,0,0,1,0,0,

  //     // Direita
  //     2,0,0,1,0,0,
  //     2,1,0,1,1,0,
  //     2,1,1,1,1,1,
  //     2,0,1,1,0,1,

  //     // Trás
  //     2,0,1,1,0,1,
  //     2,1,1,1,1,1,
  //     0,1,1,0,1,1,
  //     0,0,1,0,0,1,

  //     // Esquerda
  //     0,0,1,0,0,1,
  //     0,1,1,0,1,1,
  //     0,1,0,0,1,0,
  //     0,0,0,0,0,0,

  //     // Cima
  //     0,1,0,0,1,0,
  //     0,1,1,0,1,1,
  //     2,1,1,1,1,1,
  //     2,1,0,1,1,0,

  //     // Baixo
  //     2,0,0,1,0,0,
  //     2,0,1,1,0,1,
  //     0,0,1,0,0,1,
  //     0,0,0,0,0,0,
  //   ];

  // Desafio 5
  // prettier-ignore
  vertexPosition = [
      // X, Y, Z, R, G, B

      // Frente

      0,0,0,0,0,0,
      0,1,0,0,0,0,
      1,1,0,0,0,0,
      1,0,0,0,0,0,

      // Direita
      1,0,0,1,0.75,0.5,
      1,1,0,1,0.75,0.5,
      1,1,1,1,0.75,0.5,
      1,0,1,1,0.75,0.5,

      // Trás (De momento não é visivel)
      1,0,1,1,0,1,
      1,1,1,1,0,1,
      0,1,1,1,0,1,
      0,0,1,1,0,1,

      // Esquerda
      0,0,1,0,0.15,0.2,
      0,1,1,0,0.15,0.2,
      0,1,0,0,0.15,0.2,
      0,0,0,0,0.15,0.2,

      // Cima
      0,1,0,0.10,0.10,0,
      0,1,1,0.10,0.10,0,
      1,1,1,0.10,0.10,0,
      1,1,0,0.10,0.10,0,

      // Baixo
      1,0,0,0,1,1,
      1,0,1,0,1,1,
      0,0,1,0,1,1,
      0,0,0,0,1,1,
    ];

  // Array que guarda qual os indices do array anterior que constituem cada triangulo
  vertexIndex = [
    // Frente
    0,
    2,
    1,
    0,
    3,
    2,

    // Direita
    4,
    6,
    5,
    4,
    7,
    6,

    // Trás
    8,
    10,
    9,
    8,
    11,
    10,

    // Esquerda
    12,
    14,
    13,
    12,
    15,
    14,

    // Cima
    16,
    18,
    17,
    16,
    19,
    18,

    // Baixo
    20,
    22,
    21,
    20,
    23,
    22,
  ];

  GL.bindBuffer(GL.ARRAY_BUFFER, gpuArrayBuffer);

  GL.bufferData(
    GL.ARRAY_BUFFER,
    new Float32Array(vertexPosition),
    GL.STATIC_DRAW
  );
  // Voltamos a fazer bind ao novo buffer que acaabamos de criar dizendo que o buffer agora
  // e de ELEMENR_ARRAY_BUFFER
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gpuIndexBuffer);

  // Passamos os dados relativos aos indices de cada triangulo
  GL.bufferData(
    GL.ELEMENT_ARRAY_BUFFER, // Indica que os dados são do tipo ELEMENT_ARRAY_BUFFER
    new Uint16Array(vertexIndex), // Agora OS VALORES SÃO DO TIPO Unsigned int 16
    GL.STATIC_DRAW
  ); // Os valores são estáticos e não irão mudar ao longo do tempo
}

function SendDataToShaders() {
  var vertexPositionAttributeLocation = GL.getAttribLocation(
    program,
    "vertexPosition"
  );
  var vertexColorAttributeLocation = GL.getAttribLocation(
    program,
    "vertexColor"
  );

  GL.vertexAttribPointer(
    vertexPositionAttributeLocation,
    3,
    GL.FLOAT,
    false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    0 * Float32Array.BYTES_PER_ELEMENT
  );

  GL.vertexAttribPointer(
    vertexColorAttributeLocation,
    3,
    GL.FLOAT,
    false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT
  );

  // Agora é necessário ativar os atributos que vão ser utilizados e para isso utilizamos a linha seguinte
  // Temos de fazer isso para cada um das variáveis que pretendemos utilizar
  GL.enableVertexAttribArray(vertexPositionAttributeLocation);
  GL.enableVertexAttribArray(vertexColorAttributeLocation);

  //Guarda a localização da variável 'transformationMatrix do vertexShader'
  finalMatrixLocation = GL.getUniformLocation(program, "transformationMatrix");

  //Guarda a localização da variável 'visualizationMatrix do vertexShader'
  visualizationMatrixLocation = GL.getUniformLocation(
    program,
    "visualizationMatrix"
  );

  //Guarda a localização da variável 'projectionMatrix do vertexShader'
  projectionMatrixLocation = GL.getUniformLocation(program, "projectionMatrix");
  //Guarda a localização da variável 'viewportMatrix do vertexShader'
  viewportMatrixLocation = GL.getUniformLocation(program, "viewportMatrix");

  // Indica que vais utilizar este programa
  // GL.useProgram(program);

  // GL.drawArrays(
  //     GL.TRIANGLES,
  //     0,
  //     3);
}

// Função responsável pela animação
function loop() {
  // Resize do canvas
  canvas.width = window.innerWidth - 15;
  canvas.height = window.innerHeight - 45;
  GL.viewport(0, 0, canvas.width, canvas.height);

  // é necessário indica que o programa que vamos user
  GL.useProgram(program);

  // Limpeza de buffers a cada frame
  GL.clearColor(0.65, 0.65, 0.65, 1.0);
  GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);

  // Inicialização da variável que guarda a combinação de matrizes que
  // Vão ser passadas para o vertexShader

  var finalMatrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
  // Aplica vetor de translação ->(0.5, 0.5 , 0)
  //finalMatrix = math.multiply(CriarMatrizTranslacao(0.5, 0.5, 0), finalMatrix);

  // Reduz objeto em 4 vezes
  finalMatrix = math.multiply(CriarMatrizEscala(0.25, 0.25, 0.25), finalMatrix);

  // Rotação sobre o  eixo Y com o angulo : anguloDeRotacao
  finalMatrix = math.multiply(
    CriarMatrizRotacaoY(anguloDeRotacao),
    finalMatrix
  );

  // Desafio 4
  finalMatrix = math.multiply(
    CriarMatrizRotacaoX(anguloDeRotacao),
    finalMatrix
  );
  finalMatrix = math.multiply(
    CriarMatrizRotacaoZ(anguloDeRotacao),
    finalMatrix
  );

  // Foi adicionado esta transformação de translação para podermos mexer na posição do objeto no eixo do z
  finalMatrix = math.multiply(CriarMatrizTranslacao(0, 0, 1), finalMatrix);

  // DESAFIO 1 e Desafio 3- De modo a concentrar o cubo completo no ecrã, vamos mover o cubo em uma unidade no eixo dos z, de modo a "afastar" o objeto da câmara
  finalMatrix = math.multiply(CriarMatrizTranslacao(0, 0, 1), finalMatrix);

  // Conversão do array 2D para uma dimensão
  var newarray = [];

  for (var i = 0; i < finalMatrix.length; i++) {
    newarray = newarray.concat(finalMatrix[i]);
  }

  // Camara no ponto (0,0,0)
  var visualizationMatrix = MatrizDeVisualizacao(
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [0, 0, 0]
  );
  var newVisualizationMatrix = [];
  for (i = 0; i < visualizationMatrix.length; i++) {
    newVisualizationMatrix = newVisualizationMatrix.concat(
      visualizationMatrix[i]
    );
  }
  // distancia = 10, comprimento da camera de 4 unidades, altura de 3 unidades, plano anterior de 0.1 unidades,
  // plano posterior de 100 unidadeds.
  var projectionMatrix = MatrizPerspetiva(10, 4, 2, 0.1, 100);
  //var projectionMatrix = MatrizOrtografica(4, 3, 0.1, 100);
  var newProjectionMatrix = [];

  for (i = 0; i < projectionMatrix.length; i++) {
    newProjectionMatrix = newProjectionMatrix.concat(projectionMatrix[i]);
  }
  // Volume canónico em webgl tem o valor de x, y e z compreendidos entre -1 e 1
  var viewportMatrix = MatrizViewPort(-1, 1, -1, 1);
  var newViewportMatrix = [];

  for (i = 0; i < viewportMatrix.length; i++) {
    newViewportMatrix = newViewportMatrix.concat(viewportMatrix[i]);
  }

  GL.uniformMatrix4fv(finalMatrixLocation, false, newarray);

  // Função utilizada para passar o array de 1 dimensão relativo à matriz de visualização para o vertexShader
  GL.uniformMatrix4fv(
    visualizationMatrixLocation,
    false,
    newVisualizationMatrix
  );

  // Função utilizada para passar o array de 1 dimensão relativo à matriz de projecção para o vertexShader
  GL.uniformMatrix4fv(projectionMatrixLocation, false, newProjectionMatrix);

  // Função utilizada para passar o array de 1 dimensão relativo à matriz de viewport para o vertexShader
  GL.uniformMatrix4fv(viewportMatrixLocation, false, newViewportMatrix);

  // Esta função permite-nos utilizar vertexIndex para dizermos quais são os elementos que constituem os triÂngulos
  GL.drawElements(
    GL.TRIANGLES, // Queremos desenhar na mesma triângulos
    vertexIndex.length, // O número de elementos que vão ser desenhados
    GL.UNSIGNED_SHORT, // Qual o tipo de elementos
    0 // Qual o offset para o primeiro elemento a ser desenhado
  );

  //   await new Promise((r) => setTimeout(r, 2000));

  // A cada frame é preciso atualizar o angulo de rotação
  anguloDeRotacao += 1;

  requestAnimationFrame(loop);
}

function Start() {
  PrepareCanvas();
  console.log("PrepareCanvas executado");

  PrepareShaders();
  console.log("PrepareShaders executado");

  PrepareProgram();
  console.log("PrepareProgram executado");

  PrepareTriangleData();
  console.log("PrepareTriangleData executado");

  SendDataToShaders();
  console.log("SendDataToShaders executado");

  console.log("Vai começar o loop");
  loop();
}
