Se ha estado utilizando Postman para el testing de las rutas con el comando NPM RUN DEV

Rutas de productos:
- GET localhost:3000/productos/todo: Obtiene todos los productos del JSON.
- GET localhost:3000/productos/porId/:productoId: Obtiene los datos de un producto en especifico por su productoId como parametro en la ruta.
  Ejemplo: localhost:3000/productos/porId/101
- POST localhost:3000/productos/porPrecio: Obtiene los datos de productos cuyo precio este entre dos parametros ingresados por el body
  Ejemplo: {
    "precioMenor": 555555,
    "precioMayor": 900000
  }
- POST localhost:3000/productos/agregar: Agrega un nuevo producto por parametros ingresados por el body
  Ejemplo: {
    "productoId": 106,
    "nombre": "Tablet 10 Lite",
    "descripcion": "Octa-core, 4GB RAM, 64GB almacenamiento",
    "precio": 219999,
    "imagen": "/img/productos/tablet10.jpg"
  }
- PUT localhost:3000/productos/cambiarPrecio: Cambia el precio de un producto en especifico ingresando los datos de cual producto sera editado por su Id y el nuevo precio, ambos parametros ingresados por el body
  Ejemplo: {
    "productoId": 106,
    "nuevoPrecio": 4000
  }
- DELETE localhost:3000/productos/eliminar/:productoId: Elimina un producto en especifico por su productoId como parametro en la ruta
  Ejemplo: localhost:3000/productos/eliminar/106

Rutas de usuarios:
- GET localhost:3000/usuarios/todo: Obtiene todos los usuarios del JSON.
- GET localhost:3000/usuarios/porId/:usuarioId: Obtiene los datos de un usuario en especifico por su usuarioId como parametro en la ruta.
  Ejemplo: localhost:3000/usuarios/porId/3
- POST localhost:3000/usuarios/inicioSesion: Permite iniciar sesion ingresando los datos del usuario por el body
  Ejemplo: {
    "email": "matiascambronero@gmail.com",
    "contraseña": "matias2025"
  }
- POST localhost:3000/usuarios/agregar: Agrega un nuevo usuario por parametros ingresados por el body
  Ejemplo: {
        "usuarioId": 11,
        "nombre": "Matias",
        "apellido": "Cambronero",
        "email": "matiascambronero@gmail.com",
        "contraseña": "matias2029"
    }
- PUT localhost:3000/usuarios/cambiarContrasena: Cambia la contrasela de un usuario en especifico ingresando los datos de cual usuario sera editado por su Id y la nueva contraseña, ambos parametros ingresados por el body
  Ejemplo: {
    "usuarioId": 11,
    "nuevaContrasena": "matias2021"
    }
- DELETE localhost:3000/usuarios/eliminar/:usuarioId: Elimina un usuario en especifico por su usuarioId como parametro en la ruta
  Ejemplo: localhost:3000/usuarios/eliminar/11

Rutas de ventas:
- GET localhost:3000/ventas/todo: Obtiene todas las ventas del JSON.
- GET localhost:3000/ventas/porId/:ventaId: Obtiene los datos de una venta en especifico por su ventaId como parametro en la ruta.
  Ejemplo: localhost:3000/ventas/porId/1
- POST localhost:3000/ventas/porProducto: Obtiene los datos de las ventas cuyos productosId coincidan con los parametros ingresados a traves del body.
  Ejemplo: {
    "productoId": 104
  }
- POST localhost:3000/ventas/agregar: Agrega una nueva venta por parametros ingresados por el body.
  Ejemplo:{
        "ventaId": 11,
        "id_usuario": 2,
        "fecha": "2025-09-01",
        "total": 189997,
        "direccion": "Av. Colón 1234, Córdoba",
        "productos": [103,104]
  }
- PUT localhost:3000/ventas/cambiarProductos: Cambia los productos de una venta en especifico ingresando los datos de cual venta sera editada por su Id y los nuevos productos, ambos parametros ingresados por el body
  Ejemplo: {
    "ventaId": 11,
    "nuevosProductos": [101, 105]
  }  
- DELETE localhost:3000/ventas/eliminar:ventaId: Elimina una venta en especifico por su ventaId como parametro en la ruta
Ejemplo: localhost:3000/ventas/eliminar/11
