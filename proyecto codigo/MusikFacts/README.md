# MusikFacts - Servidor Local

## 🚀 Cómo iniciar el servidor

### Opción 1: Usando Python (Recomendado)
1. Abre una terminal en la carpeta `MusikFacts`
2. Ejecuta uno de estos comandos:
   - **Windows (PowerShell)**: `python server.py`
   - **Windows (CMD)**: `python server.py`
   - O simplemente haz doble clic en `iniciar-servidor.bat`

3. El servidor se iniciará en `http://localhost:8000`
4. Abre tu navegador en: **http://localhost:8000/MusikFacts/**
5. Tu navegador debería abrirse automáticamente

### Opción 2: Usando Node.js (si tienes Node instalado)
```bash
npx http-server -p 8000
```

### Opción 3: Usando PHP (si tienes PHP instalado)
```bash
php -S localhost:8000
```

## 📋 Requisitos
- Python 3.x (generalmente ya viene instalado en Windows)
- Navegador web moderno (Chrome, Firefox, Edge, etc.)

## 🛑 Detener el servidor
Presiona `Ctrl+C` en la terminal donde está corriendo el servidor.

## 📁 Estructura del proyecto
- `index.html` - Página principal
- `script.js` - Lógica de la aplicación
- `styles.css` - Estilos
- `server.py` - Servidor HTTP simple
- Carpetas con contenido multimedia (videos e imágenes)

## ⚠️ Notas
- El servidor sirve desde el directorio padre para acceder a todas las carpetas
- La URL correcta es: **http://localhost:8000/MusikFacts/**
- Asegúrate de que todas las carpetas de contenido (1Albumesvendidos, 3SuperBowls, etc.) estén en el mismo nivel que la carpeta MusikFacts

