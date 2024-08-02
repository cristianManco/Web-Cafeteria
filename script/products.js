document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('https://coffeshop-backend.onrender.com/product/all?page=1&limit=100');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        console.log(data);

        const products = data.data.products;

        if (!Array.isArray(products)) {
            throw new Error('Products data is not an array');
        }

        const reposteriaGallery = document.getElementById('reposteria-gallery');
        const panaderiaGallery = document.getElementById('panaderia-gallery');
        const cafeGallery = document.getElementById('cafe-gallery');
        const reposteriaContainer = document.getElementById('reposteria');

        products.forEach(product => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `<img src="${product.multimedia_url}" alt="${product.name}">`;

            switch (product.category?.name) {
                case 'Sandwiches':
                case 'Ensaladas':
                    reposteriaGallery.appendChild(galleryItem);
                    break;
                case 'Panadería':
                case 'Helados':
                case 'Pastelería':
                case 'Mekato':
                    panaderiaGallery.appendChild(galleryItem);
                    break;
                case 'Bebidas-Calientes':
                case 'Jugos Naturales':
                case 'Bebidas Frías':
                case 'Gaseosas':
                    cafeGallery.appendChild(galleryItem);
                    break;
                default:
                    console.warn(`Category "${product.category?.name}" not recognized.`);
            }

            const card = document.createElement('div');
            card.className = 'card mb-4';
            card.innerHTML = `
                <img src="${product.multimedia_url}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h2 class="card-title">${product.name}</h2>
                    <p class="card-text">${product.description}</p>
                    <button class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#exampleModal" 
                        data-id="${product.id}" data-image="${product.multimedia_url}" data-name="${product.name}" 
                        data-description="${product.description}" data-price="${product.price}">
                        Más Información
                    </button>
                </div>
            `;
            reposteriaContainer.appendChild(card);
        });

        $('#exampleModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget);
            const id = button.data('id');
            const image = button.data('image');
            const name = button.data('name');
            const description = button.data('description');
            const price = button.data('price');
            const modalBody = document.getElementById('modalBody');
            const buyForm = document.getElementById('buy-form');

            modalBody.innerHTML = `
                <div class="card">
                    <img src="${image}" class="card-img-top" alt="${name}">
                    <div class="card-body">
                        <h2 class="card-title">${name}</h2>
                        <p class="card-text">${description}</p>
                        <p class="card-text">Precio: ${price}</p>
                    </div>
                </div>
            `;

            buyForm.innerHTML = `
                <form id="order-form">
                    <div class="mb-3">
                        <label for="quantity" class="form-label">Cantidad</label>
                        <input type="number" class="form-control" id="quantity" name="quantity" min="1" value="1" required>
                    </div>
                    <div class="mb-3">
                        <label for="payment-method" class="form-label">Método de Pago</label>
                        <select class="form-control" id="payment-method" name="payment-method" required>
                            <option value="QRCode">NEQUi</option>
                            <option value="bank-transfer">Transferencia Bancaria</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Crear Orden</button>
                </form>
            `;
        });

    } catch (error) {
        console.error("Error fetching products:", error);
    }
});
