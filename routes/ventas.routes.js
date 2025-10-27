import {Router} from "express";
import {readFile, writeFile} from 'fs/promises'


const fileVentas=await readFile('./data/ventas.json', 'utf-8')
const ventasData=JSON.parse(fileVentas)
const router=Router()

router.get('/todo', (req, res) => {
    if (ventasData.length) {
        res.status(200).json(ventasData)
    } else {
        res.status(400).json("No hay ventas para mostrar")
    }
})

router.get('/porId/:ventaId', (req, res)=>{
    const id=parseInt(req.params.ventaId)

    const resultado=ventasData.find(e=>e.ventaId==id)
    if(resultado){
        res.status(200).json(resultado)
    }else{
        res.status(400).json(`${id} no se encuentra`)
    }
})

router.post('/porProducto', (req, res) => {
    const productos  =Number(req.body.productoId);
    try {
        const resultado = ventasData.filter(v => 
            v.productos.includes(productos)
        ).map(v => ({
            ventaId: v.ventaId,
            id_usuario: v.id_usuario,
            fecha: v.fecha,
            total: v.total,
            direccion: v.direccion,
            productos: v.productos
        }));

        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(404).json({ mensaje: `No se encontraron productos entre ${precioMenor} y ${precioMayor}` });
        }

    } catch (error) {
        res.status(500).json('Error al buscar por productos');
    }
});

router.post('/agregar',(req, res)=>{
    const {ventaId, id_usuario, fecha, total, direccion, productos}=req.body;
    if (!ventaId || !id_usuario || !fecha || !total||!direccion||!productos) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    const nuevaVenta={ventaId, id_usuario, fecha, total, direccion, productos};

    ventasData.push(nuevaVenta)
  res.status(201).json('Venta agregada correctamente')
  writeFile('./data/ventas.json', JSON.stringify(ventasData, null, 2))
})

router.put('/cambiarProductos', (req, res)=>{
    const id=req.body.ventaId
    const nuevosProductos=req.body.nuevosProductos

    try{
        const index=ventasData.findIndex(e=>e.ventaId==id)
        ventasData[index].productos=nuevosProductos
        res.status(201).json('venta modificada correctamente')
        writeFile('./data/ventas.json', JSON.stringify(ventasData, null, 2))

    }catch(error){
        res.send(500).json("Error al actualizar la venta")
    }
})

router.delete('/eliminar/:ventaId', (req, res)=>{
    try{
        const id=parseInt(req.params.ventaId);
        const index = ventasData.findIndex(v => v.ventaId === id);
        if (index === -1) {
            return res.status(404).json(`No se encontró ventas con ID ${id}` );
        }
        ventasData.splice(index, 1);
        res.status(200).json('Producto eliminado correctamente')
        writeFile('./data/ventas.json', JSON.stringify(ventasData, null, 2))
    }catch(error){
        res.status(500).json({ error: 'Error al eliminar la venta' });
    }
})

export default router

