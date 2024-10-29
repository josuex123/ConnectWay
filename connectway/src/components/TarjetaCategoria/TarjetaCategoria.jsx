// TarjetaCategoria.jsx
import React from 'react';
import '../../estilos/TarjetaCategoria/TarjetaCategoria.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const TarjetaCategoria = ({ nombreCategoria, icono, onClick, seleccionado }) => { 
    return (
        <div className={`contenedor-cats ${seleccionado ? 'seleccionado' : ''}`}
        onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className="card-body-cats">
                {/* Renderizamos el icono JSX en lugar de usarlo como clase */}
                
                <p className="nombre-categoria" >{icono}  {nombreCategoria}</p>
            </div>
        </div>
    );
};

export default TarjetaCategoria;
