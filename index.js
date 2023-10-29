// Función para crear la matriz de inputs
function crearMatrizInputs(filas, columnas) {
    // Crear un elemento div para contener la matriz
    const matrizContainer = document.getElementById('matriz-container');
    const tabla = document.createElement('table');

    // Generar la matriz de inputs
    for (let i = 0; i < filas; i++) {
        const fila = document.createElement('tr');
        for (let j = 0; j < columnas; j++) {
            const celda = document.createElement('td');

            // Crea el input y agrega las clases de Tailwind CSS para reducir su tamaño
            const input = document.createElement('input');
            input.type = 'text';
            input.name = `valor${i}${j}`;
            input.className = 'w-32 h-10 px-1 py-1 rounded border';

            celda.appendChild(input);
            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }

    // Agregar la tabla de inputs al contenedor
    matrizContainer.innerHTML = '';
    matrizContainer.appendChild(tabla);
}

// Función para crear una matriz adicional de nxn según la cantidad de criterios
function crearMatrizNxN(criterios,namediv) {
    // Crear un elemento div para contener la matriz adicional
    const matrizContainerAdicional = document.getElementById(namediv);
    //matrizContainerAdicional.style.display = 'block'; // Mostrar la matriz adicional
    const tablaAdicional = document.createElement('table');

    // Crear una matriz para almacenar los valores
    const valores = [];
    
    // Generar la matriz adicional de nxn
    // Generar la matriz adicional de nxn
    for (let i = 0; i < criterios; i++) {
        const fila = document.createElement('tr');
        for (let j = 0; j < criterios; j++) {
            const celda = document.createElement('td');
            const valor = (i === j) ? 1 : ''; // Establece 1 en 1x1, de lo contrario, vacío
    
            // Crea el input y agrega las clases de Tailwind CSS
            const input = document.createElement('input');
            input.type = 'text';
            input.name = `valor${i}${j}`;
            input.value = valor;
            input.className = 'w-16 h-10 px-2 py-1 rounded border m-2'; // Agrega 'm-2' para el margen
    
            celda.appendChild(input);
    
            
            fila.appendChild(celda);
        }
        tablaAdicional.appendChild(fila);
    }


    // Agregar la tabla de inputs al contenedor adicional
    matrizContainerAdicional.innerHTML = '';
    matrizContainerAdicional.appendChild(tablaAdicional);
}


// Obtener los campos de entrada de número y el botón
const filasInput = document.getElementById('opciones');
const columnasInput = document.getElementById('criterios');
const crearMatrizButton = document.getElementById('crearMatriz');

if (crearMatrizButton) {
    // Agregar un controlador de eventos al botón para crear la matriz
    crearMatrizButton.addEventListener('click', function () {
        const filas = parseInt(filasInput.value);
        const columnas = parseInt(columnasInput.value);

        if (!isNaN(filas) && !isNaN(columnas)) {
            //crearMatrizInputs(filas, columnas);
            crearMatrizNxN(columnas,'matriz-container-adicional');
        }
    });
}

//BOTON PARA RESOLVER
const guardarMatrizButton = document.getElementById('guardarMatriz');


if (guardarMatrizButton) {
    guardarMatrizButton.addEventListener('click', function () {
        // Obtener todos los inputs de la matriz adicional
        const inputs = document.querySelectorAll('#matriz-container-adicional input');

        // Crear una matriz para almacenar los datos de la matriz adicional
        let datosMatrizAdicional = [];

        // Iterar a través de los inputs y capturar los valores
        inputs.forEach(input => {
            // Parsear el valor como fracción o número decimal
            let valor = (input.value);

            if(valor.includes("/")){valor = parseFraction(valor)}else{valor = parseInt(valor)}
            
            if (isNaN(valor)) {
                // Si no se puede parsear como fracción o número decimal, mostrar una alerta de error
                alert('Error: Valor inválido en la matriz adicional');
            } else {

                datosMatrizAdicional.push(valor);
            }
        });

        const columnas = parseInt(columnasInput.value);
        let matrizoriginal;

        matrizoriginal = datosUnidimensionalesAMatriz(datosMatrizAdicional, columnas)
        // Puedes hacer algo con los datos, como mostrarlos en la consola
        console.log(matrizoriginal);

        //primera suma por columnas 
        const sumasPorColumna = calcularSumasPorColumna(matrizoriginal);

        console.log(sumasPorColumna);

        // Calcula la matriz normalizada
        const matrizNormalizada = calcularMatrizNormalizada(matrizoriginal,sumasPorColumna);

        console.log(matrizNormalizada);
        
        logAndDisplayToDiv("Representatividad de cada criterio:",'resolucion-matriz-container')
        mostrarMatrizNormalizadaEnTabla(matrizNormalizada, 'resolucion-matriz-container');
        
        // Calcula las sumas por columna
        const sumasPorColumnaMatrizNormalizada = calcularSumasPorColumna(matrizNormalizada);

        // Calcula las sumas por fila
        const sumasPorFilaMatrizNormalizada = calcularSumasPorFila(matrizNormalizada);

        console.log("Sumas por columna:", sumasPorColumnaMatrizNormalizada);
        console.log("Sumas por fila:", sumasPorFilaMatrizNormalizada);
        //logAndDisplayToDiv(sumasPorColumnaMatrizNormalizada, 'resolucion-matriz-container')
        //logAndDisplayToDiv(sumasPorFilaMatrizNormalizada, 'resolucion-matriz-container')

        let suma = sumasPorFilaMatrizNormalizada.reduce((total, valor) => total + valor, 0);
        suma = redondear(suma);
        console.log("Suma total:", suma);
        //logAndDisplayToDiv(suma, 'resolucion-matriz-container')

        let ponderacion = calcularPonderacion(sumasPorFilaMatrizNormalizada, suma);
        console.log("Ponderación:", ponderacion);
        logAndDisplayToDiv("PROMEDIO : "+ponderacion, 'resolucion-matriz-container')

        ponderacionEstandar = ponderacion;
        //PASAMOS CON LAS VERIFICACIONES ... 

        //crear la matriz A que va a ser la multiplicacion de la matriz matrizNormalizada * ponderado
            // Supongamos que tienes una matriz normalizada (matrizNormalizada) y un arreglo ponderado (ponderacion)
            let matrizResultado = multiplicarMatrizPorArreglo(matrizNormalizada, ponderacion);

            console.log("A :",matrizResultado);
            logAndDisplayToDiv("A :", 'resolucion-matriz-container')
            logAndDisplayToDiv(matrizResultado, 'resolucion-matriz-container')

            // Supongamos que tienes dos arreglos, ponderacion y matrizResultado
            let resultadoDivision = dividirArreglos(matrizResultado,ponderacion );

            console.log("A/ponderacion: ",resultadoDivision);
            logAndDisplayToDiv("A/PROMEDIO: ", 'resolucion-matriz-container')
            logAndDisplayToDiv( resultadoDivision, 'resolucion-matriz-container')
           // ...

            let promedio = calcularPromedio(resultadoDivision);
            promedio = redondear(promedio);
            console.log("El promedio del arreglo es:", promedio);
            logAndDisplayToDiv("El promedio del arreglo es: "+promedio, 'resolucion-matriz-container')

            // IC
            let inc = (promedio - columnas) / (columnas - 1);
            inc = redondear(inc);
            console.log('IC : ', inc);
            logAndDisplayToDiv('IC : '+inc, 'resolucion-matriz-container')
            // ICA
            let ina = ((1.98 * (columnas - 2)) / columnas);
            ina = redondear(ina);
            console.log('IA : ', ina);
            logAndDisplayToDiv('IA : '+ina, 'resolucion-matriz-container')
            // RC
            let rnc = (inc / ina);
            rnc = redondear(rnc);
            console.log('RC: ', rnc);
            logAndDisplayToDiv('RC: '+rnc, 'resolucion-matriz-container')
    });
}

const mostrarAlternativasButton = document.getElementById('alternativas');
const guardarAlternativasButton = document.getElementById('guardarAlternativas');
const resolverAlternativasButton = document.getElementById('resolverAlternativas');

let ponderacionEstandar = [];

let datosTablas = []; // Aquí almacenaremos los datos de cada tabla

//BOTON PARA CREAR
if (mostrarAlternativasButton) {
    mostrarAlternativasButton.addEventListener('click', function () {
        const columnas = parseInt(columnasInput.value);
        const contenedorPrincipal = document.getElementById('contenedor-dinamico'); // Contenedor principal

        // Elimina los contenedores previamente creados, si los hay
        while (contenedorPrincipal.firstChild) {
            contenedorPrincipal.removeChild(contenedorPrincipal.firstChild);
        }

        for (let i = 0; i < columnas; i++) {
            if (!isNaN(columnas)) {
                const divDinamico = document.createElement('div');
                const divId = `matriz-container-demasopciones${i}`;
                divDinamico.id = divId;

                // Agregar un margen a cada contenedor
                divDinamico.classList.add('m-4'); // Puedes ajustar el valor '4' según el espacio que desees

                const encabezado = document.createElement('h3');
                encabezado.textContent = "Alternativa " + (i + 1);
                encabezado.classList.add('text-lg', 'font-bold', 'mb-2'); // Añade estilos al encabezado

                contenedorPrincipal.appendChild(encabezado); // Agrega el encabezado
                contenedorPrincipal.appendChild(divDinamico);

                // Llama a crearMatrizNxN dentro del bucle para crear matrices diferentes en cada contenedor
                crearMatrizNxN(columnas, divId);

                // Crea un nuevo arreglo de datosTabla para cada tabla
                let datosTabla = [];

                // Evento para guardar los datos después de haber creado las tablas
                if (guardarAlternativasButton) {
                    guardarAlternativasButton.addEventListener('click', function () {
                        // Limpia el arreglo de datosTabla antes de agregar nuevos datos
                        datosTabla = [];

                        const tabla = document.getElementById(divId);
                        const inputs = tabla.querySelectorAll('input');

                        inputs.forEach(input => {
                            datosTabla.push(input.value);
                        });

                        datosTablas.push(datosTabla);
                    });
                }
            }
        }

        // Ahora, datosTablas contiene los datos de todas las tablas creadas dinámicamente.
    });
}


function logAndDisplayToDiv(data, containerId) {
    if (Array.isArray(data)) {
        // Si es un array, conviértelo en una cadena y muestra cada elemento en una nueva línea
        data = data.map(item => JSON.stringify(item)).join('\n');
    }

    // Mostrar los datos en la consola
    console.log(data);

    return new Promise((resolve) => {
        // Mostrar los datos en el div especificado
        const container = document.getElementById(containerId);
        if (container) {
            const mensajeDiv = document.createElement('div');
            mensajeDiv.textContent = data;
            container.appendChild(mensajeDiv);
        }

        // Resolver la promesa después de un breve retraso
        setTimeout(() => {
            resolve();
        }, 0);
    });
}


function otrodiv(message, divId) {
    console.log(message); // Muestra el mensaje en la consola

    // Obtén el elemento div por su id
    let div = document.getElementById(divId);

    // Crea un nuevo elemento de párrafo para el mensaje
    let p = document.createElement('p');
    p.textContent = message;

    // Agrega el párrafo al div
    div.appendChild(p);
}

//BOTON PARA RESOLVER LAS ANTERNATIVAS
if (resolverAlternativasButton) {
    resolverAlternativasButton.addEventListener('click', function () {
        console.log("sour resolver : ")
        let columnas = parseInt(columnasInput.value);
        console.log(datosTablas);
        let datosMatrizAdicional = [];
        let datosMatrizalternativa = [];

        let matrizfinal = [];

        for (let i = 0; i < columnas; i++) {
            datosTablas[i].forEach(valor => {
                // Utiliza la función parseFraction para convertir fracciones
                if (valor.includes("/")) {
                    valor = parseFraction(valor);
                } else {
                    // Si no es una fracción, intenta parsearlo como número decimal
                    valor = parseFloat(valor);
                }

                if (isNaN(valor)) {
                    // Si no se puede parsear como fracción o número decimal, muestra una alerta de error
                    alert('Error: Valor inválido en la matriz adicional');
                } else {
                    datosMatrizAdicional.push(valor);
                }
            });
            
            datosMatrizalternativa.push(datosMatrizAdicional);
            datosMatrizAdicional = []; // Reiniciar el arreglo para la próxima iteración
        }

        console.log(datosMatrizalternativa);
        datosTablas = datosMatrizalternativa;
        
        for (let i = 0; i < columnas; i++) {
            datosTablas[i] = datosUnidimensionalesAMatriz(datosTablas[i],columnas);
        }



        console.log(datosTablas);
        //mostrarMatrizNormalizadaEnTabla(datosTablas, 'resolucionDeAlternativas');
        //logAndDisplayToDiv(datosTablas, 'resolucionDeAlternativas')



        for (let i = 0; i < columnas; i++) {
            
            console.log('ITERACION : ',i);
            //logAndDisplayToDiv('SOLUCION DE LA ALTERNATIVA '+(i+1), 'resolucionDeAlternativas');
           
                                                    
            //primera suma por columnas 
            let sumasPorColumna = calcularSumasPorColumna(datosTablas[i]);
            //DEBEMOS MOSTRAR
            console.log(sumasPorColumna);
            //logAndDisplayToDiv(sumasPorColumna, 'resolucionDeAlternativas');

            // Calcula la matriz normalizada
            //MATRIZ QUE DEBEMOS MOSTRAR
            let matrizNormalizada = calcularMatrizNormalizada(datosTablas[i],sumasPorColumna);
            //mostrarMatrizNormalizadaEnTabla(matrizNormalizada, 'resolucionDeAlternativas');
            
            // Calcula las sumas por fila
            let sumasPorFilaMatrizNormalizada = calcularSumasPorFila(matrizNormalizada);

            //console.log("Sumas por fila:", sumasPorFilaMatrizNormalizada);

            let suma = sumasPorFilaMatrizNormalizada.reduce((total, valor) => total + valor, 0);
            suma = redondear(suma);
            //console.log("Suma total:", suma);

            let ponderacion = calcularPonderacion(sumasPorFilaMatrizNormalizada, suma);
            console.log("PROMEDIO:", ponderacion);
           // logAndDisplayToDiv("Ponderación:", 'resolucionDeAlternativas')
            //logAndDisplayToDiv(ponderacion, 'resolucionDeAlternativas')

            matrizfinal.push(ponderacion);
        }

      
        console.log(matrizfinal);
  
        let matrizVolteada = voltearMatriz(matrizfinal);  

        console.log(matrizVolteada);
      
        //DE ACA PARA ADELANTE TODO SE IMPRIME
        
        
        for (let i = 0; i < columnas; i++) {
            console.log('ITERACION : ', i);

            // Crear un div dinámico para esta iteración
            const iteracionDiv = document.createElement('div');
            iteracionDiv.innerText = 'SOLUCION DE LA ALTERNATIVA ' + (i + 1);
            iteracionDiv.id = 'iteracionDiv' + i; // Asigna un ID único a cada div
            document.getElementById('resolucionDeAlternativas1').appendChild(iteracionDiv);

            // Primera suma por columnas
            let sumasPorColumna = calcularSumasPorColumna(datosTablas[i]);
            // DEBEMOS MOSTRAR
            console.log(sumasPorColumna);

            // Crear un div para mostrar los resultados de suma por columnas
            const sumasPorColumnaDiv = document.createElement('div');
            //sumasPorColumnaDiv.innerText = JSON.stringify(sumasPorColumna);
            document.getElementById('resolucionDeAlternativas1').appendChild(sumasPorColumnaDiv);

            // Calcula la matriz normalizada
            let matrizNormalizada = calcularMatrizNormalizada(datosTablas[i], sumasPorColumna);
            mostrarMatrizNormalizadaEnTabla(matrizNormalizada, 'iteracionDiv' + i);

            // Calcula las sumas por fila
            let sumasPorFilaMatrizNormalizada = calcularSumasPorFila(matrizNormalizada);

            let suma = sumasPorFilaMatrizNormalizada.reduce((total, valor) => total + valor, 0);
            suma = redondear(suma);

            let ponderacion = calcularPonderacion(sumasPorFilaMatrizNormalizada, suma);
            console.log("PROMEDIO:", ponderacion);

            // Crear un div para mostrar los resultados de ponderación
            const ponderacionDiv = document.createElement('div');
            ponderacionDiv.innerText = 'PROMEDIO : ' + ponderacion;
            document.getElementById('resolucionDeAlternativas1').appendChild(ponderacionDiv);

        }
        
        

        mostrarMatrizNormalizadaEnTabla(matrizVolteada, 'resolucionDeAlternativas2');

        let arreglofinal = [];
       
        logAndDisplayToDiv('Vector propio de criterios', 'resolucionDeAlternativas')
        logAndDisplayToDiv(ponderacionEstandar, 'resolucionDeAlternativas')

        arreglofinal = multiplicarMatrizPorArreglo(matrizVolteada,ponderacionEstandar);

        console.log(arreglofinal);
        logAndDisplayToDiv('Resultado de la multiplicacion', 'resolucionDeAlternativas')
        logAndDisplayToDiv(arreglofinal, 'resolucionDeAlternativas')

        const maximo = Math.max(...arreglofinal);

        logAndDisplayToDiv('La mejor opcion : '+ maximo , 'resolucionDeAlternativas')

        console.log(`El valor máximo en el arreglo es: ${maximo*100} %`);

        logAndDisplayToDiv(`con ${maximo*100} % de importancia`, 'resolucionDeAlternativas')

    });
}


function mostrarMatrizNormalizadaEnTabla(matrizNormalizada, containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Elemento con ID ${containerId} no encontrado.`);
        return;
    }

    const tabla = document.createElement('table');
    tabla.classList.add('border-separate', 'border', 'border-gray-500', 'bg-white'); // Cambia el color de fondo y los bordes
    const tbody = document.createElement('tbody');

    matrizNormalizada.forEach(fila => {
        const filaTabla = document.createElement('tr');
        fila.forEach(valor => {
            const celda = document.createElement('td');
            celda.classList.add('border', 'border-gray-700', 'p-2', 'bg-white'); // Cambia el color de fondo y los bordes
            celda.textContent = valor;
            filaTabla.appendChild(celda);
        });
        tbody.appendChild(filaTabla);
    });

    tabla.appendChild(tbody);

    // Agrega estilos adicionales a la tabla, como espaciado de celdas y borde colapsado
    tabla.style.borderCollapse = 'collapse';
    tabla.style.margin = '10px'; // Espaciado exterior

    container.innerHTML = '';
    container.appendChild(tabla);
}

function voltearMatriz(matriz) {
    const filas = matriz.length;
    const columnas = matriz[0].length;

    // Crear una nueva matriz con filas y columnas intercambiadas
    const matrizVolteada = [];

    for (let i = 0; i < columnas; i++) {
        matrizVolteada.push([]);
        for (let j = 0; j < filas; j++) {
            matrizVolteada[i].push(matriz[j][i]);
        }
    }

    return matrizVolteada;
}

function parseFraction(valor) {
    const partes = valor.split("/");

    if (partes.length === 2) {
        const numerador = parseFloat(partes[0]);
        const denominador = parseFloat(partes[1]);

        if (!isNaN(numerador) && !isNaN(denominador) && denominador !== 0) {
            // Es una fracción válida, realizar la división
            resultado = numerador / denominador;
            return parseFloat(resultado.toFixed(3));
        }
    }

    // No es una fracción válida, devolver el valor original
    return parseFloat(valor);
}

function calcularSumasPorColumna(matriz) {
    const numFilas = matriz.length;
    const numColumnas = matriz[0].length;
    let sumasPorColumna = [];

    for (let col = 0; col < numColumnas; col++) {
        let sumaColumna = 0;
        for (let fila = 0; fila < numFilas; fila++) {
            sumaColumna += matriz[fila][col];
        }
        sumasPorColumna.push(sumaColumna);
    }

    return sumasPorColumna;
}

function calcularSumasPorFila(matriz) {
    const sumasPorFila = [];

    for (let i = 0; i < matriz.length; i++) {
        const fila = matriz[i];
        let sumaFila = fila.reduce((acc, valor) => acc + valor, 0);
        sumaFila = redondear(sumaFila);
        sumasPorFila.push(sumaFila);
    }

    return sumasPorFila;
}

function datosUnidimensionalesAMatriz(datosUnidimensionales, n) {
    let matrizBidimensional = [];
    for (let i = 0; i < n; i++) {
        let fila = [];
        for (let j = 0; j < n; j++) {
            fila.push(datosUnidimensionales[i * n + j]);
        }
        matrizBidimensional.push(fila);
    }
    return matrizBidimensional;
}

function calcularMatrizNormalizada(matriz, sumasPorColumna) {
    const numFilas = matriz.length;
    const numColumnas = matriz[0].length;
    const matrizNormalizada = [];

    for (let i = 0; i < numFilas; i++) {
        const filaNormalizada = [];
        for (let j = 0; j < numColumnas; j++) {
            // Redondea el valor a dos decimales
            const valorNormalizado = (matriz[i][j] / sumasPorColumna[j]).toFixed(3);
            filaNormalizada.push(parseFloat(valorNormalizado)); // Convierte nuevamente a número
        }
        matrizNormalizada.push(filaNormalizada);
    }

    return matrizNormalizada;
}

function calcularPonderacion(sumasPorFila, sumaTotal) {
    const ponderacion = sumasPorFila.map(valor => valor / sumaTotal);
    
    // Redondea cada valor de ponderación a la cantidad de decimales que desees, en este caso, 2
    const ponderacionRedondeada = ponderacion.map(valor => redondear(valor));
    
    return ponderacionRedondeada;
}

function multiplicarMatrizPorArreglo(matriz, arreglo) {
    const resultado = [];

    for (let i = 0; i < matriz.length; i++) {
        let filaResultado = 0;

        for (let j = 0; j < matriz[i].length; j++) {
            filaResultado += matriz[i][j] * arreglo[j];
        }

        // Redondea el resultado de la fila a dos decimales
        filaResultado = redondear(filaResultado);

        resultado.push(filaResultado);
    }

    return resultado;
}

function dividirArreglos(arreglo1, arreglo2) {
    if (arreglo1.length !== arreglo2.length) {
        throw new Error("Los arreglos tienen longitudes diferentes y no se pueden dividir elemento por elemento.");
    }

    const resultado = [];

    for (let i = 0; i < arreglo1.length; i++) {
        if (arreglo2[i] === 0) {
            throw new Error("No se puede dividir por cero.");
        }
        // Redondea el resultado de la división a dos decimales
        const division = arreglo1[i] / arreglo2[i];
        resultado.push(redondear(division));
    }

    return resultado;
}

function calcularPromedio(arreglo) {
    if (arreglo.length === 0) {
        return 0; // Manejo especial si el arreglo está vacío para evitar divisiones por cero
    }

    const suma = arreglo.reduce((acumulador, valor) => acumulador + valor, 0);
    const promedio = suma / arreglo.length;

    return promedio;
}

function redondear(numero) {
    return Math.round(numero * 1000) / 1000;
}