import mongoose from "mongoose";

const {Schema, model, models, ObjectId} = mongoose;

const VentaSchema = new Schema({
    productos:[{type: ObjectId,required: true, ref: 'Producto'}],
    direccion:{type: String, required:true},
    total:{type: Number, required:true},
    usuario: {type: ObjectId, required:true, ref: 'Usuario'},
}, { timestamps: true });

const Venta=models.Venta||model('Venta', VentaSchema);

export default Venta;