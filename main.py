from fasthtml.common import *

# fast_app() crea la app FastHTML (ASGI) y, por defecto, ya sirve
# automáticamente cualquier archivo estático (css, js, png, svg, etc.)
# que esté en la MISMA carpeta que este main.py — por eso styles.css
# y app.js no necesitan ninguna ruta extra.
app, rt = fast_app()


@rt("/")
def get():
    # Servimos index.html tal cual (es HTML ya armado, no componentes FT)
    return FileResponse("index.html")


# serve() levanta uvicorn localmente (con reload) cuando corres
# `python main.py`. En Vercel no se ejecuta: Vercel importa `app`
# directamente y lo corre como función serverless ASGI.
serve()
