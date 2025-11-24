import mongoose from "mongoose";

const {Schema, model, models}=mongoose;

const UsuarioSchema=new Schema({
    nombre: {type: String, required:true, unique: true, uppercase: true},
    apellido: {type: String, required:true, uppercase: true},
    email: {type: String, required:true, unique: true, lowercase: true},
    contraseña: {type: String, required:true},
})

const Usuario= models.usuario||model('Usuario', UsuarioSchema);

export default Usuario;