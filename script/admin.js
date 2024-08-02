document.addEventListener('DOMContentLoaded', () => {
  const productContainer = document.getElementById('productos-grid');
  const buscarProducto = document.getElementById('categoria');
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');

  let products = [];
  let currentPage = 1;
  const limit = 10;
  let categoriesSet = new Set();
  let token = 'YOUR_AUTH_TOKEN_HERE'; // Coloca tu token de autenticación aquí

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
    buscarProducto.innerHTML = '<option value="">Seleccione una categoría</option>';
    categoriesSet.clear();

    if (products.length === 0) {
      productContainer.innerHTML = '<p>No products found.</p>';
      return;
    }
    products.forEach(product => {
      if (!categoriesSet.has(product.category.name)) {
        categoriesSet.add(product.category.name);
        const categorie = `<option value="${product.category.id}">${product.category.name}</option>`;
        buscarProducto.insertAdjacentHTML('beforeend', categorie);
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
            <button class="btn btn-primary" onclick="editProduct(${product.id})">Editar</button>
            <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Eliminar</button>
          </div>
        </div>
      `;
      productContainer.insertAdjacentHTML('beforeend', productCard);
    });
  };

  const editProduct = (productId) => {
    // Implementar la funcionalidad de edición del producto
    console.log('Edit product:', productId);
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`https://coffeshop-backend.onrender.com/product/${productId}`, {
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
