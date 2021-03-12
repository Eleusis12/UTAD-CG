/** 

* @param {float} x Valor para translação no eixo do x
* @param {float} y Valor para translação no eixo do y 
* @param {float} z Valor para translação no eixo do z
* Devolve um 2D array com a matriz de translacao pedida
**/

function CriarMatrizTranslacao(x, y, z) {

    // Matriz de translação final
    return [
        [1, 0, 0, x],
        [0, 1, 0, y],
        [0, 0, 1, z],
        [0, 0, 0, 1]
    ]

}

/** 

* @param {float} x Valor para translação no eixo do x
* @param {float} y Valor para translação no eixo do y 
* @param {float} z Valor para translação no eixo do z
* Devolve um 2D array com a matriz de escala pedida
**/

function CriarMatrizEscala(x, y, z) {
    // Matriz de escala final
    return [
        [x, 0, 0, 0],
        [0, y, 0, 0],
        [0, 0, z, 0],
        [0, 0, 0, 1]
    ];

}

/** 
 * @param {float} angulo Angulo em graus para rodar noe eixo de x
 * **/

function CriarMatrizRotacaoX(angulo) {
    // Seno e Cosseno são calculados em radianos, logo é necessário converter em graus 
    // para radianos utilizados a linha a baixo
    var radianos = angulo * Math.PI / 180;

    // Matriz final de Rotação no eixo do x
    return [
        [1, 0, 0, 0],
        [0, Math.cos(radianos), -Math.sin(radianos), 0],
        [0, Math.cos(radianos), Math.cos(radianos), 0],
        [0, 0, 0, 1]
    ];



}

/** 
 * @param {float} angulo Angulo em graus para rodar noe eixo de y
 * **/

function CriarMatrizRotacaoY(angulo) {
    // Seno e Cosseno são calculados em radianos, logo é necessário converter em graus 
    // para radianos utilizados a linha a baixo
    var radianos = angulo * Math.PI / 180;

    // Matriz final de Rotação no eixo do x
    return [
        [Math.cos(radianos), 0, Math.sin(radianos), 0],
        [0, 1, 0, 0],
        [-Math.sin(radianos), 0, Math.cos(radianos), 0],
        [0, 0, 0, 1]
    ];

}

/** 
 * @param {float} angulo Angulo em graus para rodar noe eixo de z
 * **/

function CriarMatrizRotacaoZ(angulo) {
    // Seno e Cosseno são calculados em radianos, logo é necessário converter em graus 
    // para radianos utilizados a linha a baixo
    var radianos = angulo * Math.PI / 180;

    // Matriz final de Rotação no eixo do x
    return [
        [Math.cos(radianos), Math.sin(radianos), 0, 0],
        [Math.sin(radianos), Math.cos(radianos), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

}