#!/usr/bin/env python3
"""
main.py — Servidor local para el Manual de Trading de Oro (XAU/USD)

Sirve los archivos estáticos (index.html, styles.css, app.js) de esta carpeta
usando únicamente la librería estándar de Python (sin dependencias externas).

Uso:
    python main.py            # sirve en http://localhost:8000 y abre el navegador
    python main.py --port 5000
    python main.py --no-browser
"""

import argparse
import http.server
import socketserver
import sys
import webbrowser
from pathlib import Path

# Carpeta donde vive este script (donde deben estar index.html, styles.css, app.js)
BASE_DIR = Path(__file__).resolve().parent

REQUIRED_FILES = ["index.html", "styles.css", "app.js"]


class DevHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Handler que sirve archivos estáticos desde BASE_DIR sin cachearlos,
    útil mientras se edita el manual localmente."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def end_headers(self):
        # Evita que el navegador cachee agresivamente durante el desarrollo
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, format, *args):
        # Log más limpio en consola
        sys.stdout.write("  " + (format % args) + "\n")


def check_required_files():
    missing = [name for name in REQUIRED_FILES if not (BASE_DIR / name).exists()]
    if missing:
        print("⚠️  Faltan archivos en esta carpeta:")
        for name in missing:
            print(f"   - {name}")
        print(f"   (se esperaban junto a main.py en: {BASE_DIR})\n")


def main():
    parser = argparse.ArgumentParser(description="Servidor local del Manual de Trading de Oro")
    parser.add_argument("--port", type=int, default=8000, help="Puerto a usar (por defecto: 8000)")
    parser.add_argument("--host", default="localhost", help="Host a usar (por defecto: localhost)")
    parser.add_argument("--no-browser", action="store_true", help="No abrir el navegador automáticamente")
    args = parser.parse_args()

    check_required_files()

    # Permite reiniciar el servidor rápido sin error "Address already in use"
    socketserver.TCPServer.allow_reuse_address = True

    with socketserver.TCPServer((args.host, args.port), DevHTTPRequestHandler) as httpd:
        url = f"http://{args.host}:{args.port}/"
        print("=" * 52)
        print("  Manual de Trading de Oro — servidor local")
        print("=" * 52)
        print(f"  Sirviendo desde: {BASE_DIR}")
        print(f"  URL:             {url}")
        print("  Presiona Ctrl+C para detener el servidor")
        print("=" * 52)

        if not args.no_browser:
            webbrowser.open(url)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  Servidor detenido.")
            httpd.shutdown()


if __name__ == "__main__":
    main()
