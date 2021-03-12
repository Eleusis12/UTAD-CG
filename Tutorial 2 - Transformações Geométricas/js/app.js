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

// Função responsável por preparar o canvas
function PrepareCanvas() {
    GL.clearColor(0.65, 0.65, 0.65, 1.0);

    // Limpa os buffers de profundidade e de cor para aplicar a cor
    // atribúida acima
    GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);




    // Adiciona o canvas ao body do documento.
    document.body.appendChild(canvas);

    //Depois do canvas adicionar um pequeno texto a dizer que o canvas
    // se encontra acima do texto
    canvas.insertAdjacentText("afterend", "O canvas encontra-se acima deste texto");




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
        console.error("Erro:: A compilação do vertex shader lançou uma excepção!", GL.getShaderInfoLog(vertexShader));
    }
    if (!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS)) {
        console.error("Erro:: A compilação do fragment shader lançou uma excepção!", GL.getShaderInfoLog(fragmentShader));
    }


}
// função responsável por preparar o Programma que irá correr sobre a GPU
function PrepareProgram() {
    GL.attachShader(program, vertexShader);
    GL.attachShader(program, fragmentShader);

    GL.linkProgram(program);
    if (!GL.getProgramParameter(program, GL.LINK_STATUS)) {
        console.error("Erro:: O linkProgram lançou uma excepção!", GL.getProgramInfoLog(program));
    }
    GL.validateProgram(program);

    if (!GL.getProgramParameter(program, GL.VALIDATE_STATUS)) {
        console.error("Erro:: A validação do program lançou uma excepção!", GL.getProgramInfoLog(program));
    }

    GL.useProgram(program);

}

function PrepareTriangleData() {
    var triangleArray = [
        -0.50, -0.5, 0.0, 1.0, 0.0, 0.0,
        0.50, -0.5, 0.0, 0.0, 1.0, 0.0,
        0.0, 0.50, 0.0, 0.0, 0.0, 1.0,
    ];

    GL.bindBuffer(GL.ARRAY_BUFFER, gpuArrayBuffer);

    GL.bufferData(
        GL.ARRAY_BUFFER, new Float32Array(triangleArray),
        GL.STATIC_DRAW
    );

}

function SendDataToShaders() {
    var vertexPositionAttributeLocation = GL.getAttribLocation(program, "vertexPosition");
    var vertexColorAttributeLocation = GL.getAttribLocation(program, "vertexColor");

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
    finalMatrixLocation = GL.getUniformLocation(program, 'transformationMatrix');

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
        [0, 0, 0, 1]

    ];
    // Aplica vetor de translação ->(0.5, 0.5 , 0)
    finalMatrix = math.multiply(CriarMatrizTranslacao(0.5, 0.5, 0), finalMatrix);

    // Reduz objeto em 4 vezes
    finalMatrix = math.multiply(CriarMatrizEscala(0.25, 0.25, 0.25), finalMatrix);

    // Rotação sobre o  eixo Y com o angulo : anguloDeRotacao
    finalMatrix = math.multiply(CriarMatrizRotacaoY(anguloDeRotacao), finalMatrix);



    // Conversão do array 2D para uma dimensão
    var newarray = [];

    for (var i = 0; i < finalMatrix.length; i++) {
        newarray = newarray.concat(finalMatrix[i]);
    }

    GL.uniformMatrix4fv(finalMatrixLocation, false, newarray);

    // Agora temos que mandar desenhar os triângulos
    GL.drawArrays(
        GL.TRIANGLES,
        0,
        3

    );

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