import express from "express"

import productosRouter from './routes/productos.routes.js'
import usuariosRouter from './routes/usuarios.routes.js'
import ventasRouter from './routes/ventas.routes.js'
import categoriasRouter from './routes/categorias.routes.js'
const app=express()

const port=3000

app.use(express.json());
app.use(express.static('./client'))

app.listen(port, ()=>{
    console.log(`Servidor levantado en puerto ${port}`);
})

//rutas de productos
app.use('/productos', productosRouter)
//rutas de usuarios
app.use('/usuarios', usuariosRouter)
//rutas de ventas
app.use('/ventas', ventasRouter)
//rutas de categorias
app.use('/categorias', categoriasRouter)