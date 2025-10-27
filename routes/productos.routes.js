import {Router} from "express";
import {readFile, writeFile} from 'fs/promises'


const fileProductos=await readFile('./data/productos.json', 'utf-8')
const productosData=JSON.parse(fileProductos)
const router=Router()

router.get('/todo', (req, res) => {
    if (productosData.length) {
        res.status(200).json(productosData)
    } else {
        res.status(400).json("No hay productos para mostrar")
    }
})

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

router.post('/agregar',(req, res)=>{
    const {productoId, nombre, descripcion, precio, imagen}=req.body;
    if (!productoId || !nombre || !descripcion || !precio) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });

    }
    const nuevoProducto={productoId, nombre, descripcion, precio, imagen};

    productosData.push(nuevoProducto)
  res.status(201).json('Producto agregado correctamente')
  writeFile('./data/productos.json', JSON.stringify(productosData, null, 2))
})

router.put('/cambiarPrecio', (req, res)=>{
    const id=req.body.productoId
    const nuevoPrecio=req.body.nuevoPrecio

    try{
        const index=productosData.findIndex(e=>e.productoId==id)
        productosData[index].precio=nuevoPrecio
        res.status(201).json('Producto modificado correctamente')
        writeFile('./data/productos.json', JSON.stringify(productosData, null, 2))

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
        writeFile('./data/productos.json', JSON.stringify(productosData, null, 2))
    }catch(error){
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
})
export default router