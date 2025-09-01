import React, { useEffect, useState, useRef,  } from 'react';
import 'src/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getOrdenesPedido } from '../../services/api';
// Modelo OrdenPedido
import { OrdenPedido } from '../../models/OrdenPedido';
import { Popover } from '@mui/material';

const App = () => {
  const [data, setData] = useState<OrdenPedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [limite, setLimite] = useState(10); // Por defecto 10

  // Estados para búsqueda y filtros
  const [search, setSearch] = useState('');
  const [filtros, setFiltros] = useState({
    cliente: '',
    vendedor: '',
    estado: '',
    fechaDesde: '',
    fechaHasta: ''
  });

  const camposDisponibles = [
    { key: 'cliente', label: 'Cliente' },
    { key: 'vendedor', label: 'Vendedor' },
    { key: 'estado', label: 'Estado' },
    { key: 'fechaDesde', label: 'Fecha Recepción desde' },
    { key: 'fechaHasta', label: 'Fecha Recepción hasta' },
  ];
  const [camposSeleccionados, setCamposSeleccionados] = useState<string[]>([]);
  const [popoverCampos, setPopoverCampos] = useState<null | HTMLElement>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleFilterClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputFocus = (
    event: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>) =>{
      setAnchorEl(event.currentTarget);
  }

  const handlePopoverClose = () =>{
    setAnchorEl(null);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.blur(); // Para evitar que el input mantenga el foco
      }
    }, 0);
  }

  useEffect(() => {
    getOrdenesPedido()
      .then(response => {
        setData(response.data as OrdenPedido[]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener las órdenes de pedido:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando...</div>;

  // Filtrado de datos
  const dataFiltrada = data.filter(op => {
    // Filtro de búsqueda general (en cliente o vendedor)
    const searchLower = search.toLowerCase();
    const matchSearch =
      op.RSocialClt?.toLowerCase().includes(searchLower) ||
      op.IbVdr1?.toLowerCase().includes(searchLower);
    // Filtros avanzados
    const matchCliente = filtros.cliente === '' || (op.RSocialClt?.toLowerCase().includes(filtros.cliente.toLowerCase()));
    const matchVendedor = filtros.vendedor === '' || (op.IbVdr1?.toLowerCase().includes(filtros.vendedor.toLowerCase()));
    const matchEstado = filtros.estado === '' || ((filtros.estado === 'activo' && op.Estado) || (filtros.estado === 'inactivo' && !op.Estado));
    const matchFechaDesde = filtros.fechaDesde === '' || (op.FecRecep && op.FecRecep >= filtros.fechaDesde);
    const matchFechaHasta = filtros.fechaHasta === '' || (op.FecRecep && op.FecRecep <= filtros.fechaHasta);
    return matchSearch && matchCliente && matchVendedor && matchEstado && matchFechaDesde && matchFechaHasta;
  });

  return (
    <>
      <div>
        <h1 style={{
          textAlign: 'center',
          color: 'white',
          fontSize: '30px',
          margin: '20px 0',
          padding: '10px',
          backgroundColor: 'rgb(0, 47, 255)',
          borderRadius: '50px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }}>Buscar Registro / ORDEN PEDIDO</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <input
            ref={inputRef}
            style={{
              backgroundColor: 'rgba(127, 227, 245, 0.5)',
              color: 'darkblue',
              width: '100%',
              padding: '15px',
              borderRadius: '10px',
              border: '3px solid darkblue',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              fontSize: '16px',
            }}
            placeholder="Buscar por Cliente o Vendedor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClick={handleInputFocus}
            // onClick={handleSearchFocus}
          />

          <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              PaperProps={{
                sx: { p: 2, minWidth: 500, maxWidth: 400 }
              }}
            >
              <div style={{ padding: '20px', width: '465px' }}>
                <h5>Filtros Avanzados</h5>
                {/* --- POPOVER FILTROS A ALEGIR --- */}
                <button
                  className="btn btn-link"
                  style={{ textDecoration: 'underline', color: '#1976d2', fontWeight: 500 }}
                  onClick={e => setPopoverCampos(e.currentTarget)}
                >
                  Agregar filtros
                </button>
                {/* Botón para restaurar filtros por defecto */}
                <button
                  className="btn btn-link"
                  style={{ textDecoration: 'underline', color: '#888', fontWeight: 500, padding: 0 }}
                  onClick={() => {
                    setCamposSeleccionados([]);
                    setFiltros({ cliente: '', vendedor: '', estado: '', fechaDesde: '', fechaHasta: '' });
                  }}
                >
                  Restaurar filtros
                </button>
                <Popover
                  open={Boolean(popoverCampos)}
                  anchorEl={popoverCampos}
                  onClose={() => setPopoverCampos(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                  <div style={{ padding: 16, minWidth: 200 }}>
                    <strong>Selecciona campos:</strong>
                    {camposDisponibles.map(campo => (
                      <div key={campo.key}>
                        <label>
                          <input
                            type="checkbox"
                            checked={camposSeleccionados.includes(campo.key)}
                            onChange={e => {
                              if (e.target.checked) {
                                setCamposSeleccionados([...camposSeleccionados, campo.key]);
                              } else {
                                setCamposSeleccionados(camposSeleccionados.filter(k => k !== campo.key));
                              }
                            }}
                          />
                          {campo.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </Popover>
                {/* --- FIN FILTROS A ELEGIR --- */}
                <div className="form-group" style={{ marginTop: '10px' }}>
                  {camposSeleccionados.includes('cliente') && (
                    <>
                      <label>Cliente:</label>
                      <input type="text" className="form-control" value={filtros.cliente} onChange={e => setFiltros({ ...filtros, cliente: e.target.value })} />
                    </>
                  )}
                  {camposSeleccionados.includes('vendedor') && (
                    <>
                      <label>Vendedor:</label>
                      <input type="text" className="form-control" value={filtros.vendedor} onChange={e => setFiltros({ ...filtros, vendedor: e.target.value })} />
                    </>
                  )}
                  {camposSeleccionados.includes('estado') && (
                    <>
                      <label>Estado:</label>
                      <select className="form-control" value={filtros.estado} onChange={e => setFiltros({ ...filtros, estado: e.target.value })}>
                        <option value="">Todos</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </>
                  )}
                  {camposSeleccionados.includes('fechaDesde') && (
                    <>
                      <label>Fecha Recepción desde:</label>
                      <input type="date" className="form-control" value={filtros.fechaDesde} onChange={e => setFiltros({ ...filtros, fechaDesde: e.target.value })} />
                    </>
                  )}
                  {camposSeleccionados.includes('fechaHasta') && (
                    <>
                      <label>Fecha Recepción hasta:</label>
                      <input type="date" className="form-control" value={filtros.fechaHasta} onChange={e => setFiltros({ ...filtros, fechaHasta: e.target.value })} />
                    </>
                  )}
                </div>
                <div style={{ marginTop:20, display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button className="btn btn-primary" onClick={handleFilterClose}>Aplicar</button>{' '}
                  <button className="btn btn-secondary" onClick={() => { setFiltros({ cliente: '', vendedor: '', estado: '', fechaDesde: '', fechaHasta: '' }); }}>Limpiar</button>
                </div>
              </div>
            </Popover>
        </div>
      </div>

      <label>
        Mostrar&nbsp;
        <select value={limite} onChange={e => setLimite(Number(e.target.value))}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        &nbsp;registros.
      </label>
      <div className="App"
      style={{ overflowX: 'auto', marginLeft: '0px' }}>
        <br />
        <table className="table table-bordered"
          style={{
          width: "200%",
          fontSize: "14px",
          tableLayout: "auto",
        }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Cliente Final</th>
              <th>Cliente Proveedor</th>
              <th>Fecha Recepcion</th>
              <th>Fecha Inicio</th>
              <th>Fecha Procesamiento VI</th>
              <th>Forma de Pago</th>
              <th>Moneda</th>
              <th>Total sin IGV</th>
              {/* <th>N° Documento</th> */}
              <th>Vendedor</th>
              <th>Activo</th>
              <th className='sticky-col'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataFiltrada.length === 0 ? (
              <tr>
                <td colSpan={13} style={{ textAlign: 'left', color: '#000', fontStyle: 'italic', fontSize: 15, padding: '30px' }}>
                  No se encontraron registros.
                </td>
              </tr>
            ) : (
              dataFiltrada.slice(0, limite).map((op,idx) => (
                <tr key={`${op.IdOpci}-${idx}`}>
                  <td>{op.IdOpci}</td>
                  <td>{op.RSocialClt}</td>
                  <td>{op.IbCltFin}</td>
                  <td>{op.IbCltPrv}</td>
                  <td>{op.FecRecep?.substring(0, 10)}</td>
                  <td>{op.FecInicio?.substring(0, 10)}</td>
                  <td>{op.FecProcVi?.substring(0, 10)}</td>
                  <td>{op.FormaPago?.NombreFormaPago ?? ''}</td>
                  <td>{op.Moneda?.NombreMoneda ?? ''}</td>
                  <td>{op.TotalSinIgv}</td>
                  {/* <td>{op.NumDocVendedor}</td> */}
                  <td>{op.IbVdr1}</td>
                  <td>{op.Estado ? 'Activo' : 'Inactivo'}</td>
                  <td className='sticky-col'>
                    <button className="btn btn-primary">Editar</button>{' '}
                    <button className="btn btn-danger">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
