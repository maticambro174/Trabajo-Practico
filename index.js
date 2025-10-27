import express from "express"

import productosRouter from './routes/productos.routes.js'
import usuariosRouter from './routes/usuarios.routes.js'
import ventasRouter from './routes/ventas.routes.js'
const app=express()

const port=3000

app.use(express.json());

app.listen(port, ()=>{
    console.log(`Servidor levantado en puerto ${port}`);
})

//rutas de productos
app.use('/productos', productosRouter)
//rutas de usuarios
app.use('/usuarios', usuariosRouter)
//rutas de ventas
app.use('/ventas', ventasRouter)