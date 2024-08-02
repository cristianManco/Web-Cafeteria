document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://coffeshop-backend.onrender.com/product/all?page=1&limit=3');

        const respons = await fetch('https://coffeshop-backend.onrender.com/product/all?page=1&limit=100');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const data1 = await respons.json();
        
 
        const products = data.data.products;
        const productos = data1.data.products;

        if (!Array.isArray(products)) {
            throw new Error('Products data is not an array');
        }

        const threeCardsContainer = document.querySelector('.three-cards-container');
        const cintaDeImagenes1 = document.querySelector('.cinta-de-imagenes');
        const carouselInner = document.querySelector('.carousel-inner');
        const cintaDeImagenes2 = document.querySelector('#cinta-img2');

        // Agregar tarjetas
        products.forEach(product => {
            const card = `
                <div class="card">
                    <img src="${product.multimedia_url}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                    </div>
                </div>
            `;
            threeCardsContainer.insertAdjacentHTML('beforeend', card);
        });

        // Agregar imágenes a la cinta 1
        products.slice(0, 10).forEach(product => {
            const img = `
                <div class="cinta-item">
                    <img src="${product.multimedia_url}" alt="${product.name}">
                </div>
            `;
            cintaDeImagenes1.insertAdjacentHTML('beforeend', img);
        });

        // Agregar imágenes al carrusel
        productos.forEach((product, index) => {
            const activeClass = index === 0 ? 'active' : '';
            const carouselItem = `
                <div class="carousel-item ${activeClass}">
                    <img src="${product.multimedia_url}" class="d-block w-100" alt="${product.name}">
                </div>
            `;
            carouselInner.insertAdjacentHTML('beforeend', carouselItem);
        });

        // Agregar imágenes a la cinta 2
        products.slice(3, 10).forEach(product => {
            const img = `
                <div class="cinta-item">
                    <img src="${product.multimedia_url}" class="d-block w-60"  alt="${product.name}">
                </div>
            `;
            cintaDeImagenes2.insertAdjacentHTML('beforeend', img);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
});
