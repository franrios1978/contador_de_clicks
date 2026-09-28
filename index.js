const miBoton = document.querySelector(".miBoton");
const casilla = document.querySelector(".casilla");
const contadorTiempo = document.querySelector(".contador_tiempo");
const record = document.querySelector(".record");
const listaRecords = document.querySelector(".lista_records");

const CLAVE_ALMACEN = "contador_clicks_records";

let contadorUnSoloClick = 0;
let recordClicks = 0;

const nombreJugador = prompt("¿Cómo te llamas?") || "Jugador";

let intervalo = null;
let tiempoInicial = 0;

function formatearTiempo(milisegundos) {
    const minutos = Math.floor(milisegundos / 60000);
    const segundos = Math.floor((milisegundos % 60000) / 1000);
    const decimas = Math.floor((milisegundos % 1000) / 100);

    const dosDigitos = (numero) => String(numero).padStart(2, "0");

    return `${dosDigitos(minutos)}:${dosDigitos(segundos)}.${decimas}`;
}

function iniciarCronometro() {
    if (intervalo !== null) return;

    tiempoInicial = performance.now();
    intervalo = setInterval(() => {
        contadorTiempo.textContent = formatearTiempo(performance.now() - tiempoInicial);
    }, 100);
}

function detenerCronometro() {
    if (intervalo === null) return;

    clearInterval(intervalo);
    intervalo = null;
}

function actualizarRecord(clicks) {
    if (clicks <= recordClicks) return;

    recordClicks = clicks;
    record.textContent = recordClicks;
}

function cargarRecords() {
    const datos = localStorage.getItem(CLAVE_ALMACEN);
    if (!datos) return [];

    try {
        const records = JSON.parse(datos);
        return Array.isArray(records) ? records : [];
    } catch {
        return [];
    }
}

function pintarRecords(records) {
    listaRecords.replaceChildren(
        ...records.map(({ nombre, clicks, tiempo }) => {
            const item = document.createElement("li");
            item.textContent = `${nombre} — ${clicks} clicks — ${tiempo}`;
            return item;
        })
    );
}

function guardarResultado() {
    const records = cargarRecords();
    records.push({
        nombre: nombreJugador,
        clicks: recordClicks,
        tiempo: contadorTiempo.textContent,
    });

    localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(records));
    pintarRecords(records);
}

function reiniciarJuego() {
    detenerCronometro();
    contadorUnSoloClick = 0;
    recordClicks = 0;
    record.textContent = "";
    contadorTiempo.textContent = "";
    casilla.textContent = "";
    miBoton.disabled = false;
}

miBoton.addEventListener("click", (ev) => {
    if (ev.detail === 1) {
        contadorUnSoloClick++;
    }

    actualizarRecord(ev.detail);

    if (contadorUnSoloClick === 1) {
        iniciarCronometro();
    }

    if (contadorUnSoloClick === 2) {
        detenerCronometro();
        casilla.textContent = "Se ha acabado el intento";
        miBoton.disabled = true;
        guardarResultado();
    } else {
        casilla.textContent = `Número de clicks: ${ev.detail}`;
    }
});

const reset = document.querySelector(".reset");
reset.addEventListener("click", () => {
    reiniciarJuego();
})

pintarRecords(cargarRecords());
