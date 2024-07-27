document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "https://coffeshop-backend.onrender.com/product/all";

    try {
        const response = await fetch(apiUrl);
        const products = await response.json();

        const reposteriaGallery = document.getElementById('reposteria-gallery');
        const panaderiaGallery = document.getElementById('panaderia-gallery');
        const cafeGallery = document.getElementById('cafe-gallery');
        const reposteriaContainer = document.getElementById('reposteria');

        products.forEach(product => {
            // Añadir imágenes a las galerías
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `<img src="${product.multimedia_url}" alt="${product.name}">`;

            switch (product.category.name) {
                case 'Repostería':
                    reposteriaGallery.appendChild(galleryItem);
                    break;
                case 'Panadería y pastelería':
                    panaderiaGallery.appendChild(galleryItem);
                    break;
                case 'Café & bebidas':
                    cafeGallery.appendChild(galleryItem);
                    break;
            }

            // Añadir tarjetas de productos
            const card = document.createElement('div');
            card.className = 'card mb-4';
            card.innerHTML = `
                <img src="${product.multimedia_url}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
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

        // Manejo del modal
        $('#exampleModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget);
            const id = button.data('id');
            const image = button.data('image');
            const name = button.data('name');
            const description = button.data('description');
            const price = button.data('price');
            const modalBody = document.getElementById('modalBody');
            const buyLink = document.getElementById('buy-link');

            modalBody.innerHTML = `
                <tr>
                    <td><img src="${image}" class="img-fluid" alt="${name}"></td>
                    <td>${name}</td>
                    <td>${description}</td>
                    <td>${price}</td>
                </tr>
            `;
            buyLink.href = `purchase.html?product=${id}`; // URL de compra, ajustar según sea necesario
        });

    } catch (error) {
        console.error("Error fetching products:", error);
    }
});
