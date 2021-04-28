const codigoVertexShader = [
  "precision mediump float;", // indica qual a precisão do tipo floay,
  "attribute vec3 vertexPosition;", // variável read-only do tipo vec3 que indicará a posição de um vértice

  "attribute vec2 texCoords;",
  "varying vec2 fragTexCoords;",
  // 'attribute vec3 vertexColor;', // Variável read-only do tipo vec3 que indicará a cord de um vértice
  // 'varying vec3 fragColor;', // Variável que serve de interface entre o vertex shader e o fragment shader
  // Matriz de 4*4 que indica quais as transformações que devem ser
  //feitas a cada um dos vértices
  "uniform mat4 transformationMatrix;",
  "uniform mat4 visualizationMatrix;", // Matriz de Visualização
  "uniform mat4 projectionMatrix;", // Matriz de Projeccção
  "uniform mat4 viewportMatrix;", // Matriz de ViewPort
  "void main(){",
  //Dizemos ao fragment shader qual é a cor do vértice
  //   "   fragColor = vertexColor;",
  "fragTexCoords = texCoords;",
  // gl_Position é uma variável própria do Shader que indica a posição do vértice.
  // Esta variável é do tipo vec4 e a variável vertexPosition é do tipo vec3
  // Por esta razão temos que colocar 1.0 como último elemento.
  // Depois de transformação geométrica é necessário multiplicar pelas matrizes de visualização, projecção e viewport
  "   gl_Position = vec4(vertexPosition, 1.0) * transformationMatrix * visualizationMatrix * projectionMatrix * viewportMatrix;",
  "}",
].join("\n");

const codigoFragmentShader = [
  "precision mediump float;", // indica qual a precisão do tipo float
  //   "varying vec3 fragColor;", // Variável que serve de interface entre o vertex shader e o fragment shader
  "varying vec2 fragTexCoords;",
  "uniform sampler2D sampler;",
  "void main(){",
  // gl_Position é uma variável própria do Shader que indica a posição do vértice.
  // Esta variável é do tipo vec4 e a variável vertexPosition é do tipo vec3
  // Por esta razão temos que colocar 1.0 como último elemento.
  "   gl_FragColor = texture2D(sampler, fragTexCoords);",
  "}",
].join("\n");
