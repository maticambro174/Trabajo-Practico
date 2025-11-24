import {Router} from "express";
import { obtenerUsuarioPorId } from "../utils/usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import{crearUsuario, encontrarTodos, encontrarPorEmail} from "../db/actions/usuarios.actions.js"

const router=Router()

const SECRET = "_AQPsssHV56kF07ImQL9DPEj5UzCYuLG8BbSAmedv74gLPueV9abm51Ca18rIGJC";


router.get('/todos', async(req, res) => {
    try {
            const resultado=await encontrarTodos();
            console.log(resultado);
            
            res.status(200).json(resultado);
        } catch (error) {
            res.status(400).json();
        }
})

router.post('/crear', async(req, res) => {
  const {nombre, apellido, email, contraseña} = req.body;  
    try {
        const resultado= await crearUsuario({nombre, apellido, email, contraseña})
        console.log(resultado);
        resultado.status=true;
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({status: false});
    }
});

router.get('/porId/:usuarioId', (req, res)=>{
    const id=parseInt(req.params.usuarioId)

    const resultado=obtenerUsuarioPorId(id)
    if(resultado){
        res.status(200).json(resultado)
    }else{
        res.status(400).json(`${id} no se encuentra`)
    }
})


router.post('/inicioSesion', async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    const resultado = await encontrarPorEmail(email);

    if (!resultado) {
      return res.status(404).json({ status: false, message: "Usuario no encontrado" });
    }

    const controlPass = bcrypt.compareSync(contraseña, resultado.contraseña);
    if (!controlPass) {
      return res.status(401).json({ status: false, message: "Contraseña incorrecta" });
    }

    const payload = {
      usuarioId: resultado._id,
      nombre: resultado.nombre,
      apellido: resultado.apellido,
      email: resultado.email
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: 86400 });

    return res.status(200).json({
      status: true,
      token,
      user: payload
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Error interno" });
  }
});


export default router