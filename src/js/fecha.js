/**
 * Próxima fecha de servicio.
 *
 * Calcula, en hora de Caracas, el próximo día de servicio según
 * config.js y lo pinta en todo elemento con data-proxima-fecha.
 * La hora del visitante no importa: manda la del negocio.
 *
 * Uso en el marcado:
 *   <time data-proxima-fecha>Domingo</time>   → el texto es el respaldo sin JS
 */

import { servicio } from '../config.js';

const MS_POR_DIA = 86_400_000;

/**
 * Fecha y hora civiles en la zona del negocio, independientes del
 * reloj del visitante. hourCycle h23 evita el "24:00" de algunos motores.
 */
function partesEnZona(ahora, zonaHoraria) {
    const partes = new Intl.DateTimeFormat('en-US', {
        timeZone: zonaHoraria,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23',
    }).formatToParts(ahora);

    const valor = (tipo) => Number(partes.find((p) => p.type === tipo).value);

    return {
        anio: valor('year'),
        mes: valor('month'),
        dia: valor('day'),
        minutos: valor('hour') * 60 + valor('minute'),
    };
}

/**
 * 'HH:MM' → minutos desde medianoche. null o formato inválido → null.
 * Un valor inválido se avisa en consola pero no rompe la página.
 */
function minutosDeCierre(horaCierre) {
    if (horaCierre === null) {
        return null;
    }

    const coincide = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(horaCierre);

    if (!coincide) {
        console.warn(`horaCierre inválida en config.js: "${horaCierre}". Se ignora.`);
        return null;
    }

    return Number(coincide[1]) * 60 + Number(coincide[2]);
}

/**
 * "domingo 11 de octubre" (sin la coma que agrega Intl en español).
 * La fecha llega como medianoche UTC, por eso se formatea en UTC.
 */
function diaLargo(fecha) {
    const partes = new Intl.DateTimeFormat('es-VE', {
        timeZone: 'UTC',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }).formatToParts(fecha);

    const valor = (tipo) => partes.find((p) => p.type === tipo).value;

    return `${valor('weekday')} ${valor('day')} de ${valor('month')}`;
}

const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

/**
 * Devuelve { texto, iso, esHoy } del próximo día de servicio,
 * o null si config.js no tiene días configurados.
 *
 * Función pura: recibe "ahora" y la configuración por parámetro,
 * así se prueba con fechas fijas sin tocar el reloj.
 */
export function proximaFecha(ahora = new Date(), config = servicio) {
    const { anio, mes, dia, minutos } = partesEnZona(ahora, config.zonaHoraria);
    const cierre = minutosDeCierre(config.horaCierre);
    const hoyCerrado = cierre !== null && minutos >= cierre;

    // Fechas civiles como medianoche UTC: sumar días no depende de
    // horarios de verano ni de la zona del visitante.
    const hoy = Date.UTC(anio, mes - 1, dia);

    // 0..7 inclusive: si hoy es el único día de servicio y ya cerró,
    // el próximo es el mismo día de la semana siguiente.
    for (let desfase = 0; desfase <= 7; desfase++) {
        const fecha = new Date(hoy + desfase * MS_POR_DIA);

        if (!config.dias.includes(fecha.getUTCDay())) {
            continue;
        }

        if (desfase === 0 && hoyCerrado) {
            continue;
        }

        const iso = fecha.toISOString().slice(0, 10);

        if (desfase === 0) {
            return { texto: 'Hoy', iso, esHoy: true };
        }

        if (desfase === 1) {
            return { texto: `Mañana, ${diaLargo(fecha)}`, iso, esHoy: false };
        }

        return { texto: capitalizar(diaLargo(fecha)), iso, esHoy: false };
    }

    return null;
}

/**
 * Pinta la próxima fecha en cada [data-proxima-fecha] dentro de raiz.
 * En un <time> también fija el atributo datetime (YYYY-MM-DD).
 * Sin días configurados, deja intacto el texto de respaldo del HTML.
 */
export function pintarProximaFecha(raiz = document) {
    const resultado = proximaFecha();

    if (resultado === null) {
        return;
    }

    raiz.querySelectorAll('[data-proxima-fecha]').forEach((elemento) => {
        elemento.textContent = resultado.texto;

        if (elemento instanceof HTMLTimeElement) {
            elemento.dateTime = resultado.iso;
        }
    });
}
