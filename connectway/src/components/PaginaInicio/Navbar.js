import React from 'react';
import '../../estilos/PaginaInicio/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">CONNECTWAY</div>
            <ul className="nav-links">
                <li><a href="/">Inicio</a></li>
                <li className="dropdown">
                    <a href="/audiolibros" className="dropbtn">Audiolibros</a>
                    <div className="dropdown-content">
                        <a href="/audiolibros/añadir">Añadir audiolibro</a>
                        <a href="/audiolibros/registrados">Audiolibros registrados</a>
                    </div>
                </li>
                <li><a href="/comunidad">Comunidad</a></li>
                <li><a href="/actividad">Mi actividad</a></li>
                <li><a href="/perfil">Perfil</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
