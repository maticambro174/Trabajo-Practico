import {readFile} from 'fs/promises'


export const obtenerUsuarioPorId=(usuarioId)=>{
    return usuariosData.find(e=>e.usuarioId==usuarioId)
}