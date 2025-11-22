import {Router} from "express";
import {readFile, writeFile} from 'fs/promises'
import { obtenerUsuarioPorId } from "../utils/usuario.js";

const fileUsuarios=await readFile('./data/usuarios.json', 'utf-8')
const usuariosData=JSON.parse(fileUsuarios)
const router=Router()

router.get('/todo', (req, res) => {
    if (usuariosData.length) {
        res.status(200).json(usuariosData)
    } else {
        res.status(400).json("No hay usuarios para mostrar")
    }
})

router.get('/porId/:usuarioId', (req, res)=>{
    const id=parseInt(req.params.usuarioId)

    const resultado=obtenerUsuarioPorId(id)
    if(resultado){
        res.status(200).json(resultado)
    }else{
        res.status(400).json(`${id} no se encuentra`)
    }
})


router.post('/inicioSesion', (req, res)=>{
    const email=req.body.email
    const contraseña=req.body.contraseña

    const resultado=usuariosData.find(e=>e.email==email && e.contraseña==contraseña)

    if(resultado){
        res.status(200).json({
            status: true,
            usuarioId: resultado.usuarioId,
            nombre: resultado.nombre,
            apellido: resultado.apellido,
            email: resultado.email
        })
    }else{
        res.status(400).json(`no se encontro al usuario`)
    }
})

router.post('/agregar',(req, res)=>{
    const {usuarioId, nombre, apellido, email, contraseña}=req.body;
    if (!usuarioId || !nombre || !apellido || !email ||!contraseña) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    const nuevoUsuario={usuarioId, nombre, apellido, email, contraseña};

    usuariosData.push(nuevoUsuario)
    res.status(201).json('Usuario agregado correctamente')
    writeFile('./data/usuarios.json', JSON.stringify(usuariosData, null, 2))
})

router.put('/cambiarContrasena', (req, res)=>{
    const id=req.body.usuarioId
    const nuevaContrasena=req.body.nuevaContrasena

    try{
        const index=usuariosData.findIndex(e=>e.usuarioId==id)
        usuariosData[index].contraseña=nuevaContrasena
        res.status(201).json('contraseña modificada correctamente')
        writeFile('./data/usuarios.json', JSON.stringify(usuariosData, null, 2))

    }catch(error){
        res.send(500).json("Error al actualizar la contraseña")
    }
})


router.delete('/eliminar/:usuarioId', (req, res)=>{
    try{
        const id=parseInt(req.params.usuarioId);
        const index = usuariosData.findIndex(p => p.usuarioId === id);
        if (index === -1) {
            return res.status(404).json(`No se encontró usuario con ID ${id}` );
        }
        usuariosData.splice(index, 1);
        res.status(200).json('Producto eliminado correctamente')
        writeFile('./data/usuarios.json', JSON.stringify(usuariosData, null, 2))

    }catch(error){
        res.status(500).json({ error: 'Error al eliminar al usuario' });
    }
})

export default router