document.addEventListener('DOMContentLoaded', function() {
    const saleForm = document.getElementById('sale-form');
    const normalProductsContainer = document.getElementById('normal-products-container');
    const replicaProductsContainer = document.getElementById('replica-products-container');
    const watchProductsContainer = document.getElementById('watch-products-container');
    const addNormalProductBtn = document.getElementById('add-normal-product');
    const addReplicaProductBtn = document.getElementById('add-replica-product');
    const addWatchProductBtn = document.getElementById('add-watch-product');
    const receiptDetails = document.getElementById('receipt-details');
    const downloadPdfBtn = document.getElementById('download-pdf');
    const saleDateInput = document.getElementById('sale-date');
    
    // Establecer fecha actual por defecto
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    saleDateInput.value = formattedDate;
    
    // Precios base
    const basePrices = {
        '30': 20000,
        '60': 35000,
        '110': 60000
    };
    
    // Descuentos por volumen (ahora siempre aplicados)
    const discounts = {
        '30': 2000,
        '60': 5000,
        '110': 10000
    };
    
    // Costo de domicilio (ahora siempre aplicado si hay dirección)
    const deliveryCost = 15000;
    
    let normalProducts = [];
    let replicaProducts = [];
    let watchProducts = [];
    
    // Función para formatear fecha en formato español
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Agregar producto normal
    addNormalProductBtn.addEventListener('click', function() {
        const productId = Date.now();
        const productHtml = `
            <div class="product-entry" data-id="${productId}">
                <div class="form-group">
                    <label>Perfume Normal</label>
                    <button type="button" class="btn-remove remove-product" data-id="${productId}">Eliminar</button>
                </div>
                <div class="form-group">
                    <label>Volumen (ml)</label>
                    <select class="product-volume" required>
                        <option value="">Selecciona el volumen</option>
                        <option value="30">30 ml</option>
                        <option value="60">60 ml</option>
                        <option value="110">110 ml</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Aroma</label>
                    <input type="text" class="product-aroma" placeholder="Ingresa el nombre del aroma" required>
                </div>
            </div>
        `;
        
        normalProductsContainer.insertAdjacentHTML('beforeend', productHtml);
        
        // Agregar evento al botón eliminar
        const removeBtn = normalProductsContainer.querySelector(`[data-id="${productId}"] .remove-product`);
        removeBtn.addEventListener('click', function() {
            this.closest('.product-entry').remove();
            updateProducts();
        });
        
        // Agregar eventos para actualizar en tiempo real
        const volumeSelect = normalProductsContainer.querySelector(`[data-id="${productId}"] .product-volume`);
        const aromaInput = normalProductsContainer.querySelector(`[data-id="${productId}"] .product-aroma`);
        
        volumeSelect.addEventListener('change', updateReceiptPreview);
        aromaInput.addEventListener('input', updateReceiptPreview);
        
        updateProducts();
    });
    
    // Agregar réplica (1.1)
    addReplicaProductBtn.addEventListener('click', function() {
        const productId = Date.now();
        const productHtml = `
            <div class="product-entry replica-entry" data-id="${productId}">
                <div class="form-group">
                    <label>Réplica (1.1)</label>
                    <button type="button" class="btn-remove remove-product" data-id="${productId}">Eliminar</button>
                </div>
                <div class="form-group">
                    <label>Nombre de la Réplica</label>
                    <input type="text" class="replica-name" placeholder="Nombre del perfume réplica" required>
                </div>
                <div class="form-group">
                    <label>Precio</label>
                    <input type="number" class="replica-price" placeholder="Precio de la réplica" required>
                </div>
            </div>
        `;
        
        replicaProductsContainer.insertAdjacentHTML('beforeend', productHtml);
        
        // Agregar evento al botón eliminar
        const removeBtn = replicaProductsContainer.querySelector(`[data-id="${productId}"] .remove-product`);
        removeBtn.addEventListener('click', function() {
            this.closest('.product-entry').remove();
            updateProducts();
        });
        
        // Agregar eventos para actualizar en tiempo real
        const nameInput = replicaProductsContainer.querySelector(`[data-id="${productId}"] .replica-name`);
        const priceInput = replicaProductsContainer.querySelector(`[data-id="${productId}"] .replica-price`);
        
        nameInput.addEventListener('input', updateReceiptPreview);
        priceInput.addEventListener('input', updateReceiptPreview);
        
        updateProducts();
    });
    
    // Agregar reloj
    addWatchProductBtn.addEventListener('click', function() {
        const productId = Date.now();
        const productHtml = `
            <div class="product-entry watch-entry" data-id="${productId}">
                <div class="form-group">
                    <label>Reloj</label>
                    <button type="button" class="btn-remove remove-product" data-id="${productId}">Eliminar</button>
                </div>
                <div class="form-group">
                    <label>Nombre del Reloj</label>
                    <input type="text" class="watch-name" placeholder="Nombre del reloj" required>
                </div>
                <div class="form-group">
                    <label>Precio</label>
                    <input type="number" class="watch-price" placeholder="Precio del reloj" required>
                </div>
            </div>
        `;
        
        watchProductsContainer.insertAdjacentHTML('beforeend', productHtml);
        
        // Agregar evento al botón eliminar
        const removeBtn = watchProductsContainer.querySelector(`[data-id="${productId}"] .remove-product`);
        removeBtn.addEventListener('click', function() {
            this.closest('.product-entry').remove();
            updateProducts();
        });
        
        // Agregar eventos para actualizar en tiempo real
        const nameInput = watchProductsContainer.querySelector(`[data-id="${productId}"] .watch-name`);
        const priceInput = watchProductsContainer.querySelector(`[data-id="${productId}"] .watch-price`);
        
        nameInput.addEventListener('input', updateReceiptPreview);
        priceInput.addEventListener('input', updateReceiptPreview);
        
        updateProducts();
    });
    
    // Actualizar lista de productos
    function updateProducts() {
        normalProducts = [];
        replicaProducts = [];
        watchProducts = [];
        
        // Obtener productos normales
        const normalProductElements = normalProductsContainer.querySelectorAll('.product-entry:not(.replica-entry):not(.watch-entry)');
        normalProductElements.forEach(element => {
            const volume = element.querySelector('.product-volume').value;
            const aroma = element.querySelector('.product-aroma').value;
            
            if (volume && aroma) {
                const basePrice = basePrices[volume];
                const discount = discounts[volume];
                const finalPrice = basePrice - discount;
                
                normalProducts.push({
                    name: aroma,
                    description: "Aroma personalizado",
                    volume: volume,
                    basePrice: basePrice,
                    discount: discount,
                    finalPrice: finalPrice
                });
            }
        });
        
        // Obtener réplicas
        const replicaProductElements = replicaProductsContainer.querySelectorAll('.replica-entry');
        replicaProductElements.forEach(element => {
            const name = element.querySelector('.replica-name').value;
            const price = element.querySelector('.replica-price').value;
            
            if (name && price) {
                replicaProducts.push({
                    name: name,
                    price: parseInt(price),
                    isReplica: true
                });
            }
        });
        
        // Obtener relojes
        const watchProductElements = watchProductsContainer.querySelectorAll('.watch-entry');
        watchProductElements.forEach(element => {
            const name = element.querySelector('.watch-name').value;
            const price = element.querySelector('.watch-price').value;
            
            if (name && price) {
                watchProducts.push({
                    name: name,
                    price: parseInt(price),
                    isWatch: true
                });
            }
        });
        
        updateReceiptPreview();
    }
    
    // Actualizar vista previa del recibo
    function updateReceiptPreview() {
        const clientName = document.getElementById('client-name').value;
        const deliveryAddress = document.getElementById('delivery-address').value;
        const saleDate = saleDateInput.value;
        
        if (!clientName || (normalProducts.length === 0 && replicaProducts.length === 0 && watchProducts.length === 0)) {
            receiptDetails.innerHTML = '<div class="empty-state">Complete el formulario para generar el recibo</div>';
            downloadPdfBtn.style.display = 'none';
            return;
        }
        
        let receiptHtml = `
            <div class="receipt-row">
                <div>Cliente:</div>
                <div>${clientName}</div>
            </div>
            <div class="receipt-row">
                <div>Fecha:</div>
                <div>${formatDate(saleDate)}</div>
            </div>
        `;
        
        if (deliveryAddress) {
            receiptHtml += `
                <div class="receipt-row">
                    <div>Dirección:</div>
                    <div>${deliveryAddress}</div>
                </div>
            `;
        }
        
        let total = 0;
        
        // Agregar productos normales
        if (normalProducts.length > 0) {
            receiptHtml += `<div style="margin-top: 15px; font-weight: bold;">Perfumes Normales:</div>`;
            
            normalProducts.forEach(product => {
                receiptHtml += `
                    <div class="product-item">
                        <div class="product-name">${product.name}</div>
                        <div class="product-details">
                            <div>${product.volume} ml - ${product.description}</div>
                            <div>$${product.basePrice.toLocaleString('es-CO')}</div>
                        </div>
                        <div class="product-details">
                            <div>Descuento por envase</div>
                            <div>-$${product.discount.toLocaleString('es-CO')}</div>
                        </div>
                        <div class="product-details" style="font-weight: bold; margin-top: 5px;">
                            <div>Subtotal</div>
                            <div>$${product.finalPrice.toLocaleString('es-CO')}</div>
                        </div>
                    </div>
                `;
                total += product.finalPrice;
            });
        }
        
        // Agregar réplicas
        if (replicaProducts.length > 0) {
            receiptHtml += `<div style="margin-top: 15px; font-weight: bold;">Réplicas (1.1):</div>`;
            
            replicaProducts.forEach(product => {
                receiptHtml += `
                    <div class="product-item">
                        <div class="product-name">${product.name}</div>
                        <div class="product-details">
                            <div>Réplica 1.1</div>
                            <div>$${product.price.toLocaleString('es-CO')}</div>
                        </div>
                    </div>
                `;
                total += product.price;
            });
        }
        
        // Agregar relojes
        if (watchProducts.length > 0) {
            receiptHtml += `<div style="margin-top: 15px; font-weight: bold;">Relojes:</div>`;
            
            watchProducts.forEach(product => {
                receiptHtml += `
                    <div class="product-item">
                        <div class="product-name">${product.name}</div>
                        <div class="product-details">
                            <div>Reloj</div>
                            <div>$${product.price.toLocaleString('es-CO')}</div>
                        </div>
                    </div>
                `;
                total += product.price;
            });
        }
        
        // Calcular domicilio (ahora siempre aplicado si hay dirección)
        const totalProducts = normalProducts.length + replicaProducts.length + watchProducts.length;
        let deliveryMessage = "";
        let deliveryFee = 0;
        
        if (deliveryAddress) {
            if (totalProducts >= 3) {
                deliveryMessage = `<span class="free-delivery">Domicilio GRATIS</span> (3 o más productos)`;
            } else if (totalProducts >= 1) {
                deliveryFee = deliveryCost;
                deliveryMessage = `<span class="paid-delivery">Domicilio: $${deliveryFee.toLocaleString('es-CO')}</span> (1-2 productos)`;
                total += deliveryFee;
            }
            
            if (deliveryMessage) {
                receiptHtml += `
                    <div class="delivery-info">
                        <div class="receipt-row">
                            <div>${deliveryMessage}</div>
                            <div>${deliveryFee > 0 ? `$${deliveryFee.toLocaleString('es-CO')}` : 'GRATIS'}</div>
                        </div>
                    </div>
                `;
            }
        }
        
        receiptHtml += `
            <div class="receipt-row receipt-total">
                <div>TOTAL:</div>
                <div>$${total.toLocaleString('es-CO')}</div>
            </div>
        `;
        
        receiptDetails.innerHTML = receiptHtml;
        downloadPdfBtn.style.display = 'block';
    }
    
    // Generar PDF
    downloadPdfBtn.addEventListener('click', function() {
        generatePDF();
    });
    
    // Manejar envío del formulario
    saleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateReceiptPreview();
    });
    
    // Actualizar vista previa cuando cambien los campos principales
    document.getElementById('client-name').addEventListener('input', updateReceiptPreview);
    document.getElementById('delivery-address').addEventListener('input', updateReceiptPreview);
    saleDateInput.addEventListener('change', updateReceiptPreview);
    
    // Inicializar con un producto normal
    addNormalProductBtn.click();
    
    // Función para generar PDF
    function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', [80, 200]); // Tamaño similar a un recibo Nequi (aumentado para info fiscal)
        
        // Configuración
        doc.setFont('helvetica');
        doc.setFontSize(10);
        
        // Encabezado
        doc.setFillColor(110, 13, 173); // Color morado
        doc.rect(0, 0, 80, 15, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text("CEFIRO PARFUMS", 40, 8, { align: 'center' });
        doc.setFontSize(8);
        doc.text("Recibo de Venta", 40, 12, { align: 'center' });
        
        // Contenido
        let yPosition = 25;
        doc.setTextColor(0, 0, 0);
        
        // Información del cliente
        const clientName = document.getElementById('client-name').value;
        const deliveryAddress = document.getElementById('delivery-address').value;
        const saleDate = saleDateInput.value;
        
        doc.setFontSize(10);
        doc.text(`Cliente: ${clientName}`, 5, yPosition);
        yPosition += 6;
        doc.text(`Fecha: ${formatDate(saleDate)}`, 5, yPosition);
        yPosition += 6;
        
        if (deliveryAddress) {
            doc.text(`Dirección: ${deliveryAddress}`, 5, yPosition);
            yPosition += 8;
        } else {
            yPosition += 4;
        }
        
        let total = 0;
        
        // Agregar productos normales
        if (normalProducts.length > 0) {
            doc.setFontSize(9);
            doc.text("PERFUMES NORMALES:", 5, yPosition);
            yPosition += 5;
            
            normalProducts.forEach(product => {
                // Nombre y volumen
                doc.text(`${product.name} - ${product.volume}ml`, 5, yPosition);
                yPosition += 4;
                
                // Precio base
                doc.text(`$${product.basePrice.toLocaleString('es-CO')}`, 70, yPosition-4, { align: 'right' });
                
                // Descuento (siempre aplicado)
                doc.text(`Desc. envase: -$${product.discount.toLocaleString('es-CO')}`, 10, yPosition);
                yPosition += 4;
                
                // Subtotal
                doc.setFont(undefined, 'bold');
                doc.text(`Subtotal: $${product.finalPrice.toLocaleString('es-CO')}`, 10, yPosition);
                doc.setFont(undefined, 'normal');
                yPosition += 6;
                
                total += product.finalPrice;
            });
        }
        
        // Agregar réplicas
        if (replicaProducts.length > 0) {
            doc.setFontSize(9);
            doc.text("RÉPLICAS (1.1):", 5, yPosition);
            yPosition += 5;
            
            replicaProducts.forEach(product => {
                doc.text(product.name, 5, yPosition);
                doc.text(`$${product.price.toLocaleString('es-CO')}`, 70, yPosition, { align: 'right' });
                yPosition += 5;
                total += product.price;
            });
            
            yPosition += 2;
        }
        
        // Agregar relojes
        if (watchProducts.length > 0) {
            doc.setFontSize(9);
            doc.text("RELOJES:", 5, yPosition);
            yPosition += 5;
            
            watchProducts.forEach(product => {
                doc.text(product.name, 5, yPosition);
                doc.text(`$${product.price.toLocaleString('es-CO')}`, 70, yPosition, { align: 'right' });
                yPosition += 5;
                total += product.price;
            });
            
            yPosition += 2;
        }
        
        // Calcular domicilio (siempre aplicado si hay dirección)
        const totalProducts = normalProducts.length + replicaProducts.length + watchProducts.length;
        let deliveryFee = 0;
        let deliveryText = "";
        
        if (deliveryAddress) {
            if (totalProducts >= 3) {
                deliveryText = "Domicilio: GRATIS (3+ productos)";
            } else if (totalProducts >= 1) {
                deliveryFee = deliveryCost;
                deliveryText = `Domicilio: $${deliveryFee.toLocaleString('es-CO')} (1-2 productos)`;
                total += deliveryFee;
            }
            
            if (deliveryText) {
                doc.text(deliveryText, 5, yPosition);
                yPosition += 5;
            }
        }
        
        // Total
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text("TOTAL:", 5, yPosition);
        doc.text(`$${total.toLocaleString('es-CO')}`, 70, yPosition, { align: 'right' });
        
        // Pie de página
        yPosition += 10;
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text("Gracias por su compra • Vuelva pronto", 40, yPosition, { align: 'center' });
        
        // Información fiscal
        yPosition += 8;
        doc.setFontSize(7);
        doc.setTextColor(80, 80, 80);
        
        doc.text("Razón Social: CEFIRO", 5, yPosition);
        yPosition += 4;
        doc.text("NIT: 1233338468-2", 5, yPosition);
        yPosition += 4;
        doc.text("Dirección: Piedecuesta, Santander", 5, yPosition);
        yPosition += 4;
        doc.text("Teléfono: 310 6197587", 5, yPosition);
        yPosition += 4;
        doc.text("Régimen Tributario: Simplificado", 5, yPosition);
        
        // Guardar PDF
        doc.save(`recibo-cefiro-${Date.now()}.pdf`);
    }
});