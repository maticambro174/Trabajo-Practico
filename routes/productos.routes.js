import {Router} from "express";
import { crearProducto, encontrarTodos } from "../db/actions/productos.actions.js";


const router=Router()

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
    const {nombre, descripcion, precio, stock, categoria } = req.body;  
    try {
        const resultado= await crearProducto({nombre, descripcion, precio, stock, categoria })
        console.log(resultado);
        resultado.status=true;
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({status: false});
    }
});

router.get('/porId/:productoId', (req, res)=>{
    const id=parseInt(req.params.productoId)

    const resultado=productosData.find(e=>e.productoId==id)

    if(resultado){
        res.status(200).json(resultado)
    }else{
        res.status(400).json(`${id} no se encuentra`)
    }
})

router.post('/porPrecio', (req, res) => {
    const precioMenor  =Number(req.body.precioMenor);
    const precioMayor=Number(req.body.precioMayor)

    try {
        const resultado = productosData.filter(e => 
            e.precio >= precioMenor && e.precio <= precioMayor
        ).map(e => ({
            productoId: e.productoId,
            nombre: e.nombre,
            descripcion: e.descripcion,
            precio: e.precio,
            imagen: e.imagen
        }));

        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(404).json({ mensaje: `No se encontraron productos entre ${precioMenor} y ${precioMayor}` });
        }

    } catch (error) {
        res.status(500).json('Error al buscar por precio');
    }
});



router.put('/cambiarPrecio', (req, res)=>{
    const id=req.body.productoId
    const nuevoPrecio=req.body.nuevoPrecio

    try{
        const index=productosData.findIndex(e=>e.productoId==id)
        productosData[index].precio=nuevoPrecio
        res.status(201).json('Producto modificado correctamente')

    }catch(error){
        res.send(500).json("Error al actualizar el producto")
    }
})

router.delete('/eliminar/:productoId', (req, res)=>{
    try{
        const id=parseInt(req.params.productoId);
        const index = productosData.findIndex(p => p.productoId === id);
        if (index === -1) {
            return res.status(404).json(`No se encontró producto con ID ${id}` );
        }
        productosData.splice(index, 1);
        res.status(200).json('Producto eliminado correctamente')
    }catch(error){
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
})
export default router