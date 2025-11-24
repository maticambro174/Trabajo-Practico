import mongoose from "mongoose";

const {Schema, model, models, ObjectId} = mongoose;

const ProductoSchema = new Schema({
    nombre: { type: String, required: true, unique: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    categoria: { type: ObjectId, required: true, ref: "Categoria" },
    activo: { type: Boolean, default: true },
});

const Producto= models.Producto||model('Producto', ProductoSchema);

export default Producto;