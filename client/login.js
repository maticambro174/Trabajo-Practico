import { API } from "./api.js"
console.log(API)

const formLogin = document.getElementById("logInForm")
const error = document.getElementById("error")

formLogin.addEventListener('submit', (e) => {
    e.preventDefault()
    logIn()
})

const logIn = async () => {
    const mail = document.getElementById('mail').value
    const pass = document.getElementById('pass').value
    
    const res = await fetch(`${API}/usuarios/inicioSesion`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: mail,
            contraseña: pass
        })
    })

    const data = await res.json()
    console.log('Respuesta login:', data)

    if (data.status) {
        sessionStorage.setItem('token', data.token)
        sessionStorage.setItem('user', JSON.stringify(data.user))

        window.location.href = "/pages/home.html"
    } else {
        error.textContent = data.message || "Error al encontrar al usuario"
    }
}
