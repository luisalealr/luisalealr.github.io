import { useEffect, useState } from "react";
import TemplateAdmin from "../templates/TemplateAdmin";
import { IoSearch } from "react-icons/io5";
import { getAllCategorias } from "../../../services/CategoriaService";
import TablaCategorias from "./TablaCategorias";
import { useNavigate } from "react-router-dom";

const ListarCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [buscarDesc, setBuscarDec] = useState('');
  const navigate = useNavigate();

  const crearCategoria = () => {
    navigate('/registrar_categoria');
  };

  useEffect(() => {
    getAllCategorias().then(data => {
      if (data && Array.isArray(data)) {
        const filteredData = data.filter(categoria => categoria.isActive == 1);
        setCategorias(filteredData);
      } else {
        console.error('Data no es un array');
      }
    }).catch(error => {
      console.error('Error al obtener las categorías:', error);
    });
  }, []);

  const buscador = (e) => {
    setBuscarDec(e.target.value);
  }

  let results = []
  if (!buscarDesc) {
    results = categorias;
  } else {
    results = categorias.filter((dato) =>
      dato.descripcion.toLowerCase().includes(buscarDesc.toLocaleLowerCase())
    )
  }

  return <>
    <TemplateAdmin>
      <div className="flex flex-col">
        <div className="bg-[#D0F25E]">
          <h2 className="py-2 px-6 font-semibold text-xl">Categorías</h2>
        </div>
        <div className="w-full h-16 flex items-center justify-between">
          <div className="w-[30%] shadow-sm border border-[#999999] rounded-md flex flex-row items-center ml-6">
            <IoSearch color="rgba(141, 182, 0, 0.79)" fontSize={25} className="m-1" />
            <input
              value={buscarDesc}
              onChange={buscador}
              type="text" placeholder="Buscar categoría"
              className="w-full text-sm h-8 border-none rounded-md"
            />
          </div>
          <button onClick={crearCategoria} className="mr-6 py-1 rounded-md px-6 shadow hover:bg-[#b0d144] bg-[#8DB600]">Registrar Categoría</button>
        </div>
        <div className="bg-[#D0F25E] h-6 w-full"></div>
        <table>
          <thead className="bg-[#95A09D] text-left ">
            <tr>
              <th className="pl-5">N° de la categoría</th>
              <th>Descripcion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {results.map((categoria, index) => (
              <TablaCategorias
                key={index}
                categoriaId={categoria.id_categoria}
                descripcion={categoria.descripcion}
              />
            ))}
          </tbody>
        </table>
      </div>
    </TemplateAdmin>
  </>
}

export default ListarCategorias;