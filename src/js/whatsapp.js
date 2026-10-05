/**
 * Enlaces de pedido por WhatsApp.
 *
 * Construye las URL wa.me a partir de config.js y las aplica a todo
 * elemento con el atributo data-whatsapp. El HTML solo marca dónde
 * va un enlace; el número y el mensaje viven en un único lugar.
 *
 * Uso en el marcado:
 *   <a data-whatsapp>Pedir</a>                    → mensaje por defecto
 *   <a data-whatsapp="¿Hay sopa hoy?">Pedir</a>   → mensaje propio
 */

import { whatsapp } from '../config.js';

const BASE_URL = 'https://wa.me/';

/**
 * Devuelve la URL wa.me con el mensaje pre-cargado.
 *
 * encodeURIComponent y no URLSearchParams: este último codifica los
 * espacios como "+", y no todos los clientes de WhatsApp lo traducen
 * de vuelta a espacio. %20 es inequívoco.
 */
export function enlaceWhatsApp(mensaje = whatsapp.mensaje) {
    return `${BASE_URL}${whatsapp.numero}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Aplica href, target y rel a cada [data-whatsapp] dentro de raiz.
 * Un atributo vacío usa el mensaje por defecto de config.js.
 */
export function enlazarWhatsApp(raiz = document) {
    raiz.querySelectorAll('[data-whatsapp]').forEach((enlace) => {
        enlace.href = enlaceWhatsApp(enlace.dataset.whatsapp || undefined);
        enlace.target = '_blank';
        enlace.rel = 'noopener noreferrer';
    });
}
