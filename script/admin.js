document.addEventListener('DOMContentLoaded', async () => {
  const productContainer = document.getElementById('productos-grid');
  const buscarProducto = document.getElementById('buscar-producto');
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');
  const formProducto = document.getElementById('form-producto');
  const modalProducto = new bootstrap.Modal(document.getElementById('modal-producto'));
  const productoIdInput = document.getElementById('producto-id');
  const nombreInput = document.getElementById('nombre');
  const descripcionInput = document.getElementById('descripcion');
  const precioInput = document.getElementById('precio');
  const multimediaUrlInput = document.getElementById('multimedia_url');
  const categoriaInput = document.getElementById('categoria');
  const stockInput = document.getElementById('stock');

  let products = [];
  let currentPage = 1;
  const limit = 10;
  let categoriesSet = new Set();

  const token = localStorage.getItem('token');
  if (!token) {
    alert('No token found. Please log in.');
    return;
  }

  const payload = await jwt_decode(token);
  const isAdmin = payload.role === 'admin';

  const fetchOptions = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const loadProducts = async (page = 1, limit = 10) => {
    try {
      const response = await fetch(`https://coffeshop-backend.onrender.com/product/all?page=${page}&limit=${limit}`, fetchOptions);
      if (response.ok) {
        const result = await response.json();
        products = result.data.products;
        displayProducts(products);
      } else {
        console.error('Error loading products:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const displayProducts = (products) => {
    productContainer.innerHTML = '';
    categoriaInput.innerHTML = '<option value="">Seleccione una categoría</option>';
    categoriesSet.clear();

    if (products.length === 0) {
      productContainer.innerHTML = '<p>No products found.</p>';
      return;
    }

    products.forEach(product => {
      if (!categoriesSet.has(product.category.id)) {
        categoriesSet.add(product.category.id);
        const categoryOption = `<option value="${product.category.id}">${product.category.name}</option>`;
        categoriaInput.insertAdjacentHTML('beforeend', categoryOption);
      }

      const productCard = `
        <div class="card mb-3" style="width: 18rem;">
          <img src="${product.multimedia_url}" class="card-img-top" alt="${product.name}" style="height: 150px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text">Precio: ${product.price}</p>
            <p class="card-text">Categoría: ${product.category.name}</p>
            <p class="card-text">Stock: ${product.stock}</p>
            ${isAdmin ? `
              <button class="btn btn-primary" onclick="editProduct(${product.id})">Editar</button>
              <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Eliminar</button>
            ` : ''}
          </div>
        </div>
      `;
      productContainer.insertAdjacentHTML('beforeend', productCard);
    });
  };

  const editProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      productoIdInput.value = product.id;
      nombreInput.value = product.name;
      descripcionInput.value = product.description;
      precioInput.value = product.price;
      multimediaUrlInput.value = product.multimedia_url;
      categoriaInput.value = product.category.id;
      stockInput.value = product.stock;
      modalProducto.show();
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`https://coffeshop-backend.onrender.com/product/delete/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        console.log('Product deleted:', productId);
        loadProducts(currentPage, limit); // Reload products after deletion
      } else {
        console.error('Error deleting product:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  formProducto.addEventListener('submit', async (event) => {
    event.preventDefault();

    const category_id = parseInt(categoriaInput.value, 10);
    if (isNaN(category_id)) {
      console.error('Invalid category ID');
      return;
    }

    const productData = {
      name: nombreInput.value,
      description: descripcionInput.value,
      price: parseFloat(precioInput.value),
      multimedia_url: multimediaUrlInput.value,
      category_id: category_id,
      stock: parseInt(stockInput.value)
    };

    const method = productoIdInput.value ? 'PUT' : 'POST';
    const url = productoIdInput.value
      ? `https://coffeshop-backend.onrender.com/product/update/${productoIdInput.value}`
      : 'https://coffeshop-backend.onrender.com/product/create';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        console.log('Product saved:', await response.json());
        loadProducts(currentPage, limit); // Reload products after save
        modalProducto.hide();
      } else {
        const result = await response.json();
        console.error('Error saving product:', result);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  });

  prevPageBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      loadProducts(currentPage, limit);
    }
  });

  nextPageBtn.addEventListener('click', (event) => {
    event.preventDefault();
    currentPage++;
    loadProducts(currentPage, limit);
  });

  // Load initial data
  loadProducts(currentPage, limit);
});
