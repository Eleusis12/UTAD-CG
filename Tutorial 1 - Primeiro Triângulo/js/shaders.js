const codigoVertexShader = [
    'precision mediump float;', // indica qual a precisão do tipo floay,
    'attribute vec3 vertexPosition;', // variável read-only do tipo vec3 que indicará a posição de um vértice
    'attribute vec3 vertexColor;', // Variável read-only do tipo vec3 que indicará a cord de um vértice
    'varying vec3 fragColor;', // Variável que serve de interface entre o vertex shader e o fragment shader
    'void main(){',
    //Dizemos ao fragment shader qual é a cor do vértice
    '   fragColor = vertexColor;',
    // gl_Position é uma variável própria do Shader que indica a posição do vértice.
    // Esta variável é do tipo vec4 e a variável vertexPosition é do tipo vec3
    // Por esta razão temos que colocar 1.0 como último elemento.
    '   gl_Position = vec4(vertexPosition, 1.0);',
    '}'


].join('\n');

const codigoFragmentShader = [
    'precision mediump float;', // indica qual a precisão do tipo float
    'varying vec3 fragColor;', // Variável que serve de interface entre o vertex shader e o fragment shader
    'void main(){',
    // gl_Position é uma variável própria do Shader que indica a posição do vértice.
    // Esta variável é do tipo vec4 e a variável vertexPosition é do tipo vec3
    // Por esta razão temos que colocar 1.0 como último elemento.
    '   gl_FragColor = vec4(fragColor, 1.0);',
    '}'


].join('\n');