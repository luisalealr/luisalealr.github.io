import { Link, useNavigate } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { FiArchive } from "react-icons/fi";
import { TbReceiptDollar } from "react-icons/tb";
import { HiMiniArrowPathRoundedSquare } from "react-icons/hi2";
import { LiaUserTieSolid } from "react-icons/lia";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import { logoutApi } from "../../../services/UsuarioService";
import { toast } from "react-toastify";
import Alerta from "../../Alerta";
import { getProducts } from "../../../services/ProductService";
import TablaAlerta from "../../TablaAlerta";
import { useAuth } from "../../AuthProvider";

export default function SideBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [alertaOpen, setAlertaOpen] = useState(false);
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [productosOpen, setProductosOpen] = useState(false);
    const { logout } = useAuth();

    const handleLogout = () => {
        logoutApi();
        toast.success('Sesión cerrada exitosamente');
        logout(); // Usa el contexto de autenticación
        window.history.replaceState(null, '', '/nueva_esperanza/');
        navigate('/login');
    };

    const mostrarProductosFaltantes = () => {
        setProductosOpen(!productosOpen);
    }

    useEffect(() => {
        mostrarAlerta();
      }, []);

    const mostrarAlerta = async () => {
        const productosArray = await getProducts();
        const productosFaltantes = [];
        if (productosArray) {
            for (const producto of productosArray) {
                if (producto.cantidad <= 5) {
                    setAlertaOpen(true);
                    productosFaltantes.push(producto);
                }
            }
        }
        setProductos(productosFaltantes);
    };

    return <>
        <div className="flex flex-col bg-[#D9D9D9] w-[16rem] h-screen ">
            <div className="flex flex-row h-[70px] max-w-fit mx-3 items-center my-3">
                <img className="bg-white h-14 w-14 rounded-full mr-2 object-contain" src="/nueva_esperanza/img/logo.png" alt="" />
                <div className="flex flex-col">
                    <h5 className="font-semibold">Droguería</h5>
                    <h5 className="font-semibold">La Nueva Esperanza</h5>
                </div>
            </div>
            <hr className="mb-1 border-[#1e1e1e63]" />
            <div className="flex-1 overflow-y-auto">
                <ul className="list-none py-[1rem] px-[2rem]">
                    <li className="mb-[10px] p-2 rounded-md hover:bg-[#8DB600] transition-colors duration-300">
                        <Link className="flex flex-row items-center" to="/Inicio"><FiHome className="mr-4 text-xl" /> Inicio</Link>
                    </li>
                    <li className="mb-[10px] p-2 rounded-md hover:bg-[#8DB600] transition-colors duration-300">
                        <Link className="flex flex-row items-center" to="/ver_ventas"><TbReceiptDollar className="mr-4 text-xl" />Ventas</Link>
                    </li>
                    <li className="flex flex-col">
                        <div className="flex flex-row mb-[10px] p-2 rounded-md hover:bg-[#8DB600] transition-colors duration-300">
                            <Link onClick={() => setIsOpen(!isOpen)} className="flex flex-row items-center  w-full" to="">
                                <div className="flex-1 flex-row flex">
                                    <FiArchive className="mr-4 text-xl" />Inventario
                                </div>
                                <IoIosArrowForward className={`mr-4 text-xl transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
                            </Link>
                        </div>
                        <ul className={`mx-2 ml-2 bg-[#fffcfca8] rounded-md transition-max-height duration-500 ease-in-out overflow-hidden ${isOpen ? "max-h-96" : "max-h-0"}`}>
                            <li className="py-[10px] px-[20px] flex flex-row hover:bg-[#6aa7e038] transition-colors duration-300">
                                <Link className="flex flex-row items-center" to="/ver_categorias"><IoIosArrowForward className="mr-4 text-xl" />Categorías</Link>
                            </li >
                            <li className="py-[10px] px-[20px] flex flex-row hover:bg-[#6aa7e038] transition-colors duration-300">
                                <Link className="flex flex-row items-center" to="/listar_proveedores"><IoIosArrowForward className="mr-4 text-xl" />Proveedores</Link>
                            </li>
                            <li className="py-[10px] px-[20px] flex flex-row hover:bg-[#6aa7e038] transition-colors duration-300">
                                <Link className="flex flex-row items-center" to="/listar_productos"><IoIosArrowForward className="mr-4 text-xl" />Productos</Link>
                            </li>
                        </ul>
                    </li> 
                </ul>
            </div>
            {alertaOpen && (
                <div onClick={mostrarProductosFaltantes} className="cursor-pointer w-full h-auto">
                    <Alerta></Alerta>
                </div>
            )}
            <hr className="mb-4 border-[#1e1e1e63]" />
            <div className="flex flex-row h-[70px] max-w-fit mx-3 items-center mb-3 ">
                <div className="bg-white h-14 w-14 rounded-full mr-2 flex justify-center items-center">
                    <LiaUserTieSolid className="text-6xl" />
                </div>
                <div className="flex flex-col">
                    <h5 className="font-semibold">Administrador</h5>
                    <button onClick={handleLogout}><HiMiniArrowPathRoundedSquare className="text-2xl" /></button>
                </div>
            </div>
            {productosOpen && (
                <TablaAlerta
                    mostrar={mostrarProductosFaltantes}
                    productos={productos}
                />
            )}
        </div>
    </>
}