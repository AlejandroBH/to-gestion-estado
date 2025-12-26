import { useState, useEffect } from "react";
import { getProducts, toggleFavorite } from "../services/api";
import ProductList from "../components/common/ProductList";
import CreateProductModal from "../components/common/CreateProductModal";
import "../styles/products.css";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data, fromCache } = await getProducts();
                setProducts(data);

                // Mostrar en consola si los datos vienen del cache
                if (fromCache) {
                    console.log("📦 Productos cargados desde cache");
                } else {
                    console.log("🌐 Productos cargados desde servidor");
                }
            } catch (err) {
                setError("Error al cargar los productos", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleFavorite = async (id) => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Debes iniciar sesión para marcar productos como favoritos');
            window.location.href = '/login';
            return;
        }

        try {
            const response = await toggleFavorite(id);
            setProducts(products.map((product) => (product.id === id ? response.data : product)));
        } catch (err) {
            console.error("Error al marcar como favorito:", err);
            if (err.response && err.response.status === 401) {
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
    };

    const handleCreateProduct = () => {
        if (!isLoggedIn) {
            alert('Debes iniciar sesión para crear un nuevo producto');
            window.location.href = '/login';
            return;
        }

        setIsModalOpen(true);
    };

    const handleProductCreated = (newProduct) => {
        setProducts([newProduct, ...products]);
    };

    if (loading) return (
        <div className="products-page">
            <div className="loading-container">Cargando productos...</div>
        </div>
    );

    if (error) return (
        <div className="products-page">
            <div className="error-container">{error}</div>
        </div>
    );

    return (
        <div className="products-page">
            <div className="products-header">
                <h1 className="products-title">Productos</h1>
                <button
                    className={`create-product-button ${!isLoggedIn ? 'disabled' : ''}`}
                    onClick={handleCreateProduct}
                    disabled={!isLoggedIn}
                    title={!isLoggedIn ? 'Debes iniciar sesión para crear un producto' : 'Crear nuevo producto'}
                >
                    <span className="button-icon">✨</span>
                    <span className="button-text">Crear Nuevo Producto</span>
                </button>
            </div>
            <ProductList products={products} onFavorite={handleFavorite} />

            <CreateProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProductCreated={handleProductCreated}
            />
        </div>
    );
};

export default ProductsPage;
