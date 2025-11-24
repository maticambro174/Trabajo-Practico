import { conectarDB } from "../connection.js"
import Producto from "../schemas/productos.schema.js"
import Categoria from "../schemas/categorias.schema.js"
export const encontrarTodos = async () => {
  try {
    await conectarDB()
    const res = await Categoria.find()
    return JSON.parse(JSON.stringify(res))
  } catch (error) {
    console.log(error)
  }
}

export const crearCategoria = async (nombre) => {
  try {
    await conectarDB()
    const res = await Categoria.create( {nombre} )

    return JSON.parse(JSON.stringify(res))
  } catch (error) {
    console.log(error);
    throw error;
  }
}

