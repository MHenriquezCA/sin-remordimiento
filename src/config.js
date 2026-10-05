/**
 * Configuración central del sitio — fuente única de datos.
 *
 * Todo lo que cambia sin tocar la lógica vive aquí: contacto,
 * precios, menú, días de servicio y redes. Cuando llegue el panel
 * admin (Laravel Fase I), estos datos salen de este archivo y pasan
 * a la base de datos; la lógica que los consume no cambia.
 */

export const negocio = {
    nombre: 'Sin Remordimiento',
    subtitulo: 'Sazón Celestial',
    direccion: 'Diagonal al portón negro de Villa Sur',
    creditos: {
        texto: 'Created by mhenriquez.com',
        url: 'https://mhenriquez.com',
    },
};

export const whatsapp = {
    // Formato internacional sin "+" ni espacios: lo exige wa.me.
    numero: '584123854299',
    mensaje: 'Hola, quiero hacer un pedido de sopa.',
};

export const precios = {
    moneda: 'USD',
    comerAqui: 3.5,
    paraLlevar: 4,
};

export const servicio = {
    zonaHoraria: 'America/Caracas',
    // Días según Date.getDay(): 0 = domingo, 6 = sábado.
    // PENDIENTE: confirmar si también se atiende sábado → [6, 0].
    dias: [0],
    // Hora de cierre en formato 'HH:MM' (24 h, hora de Caracas).
    // Pasada esa hora, el sitio anuncia el próximo día de servicio.
    // PENDIENTE: dato real. null = "Hoy" durante todo el día.
    horaCierre: null,
};

export const menu = [
    {
        nombre: 'Sopa de costilla',
        descripcion: 'Caldo casero de costilla, hecho con calma y sin atajos.',
    },
];

export const carrusel = [
    // PENDIENTE: reemplazar por fotos reales de la sopa.
    {
        tipo: 'placeholder',
        titulo: 'Sopa de costilla',
        texto: 'Foto real próximamente.',
    },
    {
        tipo: 'anuncio',
        titulo: 'Próximamente: Sueños al Horno',
        texto: 'Tus sueños horneados en deliciosos postres.',
    },
];

// PENDIENTE: URLs reales. Las redes sin url no se renderizan.
export const redes = [
    { nombre: 'Instagram', url: null },
    { nombre: 'Facebook', url: null },
];
