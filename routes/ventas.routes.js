import {Router} from "express";
import { encontrarTodos, crearVenta } from "../db/actions/ventas.actions.js";
import { verifyToken, decodeToken } from "../utils/middleware.js";

const router=Router()

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];

  const isValid = await verifyToken(token);
  if (!isValid) {
    return res.status(401).json({
      status: false,
      message: "Token inválido o ausente",
    });
  }

  const payload = decodeToken(token);
  if (!payload) {
    return res.status(401).json({
      status: false,
      message: "No se pudo decodificar el token",
    });
  }

  req.user = payload;
  next();
};

router.get("/todos", authMiddleware, async (req, res) => {
  try {
    const resultado = await encontrarTodos();
    res.status(200).json(resultado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Error al obtener ventas" });
  }
});

router.post("/crear", authMiddleware, async (req, res) => {
  const usuario = req.user.usuarioId;
  const { productos, direccion, total } = req.body;

  if (!productos || !productos.length) {
    return res
      .status(400)
      .json({ status: false, message: "No se enviaron productos" });
  }

  try {
    const result = await crearVenta({ productos, direccion, total, usuario });
    res.status(201).json({
      status: true,
      message: "Venta creada correctamente",
      venta: result,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Error al crear la venta" });
  }
});

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


export default router

