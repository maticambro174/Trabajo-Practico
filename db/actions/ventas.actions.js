import { conectarDB } from "../connection.js";
import Venta from "../schemas/ventas.schema.js"

export const encontrarTodos=async()=> {
    try {
        await conectarDB()
        const res= await Venta.find().populate({path:'productos'})
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.error(error);
    }
}
export const crearVenta =async({productos, direccion, total, usuario})=> {
    try {
        await conectarDB()
        const res= await Venta.create({productos, direccion, total, usuario})
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error);
        throw error;
    }
}