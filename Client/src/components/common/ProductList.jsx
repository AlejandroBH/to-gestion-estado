const ProductList = ({ products, onFavorite }) => {
    return (
        <div className="products-container">
            {products.length === 0 ? (
                <div className="loading-container">
                    <p>No hay productos disponibles.</p>
                </div>
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-header">
                                <h3 className="product-name">{product.name}</h3>
                                <span className="product-category">{product.category}</span>
                            </div>
                            <p className="product-description">{product.description}</p>
                            <div className="product-details">
                                <div className="product-price">
                                    <span className="price-label">Precio:</span>
                                    <span className="price-value">${product.price.toFixed(2)}</span>
                                </div>
                                <div className="product-stock">
                                    <span className="stock-label">Stock:</span>
                                    <span className={`stock-value ${product.stock < 10 ? 'low-stock' : ''}`}>
                                        {product.stock} unidades
                                    </span>
                                </div>
                            </div>
                            <div className="product-footer">
                                <span className="product-date">
                                    {new Date(product.createdAt).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                                <div className="product-actions">
                                    <span className="favorite-count">❤️ {product.favorites}</span>
                                    <button className="favorite-button" onClick={() => onFavorite(product.id)}>
                                        Favorito
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
