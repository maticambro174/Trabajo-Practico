import mongoose from "mongoose";

const {Schema, model, models}=mongoose;

const CategoriaSchema=new Schema({
    nombre: {type: String, required:true, unique: true, uppercase: true},
})

const Categoria= models.Categoria||model('Categoria', CategoriaSchema);

export default Categoria;