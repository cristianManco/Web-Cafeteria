document.addEventListener('DOMContentLoaded', () => {
  const productosGrid = document.getElementById('productos-grid');
  const empleadosGrid = document.getElementById('empleados-grid');
  const ordenesGrid = document.getElementById('ordenes-grid');
  const clientesGrid = document.getElementById('clientes-grid');
  const modalProducto = document.getElementById('modal-producto');
  const modalEmpleado = document.getElementById('modal-empleado');
  const modalOrden = document.getElementById('modal-orden');
  const modalCliente = document.getElementById('modal-cliente');
  const formProducto = document.getElementById('form-producto');
  const formEmpleado = document.getElementById('form-empleado');
  const formOrden = document.getElementById('form-orden');
  const formCliente = document.getElementById('form-cliente');
  const modalTitulo = document.getElementById('modal-titulo');
  const closeModal = document.querySelector('.close');
  const agregarProductoBtn = document.getElementById('agregar-producto-btn');
  const agregarEmpleadoBtn = document.getElementById('agregar-empleado-btn');
  const agregarOrdenBtn = document.getElementById('agregar-orden-btn');
  const agregarClienteBtn = document.getElementById('agregar-cliente-btn');

  let editingProduct = null;
  let editingEmployee = null;
  let editingOrder = null;
  let editingClient = null;

  const closeModalHandler = (modal, form) => {
    modal.style.display = 'none';
    form.reset();
    editingProduct = editingEmployee = editingOrder = editingClient = null;
  };

  closeModal.onclick = () => {
    closeModalHandler(modalProducto, formProducto);
    closeModalHandler(modalEmpleado, formEmpleado);
    closeModalHandler(modalOrden, formOrden);
    closeModalHandler(modalCliente, formCliente);
  };

  window.onclick = (event) => {
    if (event.target == modalProducto) {
      closeModalHandler(modalProducto, formProducto);
    } else if (event.target == modalEmpleado) {
      closeModalHandler(modalEmpleado, formEmpleado);
    } else if (event.target == modalOrden) {
      closeModalHandler(modalOrden, formOrden);
    } else if (event.target == modalCliente) {
      closeModalHandler(modalCliente, formCliente);
    }
  };

  agregarProductoBtn.onclick = () => {
    modalProducto.style.display = 'block';
    modalTitulo.innerText = 'Agregar Producto';
  };

  agregarEmpleadoBtn.onclick = () => {
    modalEmpleado.style.display = 'block';
    modalTitulo.innerText = 'Agregar Empleado';
  };

  agregarOrdenBtn.onclick = () => {
    modalOrden.style.display = 'block';
    modalTitulo.innerText = 'Agregar Orden';
  };

  agregarClienteBtn.onclick = () => {
    modalCliente.style.display = 'block';
    modalTitulo.innerText = 'Agregar Cliente';
  };

  // Función para manejar la carga de productos
  const loadProducts = async () => {
    try {
      const response = await fetch('https://coffeshop-backend.onrender.com/product/all');
      const products = await response.json();
      productosGrid.innerHTML = '';
      products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'producto';
        productDiv.innerHTML = `
          <h3 class="producto-nombre">${product.name}</h3>
          <img src="${product.multimedia_url}" alt="${product.name}" class="producto-imagen">
          <p class="producto-descripcion">${product.description}</p>
          <p class="producto-precio">$${product.price.toFixed(2)}</p>
          <div class="producto-actions">
            <button class="editar-btn" onclick="editProduct(${product.id})">Editar</button>
            <button class="eliminar-btn" onclick="deleteProduct(${product.id})">Eliminar</button>
          </div>
        `;
        productosGrid.appendChild(productDiv);
      });
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  // Función para manejar la carga de empleados
  const loadEmployees = async () => {
    try {
      const response = await fetch('https://coffeshop-backend.onrender.com/employee/all');
      const employees = await response.json();
      empleadosGrid.innerHTML = '';
      employees.forEach(employee => {
        const employeeDiv = document.createElement('div');
        employeeDiv.className = 'empleado';
        employeeDiv.innerHTML = `
          <h3 class="empleado-nombre">${employee.name}</h3>
          <p class="empleado-cargo">${employee.position}</p>
          <div class="empleado-actions">
            <button class="editar-btn" onclick="editEmployee(${employee.id})">Editar</button>
            <button class="eliminar-btn" onclick="deleteEmployee(${employee.id})">Eliminar</button>
          </div>
        `;
        empleadosGrid.appendChild(employeeDiv);
      });
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  // Función para manejar la carga de órdenes
  const loadOrders = async () => {
    try {
      const response = await fetch('https://coffeshop-backend.onrender.com/order/all');
      const orders = await response.json();
      ordenesGrid.innerHTML = '';
      orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'orden';
        orderDiv.innerHTML = `
          <h3 class="orden-id">Orden ID: ${order.id}</h3>
          <p class="orden-fecha">${new Date(order.date).toLocaleDateString()}</p>
          <p class="orden-total">Total: $${order.total.toFixed(2)}</p>
          <div class="orden-actions">
            <button class="editar-btn" onclick="editOrder(${order.id})">Editar</button>
            <button class="eliminar-btn" onclick="deleteOrder(${order.id})">Eliminar</button>
          </div>
        `;
        ordenesGrid.appendChild(orderDiv);
      });
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  // Función para manejar la carga de clientes
  const loadClients = async () => {
    try {
      const response = await fetch('https://coffeshop-backend.onrender.com/client/all');
      const clients = await response.json();
      clientesGrid.innerHTML = '';
      clients.forEach(client => {
        const clientDiv = document.createElement('div');
        clientDiv.className = 'cliente';
        clientDiv.innerHTML = `
          <h3 class="cliente-nombre">${client.name}</h3>
          <p class="cliente-email">${client.email}</p>
          <div class="cliente-actions">
            <button class="editar-btn" onclick="editClient(${client.id})">Editar</button>
            <button class="eliminar-btn" onclick="deleteClient(${client.id})">Eliminar</button>
          </div>
        `;
        clientesGrid.appendChild(clientDiv);
      });
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  // Función para agregar/editar producto
  formProducto.onsubmit = async (event) => {
    event.preventDefault();
    const product = {
      name: document.getElementById('nombre').value,
      description: document.getElementById('descripcion').value,
      price: parseFloat(document.getElementById('precio').value),
      multimedia_url: document.getElementById('multimedia_url').value,
      category: parseInt(document.getElementById('categoria').value),
      stock: parseInt(document.getElementById('stock').value)
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, product);
    } else {
      await createProduct(product);
    }

    loadProducts();
    closeModalHandler(modalProducto, formProducto);
  };

  // Función para agregar/editar empleado
  formEmpleado.onsubmit = async (event) => {
    event.preventDefault();
    const employee = {
      name: document.getElementById('empleado-nombre').value,
      position: document.getElementById('empleado-position').value
    };

    if (editingEmployee) {
      await updateEmployee(editingEmployee.id, employee);
    } else {
      await createEmployee(employee);
    }

    loadEmployees();
    closeModalHandler(modalEmpleado, formEmpleado);
  };

  // Función para agregar/editar orden
  formOrden.onsubmit = async (event) => {
    event.preventDefault();
    const order = {
      total: parseFloat(document.getElementById('orden-total').value)
    };

    if (editingOrder) {
      await updateOrder(editingOrder.id, order);
    } else {
      await createOrder(order);
    }

    loadOrders();
    closeModalHandler(modalOrden, formOrden);
  };

  // Función para agregar/editar cliente
  formCliente.onsubmit = async (event) => {
    event.preventDefault();
    const client = {
      name: document.getElementById('cliente-nombre').value,
      email: document.getElementById('cliente-email').value
    };

    if (editingClient) {
      await updateClient(editingClient.id, client);
    } else {
      await createClient(client);
    }

    loadClients();
    closeModalHandler(modalCliente, formCliente);
  };

  // Funciones CRUD para productos
  const createProduct = async (product) => {
    try {
      await fetch('https://coffeshop-backend.onrender.com/product/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const updateProduct = async (id, product) => {
    try {
      await fetch(`https://coffeshop-backend.onrender.com/product/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(`https://coffeshop-backend.onrender.com/product/delete/${id}`, {
        method: 'DELETE'
      });
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Funciones CRUD para empleados
  const createEmployee = async (employee) => {
    try {
      await fetch('https://coffeshop-backend.onrender.com/employee/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee)
      });
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  const updateEmployee = async (id, employee) => {
    try {
      await fetch(`https://coffeshop-backend.onrender.com/employee/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee)
      });
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await fetch(`https://coffeshop-backend.onrender.com/employee/delete/${id}`, {
        method: 'DELETE'
      });
      loadEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  // Funciones CRUD para órdenes
  const createOrder = async (order) => {
    try {
      await fetch('https://coffeshop-backend.onrender.com/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const updateOrder = async (id, order) => {
    try {
      await fetch(`https://coffeshop-backend.onrender.com/order/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      });
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      await fetch(`https://coffeshop-backend.onrender.com/order/delete/${id}`, {
        method: 'DELETE'
      });
      loadOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Funciones CRUD para clientes
  const createClient = async (client) => {
    try {
      await fetch('https://coffeshop-backend.onrender.com/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(client)
      });
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const updateClient = async (id, client) => {
    try {
      await fetch(`https://coffeshop-backend.onrender.com/users/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(client)
      });
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const deleteClient = async (id) => {
    try {
      await fetch(`https://coffeshop-backend.onrender.com/users/delete/${id}`, {
        method: 'DELETE'
      });
      loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  // Cargar datos iniciales
  loadProducts();
  loadEmployees();
  loadOrders();
  loadClients();
});
