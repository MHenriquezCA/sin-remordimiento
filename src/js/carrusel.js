/**
 * Carrusel de la portada.
 *
 * Genera los slides desde config.js dentro de cada [data-carrusel].
 * El arrastre lo hace el navegador con scroll-snap (CSS nativo);
 * el JS solo sincroniza puntos, flechas y avance automático.
 *
 * Uso en el marcado (el contenedor define nombre y rol):
 *   <section aria-roledescription="carousel" aria-label="Nuestras sopas">
 *       <div data-carrusel></div>
 *   </section>
 *
 * Slides admitidos en config.js:
 *   { tipo: 'foto', src: 'carrusel/sopa.jpg', alt, titulo }   → imagen en public/
 *   { tipo: 'placeholder', titulo, texto }                     → caja carbón
 *   { tipo: 'anuncio', titulo, texto }                         → caja roja
 */

import { carrusel } from '../config.js';

const INTERVALO_MS = 6000;

/**
 * createElement con clases y texto. textContent, nunca innerHTML:
 * el contenido de config.js no se interpreta como HTML.
 */
function crear(etiqueta, clases = '', texto = '') {
    const elemento = document.createElement(etiqueta);

    if (clases) {
        elemento.className = clases;
    }

    if (texto) {
        elemento.textContent = texto;
    }

    return elemento;
}

/**
 * Contenido visual de un slide según su tipo.
 * Clases completas y literales: Tailwind solo genera lo que lee
 * tal cual en el código fuente, no clases armadas por concatenación.
 */
function contenidoSlide(slide) {
    if (slide.tipo === 'foto') {
        const figura = crear('figure', 'relative aspect-4/3 overflow-hidden');
        const imagen = crear('img', 'size-full object-cover');

        // BASE_URL = '/sin-remordimiento/' en Pages, '/' con dominio propio.
        imagen.src = `${import.meta.env.BASE_URL}${slide.src}`;
        imagen.alt = slide.alt ?? slide.titulo ?? '';
        imagen.loading = 'lazy';
        imagen.decoding = 'async';
        figura.append(imagen);

        if (slide.titulo) {
            figura.append(crear(
                'figcaption',
                'absolute inset-x-0 bottom-0 bg-carbon/75 px-4 py-2 font-titulo font-semibold text-nube',
                slide.titulo,
            ));
        }

        return figura;
    }

    const esAnuncio = slide.tipo === 'anuncio';

    const caja = crear(
        'div',
        esAnuncio
            ? 'flex aspect-4/3 flex-col items-center justify-center gap-2 bg-rojo p-6 text-center'
            : 'flex aspect-4/3 flex-col items-center justify-center gap-2 bg-carbon p-6 text-center',
    );

    caja.append(crear(
        'p',
        esAnuncio
            ? 'font-titulo text-xl font-bold text-oro-claro md:text-2xl'
            : 'font-titulo text-xl font-bold text-nube md:text-2xl',
        slide.titulo,
    ));

    caja.append(crear(
        'p',
        esAnuncio ? 'italic text-nube' : 'italic text-oro-claro',
        slide.texto,
    ));

    return caja;
}

function crearFlecha(direccion) {
    const anterior = direccion === 'anterior';

    const boton = crear(
        'button',
        anterior
            ? 'absolute top-1/2 left-2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-carbon/70 font-titulo text-2xl text-oro-claro hover:bg-carbon focus-visible:outline-2 focus-visible:outline-oro'
            : 'absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-carbon/70 font-titulo text-2xl text-oro-claro hover:bg-carbon focus-visible:outline-2 focus-visible:outline-oro',
        anterior ? '‹' : '›',
    );

    boton.type = 'button';
    boton.setAttribute('aria-label', anterior ? 'Slide anterior' : 'Slide siguiente');

    return boton;
}

function montar(contenedor) {
    const total = carrusel.length;

    if (total === 0) {
        return;
    }

    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Pista: scroll horizontal con snap, barra de scroll oculta.
    const pista = crear(
        'div',
        'flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    );

    const slides = carrusel.map((slide, indice) => {
        const elemento = crear('div', 'w-full shrink-0 snap-center');

        elemento.setAttribute('role', 'group');
        elemento.setAttribute('aria-roledescription', 'slide');
        elemento.setAttribute('aria-label', `${indice + 1} de ${total}`);
        elemento.append(contenidoSlide(slide));
        pista.append(elemento);

        return elemento;
    });

    // Marco: referencia de posición de las flechas. Solo abarca el
    // slide; la barra de puntos queda fuera y no desplaza el centro.
    const marco = crear('div', 'relative');

    marco.append(pista);
    contenedor.replaceChildren(marco);

    // Un solo slide: sin controles ni movimiento.
    if (total === 1) {
        return;
    }

    let actual = 0;
    let temporizador = null;
    let detenido = reducirMovimiento;   // apagado por el sistema o por el usuario
    let enPausa = false;                // hover o foco dentro del carrusel

    // Con autoplay, anunciar cada cambio sería ruido para el lector
    // de pantalla; cuando el usuario controla, sí se anuncia.
    pista.setAttribute('aria-live', detenido ? 'polite' : 'off');

    const irA = (indice) => {
        const destino = (indice + total) % total;

        pista.scrollTo({
            left: destino * pista.clientWidth,
            behavior: reducirMovimiento ? 'auto' : 'smooth',
        });
    };

    // Controles
    const flechaAnterior = crearFlecha('anterior');
    const flechaSiguiente = crearFlecha('siguiente');
    const barra = crear('div', 'mt-3 flex items-center justify-center gap-1');

    const puntos = slides.map((_, indice) => {
        // Botón de 32 px con punto de 12 px: área táctil usable en móvil.
        const punto = crear('button', 'group grid size-8 place-items-center');

        punto.type = 'button';
        punto.setAttribute('aria-label', `Ir al slide ${indice + 1}`);
        punto.append(crear(
            'span',
            'size-3 rounded-full bg-carbon/30 transition-colors group-aria-[current=true]:bg-rojo',
        ));
        barra.append(punto);

        return punto;
    });

    const botonPausa = crear(
        'button',
        'ml-2 font-titulo text-sm font-semibold text-carbon underline-offset-4 hover:underline',
    );
    botonPausa.type = 'button';

    if (!reducirMovimiento) {
        barra.append(botonPausa);
    }

    marco.append(flechaAnterior, flechaSiguiente);
    contenedor.append(barra);

    // Estado visual
    const marcar = () => {
        puntos.forEach((punto, indice) => {
            punto.setAttribute('aria-current', indice === actual ? 'true' : 'false');
        });
    };

    const actualizarBotonPausa = () => {
        botonPausa.textContent = detenido ? 'Reanudar' : 'Pausar';
    };

    // El índice actual sale del scroll real, no de un contador:
    // así el swipe, las flechas y el autoplay nunca se desincronizan.
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                actual = slides.indexOf(entrada.target);
                marcar();
            }
        });
    }, { root: pista, threshold: 0.6 });

    slides.forEach((slide) => observador.observe(slide));

    // Avance automático
    const detenerAuto = () => {
        clearInterval(temporizador);
        temporizador = null;
    };

    const arrancarAuto = () => {
        if (detenido || enPausa || document.hidden || temporizador !== null) {
            return;
        }

        temporizador = setInterval(() => irA(actual + 1), INTERVALO_MS);
    };

    // Cualquier navegación manual apaga el autoplay: el usuario tomó el control.
    const tomarControl = () => {
        detenido = true;
        detenerAuto();
        pista.setAttribute('aria-live', 'polite');
        actualizarBotonPausa();
    };

    flechaAnterior.addEventListener('click', () => {
        tomarControl();
        irA(actual - 1);
    });

    flechaSiguiente.addEventListener('click', () => {
        tomarControl();
        irA(actual + 1);
    });

    puntos.forEach((punto, indice) => {
        punto.addEventListener('click', () => {
            tomarControl();
            irA(indice);
        });
    });

    // pointerdown cubre el swipe táctil y el arrastre con mouse.
    pista.addEventListener('pointerdown', tomarControl);

    botonPausa.addEventListener('click', () => {
        if (detenido) {
            detenido = false;
            pista.setAttribute('aria-live', 'off');
            actualizarBotonPausa();
            arrancarAuto();
        } else {
            tomarControl();
        }
    });

    // Pausas temporales: hover y foco de teclado.
    contenedor.addEventListener('mouseenter', () => {
        enPausa = true;
        detenerAuto();
    });

    contenedor.addEventListener('mouseleave', () => {
        enPausa = false;
        arrancarAuto();
    });

    contenedor.addEventListener('focusin', () => {
        enPausa = true;
        detenerAuto();
    });

    contenedor.addEventListener('focusout', (evento) => {
        if (!contenedor.contains(evento.relatedTarget)) {
            enPausa = false;
            arrancarAuto();
        }
    });

    // Pestaña oculta: no gastar batería en segundo plano.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            detenerAuto();
        } else {
            arrancarAuto();
        }
    });

    marcar();
    actualizarBotonPausa();
    arrancarAuto();
}

/**
 * Monta un carrusel en cada [data-carrusel] dentro de raiz.
 */
export function iniciarCarrusel(raiz = document) {
    raiz.querySelectorAll('[data-carrusel]').forEach(montar);
}
