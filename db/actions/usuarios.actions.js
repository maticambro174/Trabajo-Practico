import { conectarDB } from "../connection.js"
import Usuario from "../schemas/usuarios.schema.js"
import bcrypt from "bcryptjs";

export const encontrarTodos=async()=> {
    try {
        await conectarDB()
        const res= await Usuario.find()
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.error(error);
    }
}

export const crearUsuario =async({nombre, apellido, email, contraseña})=> {
    try {
        await conectarDB()
        const hashContraseña = bcrypt.hashSync(contraseña, 8);
        const res= await Usuario.create({nombre, apellido, email, contraseña: hashContraseña})
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const encontrarPorEmail = async (email) => {
  try {
    await conectarDB()
    const res = await Usuario.findOne({ email })
    return res ? JSON.parse(JSON.stringify(res)) : null
  } catch (error) {
    console.error(error)
    throw error
  }
}