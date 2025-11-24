import {API} from "../api.js"

const PRODUCTOS_API = `${API}/productos`  
const VENTAS_API = `${API}/ventas`
const CATEGORIAS_API= `${API}/categorias`

const user = JSON.parse(sessionStorage.getItem('user') || 'null')
const token = sessionStorage.getItem('token') || null


const userNameSpan = document.getElementById('userName')
const productTableBody = document.getElementById('productTableBody')
const productsError = document.getElementById('productsError')

const categoryFilter = document.getElementById('categoryFilter')
const precioMinInput = document.getElementById('precioMin')
const precioMaxInput = document.getElementById('precioMax')
const btnAplicarFiltros = document.getElementById('btnAplicarFiltros')

const cartTableBody = document.getElementById('cartTableBody')
const cartTotalSpan = document.getElementById('cartTotal')
const btnComprar = document.getElementById('btnComprar')
const cartMessage = document.getElementById('cartMessage')
const direccionInput = document.getElementById('direccionEnvio')

let productos = []
let carrito = JSON.parse(localStorage.getItem('carrito') || '[]')

if (user && user.nombre) {
  userNameSpan.textContent = `${user.nombre} ${user.apellido || ''}`
}

const cargarProductos = async () => {
  try {
    const res = await fetch(`${PRODUCTOS_API}/todos`)
    if (!res.ok) {
      const text = await res.text()
      console.error('Error al cargar productos', res.status, text)
      productsError.textContent = 'Error al cargar productos'
      return
    }
    productos = await res.json()
    renderProductos(productos)
  } catch (err) {
    console.error(err)
    productsError.textContent = 'Error de conexión con el servidor'
  }
}

const cargarCategorias = async () => {
  try {
    const res = await fetch(`${CATEGORIAS_API}/todos`)
    if (!res.ok) {
      console.error('Error al cargar categorías', res.status)
      return
    }

    const categorias = await res.json()

    categoryFilter.innerHTML = '<option value="todas">Todas</option>'

    categorias.forEach((c) => {
      const opt = document.createElement('option')
      opt.value = c._id
      opt.textContent = c.nombre
      categoryFilter.appendChild(opt)
    })
  } catch (err) {
    console.error('Error de conexión al cargar categorías', err)
  }
}


const renderProductos = (lista) => {
  productTableBody.innerHTML = ''

  if (!lista.length) {
    productsError.textContent = 'No hay productos para mostrar'
    return
  }

  productsError.textContent = ''

  lista.forEach((p) => {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="p-2">${p.nombre}</td>
      <td class="p-2">${p.descripcion}</td>
      <td class="p-2">$${p.precio}</td>
      <td class="p-2">
        <button 
          class="bg-green-500 hover:bg-green-600 text-slate-900 font-semibold rounded-md px-3 py-1"
          data-id="${p._id}"
          name="btnAddToCart"
        >
          Agregar al carrito
        </button>
      </td>
    `

    productTableBody.appendChild(tr)
  })
}

const aplicarFiltros = () => {
  let lista = [...productos]

  const categoriaSeleccionada = categoryFilter.value
  const valorMin = precioMinInput.value.trim()
  const valorMax = precioMaxInput.value.trim()

  if (categoriaSeleccionada !== 'todas') {
    lista = lista.filter(
      (p) => String(p.categoria) === categoriaSeleccionada
    )
  }

  let precioMin = 0
  let precioMax = Infinity

  if (valorMin !== '') {
    precioMin = Number(valorMin)
  }

  if (valorMax !== '') {
    precioMax = Number(valorMax)
  }

  lista = lista.filter(
    (p) => p.precio >= precioMin && p.precio <= precioMax
  )

  renderProductos(lista)
}

const guardarCarrito = () => {
  localStorage.setItem('carrito', JSON.stringify(carrito))
}

const renderCarrito = () => {
  cartTableBody.innerHTML = ''

  if (!carrito.length) {
    cartTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="p-2 text-slate-500">El carrito está vacío</td>
      </tr>
    `
    cartTotalSpan.textContent = '0'

    if (direccionInput) {
      direccionInput.value = ''
      direccionInput.disabled = true
    }
    btnComprar.disabled = true
    return
  }
  if (direccionInput) {
    direccionInput.disabled = false
  }
  btnComprar.disabled = false

  let total = 0

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad
    total += subtotal

    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td class="p-2">${item.nombre}</td>
      <td class="p-2">${item.cantidad}</td>
      <td class="p-2">$${item.precio}</td>
      <td class="p-2">$${subtotal}</td>
      <td class="p-2">
        <button 
          class="bg-red-500 hover:bg-red-600 text-slate-900 font-semibold rounded-md px-3 py-1"
          data-index="${index}"
          name="btnRemoveFromCart"
        >
          Quitar
        </button>
      </td>
    `
    cartTableBody.appendChild(tr)
  })

  cartTotalSpan.textContent = total
}

const agregarAlCarrito = (productoId) => {
  const producto = productos.find((p) => p._id === productoId)
  if (!producto) return

  const index = carrito.findIndex((item) => item.productoId === productoId)

  if (index >= 0) {
    carrito[index].cantidad += 1
  } else {
    carrito.push({
      productoId: producto._id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    })
  }

  guardarCarrito()
  renderCarrito()
}

const comprar = async () => {
  cartMessage.textContent = ''

  if (!user || !user.usuarioId) {
    cartMessage.textContent = 'No hay usuario en sesión'
    return
  }

  if (!token) {
    cartMessage.textContent = 'No se encontró el token. Inicie sesión nuevamente.'
    return
  }

  if (!carrito.length) {
    cartMessage.textContent = 'El carrito está vacío'
    return
  }

  const direccion = direccionInput.value.trim()
  if (!direccion) {
    cartMessage.textContent = 'Ingrese una dirección de envío'
    return
  }

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  )

  const body = {
    direccion,
    total,
    productos: carrito.map((item) => item.productoId)
  }

  try {
    const res = await fetch(`${VENTAS_API}/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })

    const data = await res.json()

    if (!res.ok || !data.status) {
      console.error('Error al comprar', res.status, data)
      cartMessage.textContent = data.message || 'Error al procesar la compra'
      return
    }

    cartMessage.textContent = 'Compra realizada correctamente'
    carrito = []
    guardarCarrito()
    renderCarrito()
  } catch (err) {
    console.error(err)
    cartMessage.textContent = 'Error de conexión al procesar la compra'
  }
}


window.addEventListener('DOMContentLoaded', () => {
  cargarProductos()
  cargarCategorias()
  renderCarrito()
})

btnAplicarFiltros.addEventListener('click', (e) => {
  e.preventDefault()
  aplicarFiltros()
})

productTableBody.addEventListener('click', (e) => {
  if (e.target.name === 'btnAddToCart') {
    const id = e.target.dataset.id
    agregarAlCarrito(id)
  }
})

cartTableBody.addEventListener('click', (e) => {
  if (e.target.name === 'btnRemoveFromCart') {
    const index = Number(e.target.dataset.index)
    carrito.splice(index, 1)
    guardarCarrito()
    renderCarrito()
  }
})

btnComprar.addEventListener('click', (e) => {
  e.preventDefault()
  comprar()
})
