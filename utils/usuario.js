import {readFile} from 'fs/promises'

const fileUsuarios=await readFile('./data/usuarios.json', 'utf-8')
const usuariosData=JSON.parse(fileUsuarios)

export const obtenerUsuarioPorId=(usuarioId)=>{
    return usuariosData.find(e=>e.usuarioId==usuarioId)
}