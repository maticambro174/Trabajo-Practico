import { API } from "./api.js"
console.log(API);
const formLogin=document.getElementById("logInForm")
const error=document.getElementById("error")

formLogin.addEventListener('submit', (e)=>{
    e.preventDefault()
    logIn()
})

const logIn=async()=>{
    const mail=document.getElementById('mail').value
    const pass=document.getElementById('pass').value
    
    const res=await fetch(`${API}/usuarios/inicioSesion`, {
        method: 'POST',
        body: JSON.stringify({
            email: mail, 
            contraseña: pass}),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    const data=await res.json()
    
    if(data.status){
        console.log(data);
        sessionStorage.setItem('user', JSON.stringify(data))
        window.location.href="/pages/home.html"
    }else{
        error.textContent="Error al encontrar al usuario"
    }
}