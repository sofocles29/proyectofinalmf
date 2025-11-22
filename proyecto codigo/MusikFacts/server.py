#!/usr/bin/env python3
"""
Servidor HTTP simple para MusikFacts
Ejecuta este archivo para iniciar el servidor local
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Agregar headers CORS para evitar problemas
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

def main():
    # Cambiar al directorio padre para acceder a todas las carpetas
    script_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(script_dir)
    os.chdir(parent_dir)
    
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"\n{'='*50}")
        print(f"🚀 Servidor iniciado en http://localhost:{PORT}")
        print(f"{'='*50}")
        print(f"\n📂 Directorio: {os.getcwd()}")
        print(f"\n🌐 Abre tu navegador en: http://localhost:{PORT}/MusikFacts/")
        print(f"\n⏹️  Presiona Ctrl+C para detener el servidor\n")
        
        # Intentar abrir el navegador automáticamente
        try:
            webbrowser.open(f'http://localhost:{PORT}/MusikFacts/')
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Servidor detenido")

if __name__ == "__main__":
    main()

