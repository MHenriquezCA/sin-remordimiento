### Instalación de Laravel Livewire Starter Kit sin laravel new 

> Los comandos de instalación global de laravel trabajan contra repos publicados
> packagist así que se puede trabajar contra ellos sin ningún problema

```bash
laravel new <nombre-proyecto>
=
composer create-project laravel/livewire-starter-kit <nombre-proyecto>
```

---

#### Pasos para hacerlo en WSL2
```bash
# 1. Crear el proyecto con el starter kit, usando PHP 8.3 en contenedor
docker run --rm -u $(id -u):$(id -g) -v $(pwd):/app -w /app \
  laravelsail/php83-composer:latest \
  composer create-project laravel/livewire-starter-kit nombre-proyecto

# 2. Instalar Sail con MariaDB (paridad con producción)
cd nombre-proyecto
docker run --rm -u $(id -u):$(id -g) -v $(pwd):/app -w /app \
  laravelsail/php83-composer:latest \
  php artisan sail:install --with=mariadb

# 3. Levantar con Sail
sail up -d
```

| Criterio | 🪟 Laragon + laravel new → mover a WSL2 | 🐳 Contenedor efímero en WSL2 |
|:---|:---|:---|
| 📍 Dónde nace |	En C:\, luego hay que mudarlo a ~/ | Directo en ~/proyectos/ |
| 🐘 PHP con el que resuelve | El de Laragon. Puede no ser 8.3 | PHP 8.3 exacto, igual que producción |
| 📦 vendor/ y node_modules/ | Compilados en Windows. Hay que borrarlos y reinstalar | Nacen en Linux |
| ↩️ CRLF | Riesgo real (BUG #20) | No existe |
| 🧹 Zero Contamination | Mezcla los dos entornos | Contenedor con --rm: no deja rastro |
| 🔧 Pasos | Crear, copiar, limpiar, reinstalar, instalar Sail | Crear, instalar Sail, levantar |


**Por qué cada pieza:**

> laravelsail/php83-composer es la imagen que la documentación de Laravel usa para este caso. Trae PHP 8.3 y Composer. Es la única excepción aceptable a la regla de "nunca :latest": esa imagen solo publica ese tag y la usas una vez para crear el proyecto. Después Sail construye su propia imagen fija.

```bash
-u $(id -u):$(id -g) evita que los archivos queden como propiedad de root (BUG #16).

Después del paso 1, agregas "platform": { "php": "8.3.30" } en composer.json y APP_PORT=8000 y FORWARD_DB_PORT=33060 en el .env, como dice el 01.
```

> Un detalle para verificar cuando llegue ese día: el instalador interactivo de laravel new hace preguntas (Pest, Volt, etc.) que create-project no hace. Se revisa en el README del kit en ese momento, no ahora. Hoy no se toca.