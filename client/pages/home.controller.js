const PRODUCT_API = 'http://localhost:3000/productos'
const VENTAS_API = 'http://localhost:3000/ventas'  // o 3001 según tu server

const user = JSON.parse(sessionStorage.getItem('user') || 'null')

// Elementos del DOM
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

let productos = []
let carrito = JSON.parse(localStorage.getItem('carrito') || '[]')

if (user && user.nombre) {
  userNameSpan.textContent = `${user.nombre} ${user.apellido || ''}`
}

const cargarProductos = async () => {
  try {
    const res = await fetch(`${PRODUCT_API}/todo`)
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
          data-id="${p.productoId}"
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
      (p) => (p.categoria || '').toLowerCase() === categoriaSeleccionada
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
    return
  }

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
  const producto = productos.find((p) => p.productoId === productoId)
  if (!producto) return

  const index = carrito.findIndex((item) => item.productoId === productoId)

  if (index >= 0) {
    carrito[index].cantidad += 1
  } else {
    carrito.push({
      productoId: producto.productoId,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    })
  }

  guardarCarrito()
  renderCarrito()
}

const comprar = async () => {
  if (!carrito.length) {
    cartMessage.textContent = 'El carrito está vacío'
    return
  }

  if (!user || !user.usuarioId) {
    cartMessage.textContent = 'No hay usuario en sesión'
    return
  }

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  )

  const direccion = prompt('Ingrese la dirección de envío:')

  if (!direccion) {
    cartMessage.textContent = 'Debe ingresar una dirección'
    return
  }

  const body = {
    id_usuario: user.usuarioId,
    fecha: new Date().toISOString().slice(0, 10),
    total,
    direccion,
    productos: carrito.map((item) => item.productoId)
  }

  try {
    const res = await fetch(`${VENTAS_API}/agregar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await res.json()

    if (res.ok && data.status) {
      cartMessage.textContent = `Compra realizada. N° de venta: ${data.venta.ventaId}`
      carrito = []
      guardarCarrito()
      renderCarrito()
    } else {
      cartMessage.textContent = data.msg || 'Error al procesar la compra'
    }
  } catch (err) {
    console.error(err)
    cartMessage.textContent = 'Error de conexión al enviar la compra'
  }
}

window.addEventListener('DOMContentLoaded', () => {
  cargarProductos()
  renderCarrito()
})

btnAplicarFiltros.addEventListener('click', (e) => {
  e.preventDefault()
  aplicarFiltros()
})

productTableBody.addEventListener('click', (e) => {
  if (e.target.name === 'btnAddToCart') {
    const id = Number(e.target.dataset.id)
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
