import { conectarDB } from "../connection.js"
import Producto from "../schemas/productos.schema.js"

export const encontrarTodos=async()=> {
    try {
        await conectarDB()
        const res= await Producto.find()
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.error(error);
    }
}

export const crearProducto =async({nombre, descripcion, precio, stock, categoria})=> {
    try {
        await conectarDB()
        const res= await Producto.create({nombre, descripcion, precio, stock, categoria})
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error);
        throw error;
    }
}
