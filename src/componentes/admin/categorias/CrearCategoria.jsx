import { useEffect, useState } from "react";
import TemplateAdmin from "../templates/TemplateAdmin";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from "../../../config";

// Función para normalizar cadenas de texto eliminando signos diacríticos
const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const CrearCategoria = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener todas las categorías existentes
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
                toast.error(`Error al obtener las categorías: ${error.message}`, { autoClose: 1500 });
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedCategoryName = categoryName.trim(); // Trim espacios en blanco
        const normalizedCategoryName = normalizeString(trimmedCategoryName); // Normalizar el nombre de la categoría

        // Verificar si la categoría ya existe
        const existingCategory = categories.find(category => normalizeString(category.descripcion) === normalizedCategoryName);

        if (existingCategory) {
            if (existingCategory.isActive === 0) {
                // Habilitar la categoría si está deshabilitada
                try {
                    await axios.put(`${API_URL}/categories/${existingCategory.id_categoria}`, {
                        isActive: 1
                    });
                    toast.success('Categoría habilitada correctamente', { autoClose: 1500 });
                    // Actualizar la lista de categorías
                    const updatedCategories = categories.map(category =>
                        category.id_categoria === existingCategory.id_categoria
                            ? { ...category, isActive: 1 }
                            : category
                    );
                    setCategories(updatedCategories);
                    navigate('/ver_categorias', { state: { message: 'Categoría habilitada correctamente' } });
                } catch (error) {
                    toast.error('Error al habilitar la categoría: ' + (error.response?.data?.message || error.message), { autoClose: 1500 });
                }
            } else {
                toast.error('La categoría ya existe', { autoClose: 1500 });
            }
            return;
        }

        try {
            await axios.post(
                `${API_URL}/categories`,
                {
                    descripcion: trimmedCategoryName,
                    isActive: 1
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            navigate('/ver_categorias', { state: { message: 'Categoría guardada correctamente' } });
        } catch (error) {
            toast.error('Error al guardar la categoría: ' + (error.response?.data?.message || error.message), { autoClose: 1500 });
        }
    };

    const handleCancel = () => {
        navigate('/ver_categorias');
        setCategoryName('');
    };

    return (
        <TemplateAdmin>
            <ToastContainer />
            <div className="bg-[#D0F25E]">
                <h1 className="ml-5 py-3 font-bold text-black text-xl w-full">
                    Crear Categoría
                </h1>
            </div>
            <div className="flex flex-col mt-4 ml-5">
                <form onSubmit={handleSubmit} className="w-full max-w-lg mt-10">
                    <div className="mb-4 flex items-center">
                        <label htmlFor="categoryName" className="ml-10 mr-2 font-bold w-40">
                            Nombre de la categoría:
                        </label>
                        <input
                            id="categoryName"
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="Escriba el nombre de la nueva categoría"
                            className="border border-gray-300 p-2 rounded-md flex-grow"
                        />
                    </div>
                    <div className="flex m-10">
                        <button
                            type="submit"
                            className="bg-[#8DB600] text-black py-2 px-4 rounded-full"
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-[#8DB600] mx-6 text-black py-2 px-4 rounded-full"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </TemplateAdmin>
    );
};

export default CrearCategoria;
