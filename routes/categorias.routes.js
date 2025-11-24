import { Router } from "express";
import { crearCategoria, encontrarTodos } from "../db/actions/categorias.actions.js";

const router = Router();

router.get('/todos', async (req, res) => {
    try {
        const resultado=await encontrarTodos();
        console.log(resultado);
        
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json();
    }
});

router.post('/crear', async(req, res) => {
    const {nombre } = req.body;
    
    try {
        const resultado= await crearCategoria(nombre); 
        console.log(resultado);
        resultado.status=true;
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({status: false});
        throw error;
    }
});
export default router;