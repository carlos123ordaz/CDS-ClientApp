import React, { useState } from 'react';
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Autocomplete,
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


import { getVendedores } from '../../../services/api';
import { getClientes } from '../../../services/api';
import { getFormaPago } from '../../../services/api';
import { getMonedas } from '../../../services/api';
import BaseCard from '../../../components/BaseCard/BaseCard';
import api from '../../../services/api';
import { Dayjs } from 'dayjs';
import axios from 'axios';

// Define FormData interface here if not imported
export interface FormData {
  cliente: string;
  IbCltFin: string;
  IbCltPrv: string;
  FecRecep: string;
  FecInicio: string;
  FecProcVi: string;
  FormaPago: string;
  Moneda: string;
  TotalSinIgv: string;
  vendedor: string;
  IbVdr1: string;
  IbVdr2: string;
  lider: string;
  numOp: string;
  numRefCliente: string;
  ubrutaCoti: string;
  comisionCompartida: boolean;
}

// Define Vendedor interface if not imported
export interface Vendedor {
  idVendedor: string;
  nombreVendedor: string;
  ibLider: boolean | number;
}

// Define Clientes interface if not imported
export interface Clientes {
  idCliente: string;
  razonSocial: string;
  numDocumento: string;
}

// Define FormaPago interface if not imported
export interface FormaPago {
  idFp: string;
  descripcionFp: string;
}

// Define Monedas interface if not imported
export interface Monedas {
  idMda: string;
  nombre: string;
}

// Mostrar la URL base que está usando el front
console.log('URL que está usando el front:', api.defaults.baseURL);

const FbDefaultForm = () => {

  // Estado para vendedores
  const [vendedores, setVendedores] = React.useState<Vendedor[]>([]);
  // Estado para clientes
  const [clientes, setClientes] = React.useState<Clientes[]>([]);
  // Estado para forma de pago
  const [formaPago, setFormaPago] = React.useState<FormaPago[]>([]);
  // Estado para monedas
  const [monedas, setMonedas] = React.useState<Monedas[]>([]);

  // Estado para manejar la carga y errores
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Guarda el estado del pedido
  const [pedido, setPedido] = useState({
    cliente: '',
    clienteFinal: '',
    clienteProveedor: '',
    // fechaRecepcion: '',
    // fechaInicio: '',
    // fechaProcesamientoVI: '',
    fechaRecepcion: null as Dayjs | null,
    fechaInicio: null as Dayjs | null,
    fechaProcesamientoVI: null as Dayjs | null,
    formaPago: '',
    moneda: '',
    totalSinIGV: '',
    vendedor: '',
    vendedor1: '',
    vendedor2: '',
    lider: '',
    nroOperacion: '',
    nroReferenciaCliente: '',
    ubrutaCotizacion: '',
    comisionCompartida: false,
  });

// Filtra los clientes unicos por idCliente
const clientesUnicos = React.useMemo(() => {
  const seen = new Set();
  return clientes
    .filter(c => !!c.razonSocial && c.razonSocial.trim() !== '')
    .filter(c => {
      if (seen.has(c.razonSocial)) return false;
      seen.add(c.razonSocial);
      return true;
  });
}, [clientes]);

// Maneja el cambio de los campos del formulario
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const target = e.target as HTMLInputElement;
  const { name, value, type, checked } = target;
  setPedido((prev: typeof pedido) => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }));
};

const lideres = vendedores.filter(v => v.ibLider === true || v.ibLider === 1);

// Guarda orden pedido
const guardarPedido = async () => {
  const datosParaEnviar = {
    // ...pedido, // Copia todos los campos del estado
    // Sobrescribe con los nombres y valores que espera el back:
    IdFp: pedido.formaPago ? Number(pedido.formaPago) : null,
    IdClt: pedido.cliente ? Number(pedido.cliente) : null,
    IdVdr: pedido.vendedor ? Number(pedido.vendedor) : null,
    FecRecep: pedido.fechaRecepcion ? pedido.fechaRecepcion.format('YYYY-MM-DD') : null,
    FecInicio: pedido.fechaInicio ? pedido.fechaInicio.format('YYYY-MM-DD') : null,
    FecProcVi: pedido.fechaProcesamientoVI ? pedido.fechaProcesamientoVI.format('YYYY-MM-DD') : null,
    RSocialClt: clientes.find(c => c.idCliente === pedido.cliente)?.razonSocial || null,
    NumOp: pedido.nroOperacion || null,
    IdMda: pedido.moneda ? Number(pedido.moneda) : null,
    TotalSinIgv: pedido.totalSinIGV ? Number(pedido.totalSinIGV) : null,
    NumRefCliente: pedido.nroReferenciaCliente || null,
    IbCltFin: clientes.find(c => c.idCliente === pedido.clienteFinal)?.razonSocial || null,
    IbCltPrv: clientes.find(c => c.idCliente === pedido.clienteProveedor)?.razonSocial || null,
    IbVdr1: vendedores.find(v => v.idVendedor === pedido.vendedor1)?.nombreVendedor || null,
    IbVdr2: vendedores.find(v => v.idVendedor === pedido.vendedor2)?.nombreVendedor || null,
    Lider: vendedores.find(v => v.idVendedor === pedido.lider)?.nombreVendedor || null,
    UbrutaCoti: pedido.ubrutaCotizacion || null,
    ComisionCompartida: pedido.comisionCompartida,
  };
  try {
    await axios.post('https://localhost:7002/OrdenPedido', datosParaEnviar);
    alert('Pedido guardado correctamente');
  } catch (error) {
    alert('Error al guardar el pedido');
    console.error(error);
  }
};

  // Obtener vendedores al cargar componente
React.useEffect(() => {
  getVendedores()
      .then((res) => {setVendedores(res.data as Vendedor[]);
      console.log('Vendedores:', res.data);
      })
      .catch((err) => {
        console.error('Error al obtener vendedores:', err);
        setError('Error al cargar los vendedores. Por favor, intente nuevamente.');
        setLoading(false);
      });
  }, []);

  // Obtener clientes al cargar componente
  React.useEffect(() => {
    getClientes()
      .then((res) => setClientes(res.data as Clientes[]))
      .catch((err) => {
        console.error('Error al obtener clientes:', err);
        setError('Error al cargar los clientes. Por favor, intente nuevamente.');
        setLoading(false);
      });
  }, []);

  // Obtener forma de pago al cargar componente
  React.useEffect(() => {
    getFormaPago()
      .then((res) => setFormaPago(res.data as FormaPago[]))
      .catch((err) => {
      console.error('Error al obtener forma de pago:', err);
      setError('Error al cargar las formas de pago. Por favor, intente nuevamente.');
      setLoading(false);
      });
  }, []);

  // Obtener monedas al cargar componente
    React.useEffect(() => {
    getMonedas()
      .then((res) => setMonedas(res.data as Monedas[]))
      .catch((err) => {
      console.error('Error al obtener monedas:', err);
      setError('Error al cargar las monedas. Por favor, intente nuevamente.');
      setLoading(false);
      });
  }, []);

  /*
  const handleFormChange = (event: any) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  */

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Datos del formulario:', pedido);
    alert('Formulario enviado correctamente. Revisa la consola para ver los datos.');
  };

  return (
    <div>
      {/* ------------------------------------------------------------------------------------------------ */}
      {/* Basic Checkbox */}
      {/* ------------------------------------------------------------------------------------------------ */}

        <BaseCard title="REGISTRO DE PEDIDOS">

        <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 4, mb: 1 }}>

          {/* CAMPO CLIENTE COMO AUTOCOMPLETE */}
          <Autocomplete
            id="autocomplete-cliente"
            options={clientesUnicos}
            getOptionLabel={(option) => option.razonSocial}
            // getOptionLabel={(option) =>
            //   option.razonSocial
            //     ?`${option.razonSocial} (${option.numDocumento}) || ${option.numDocumento}`
            //     : option.numDocumento || option.razonSocial || ''
            // }
            isOptionEqualToValue={(option, value) => option.idCliente === value.idCliente}
            value={clientes.find(c => c.idCliente === pedido.cliente) || null}
            onChange={(_event, newValue) => {
              if (newValue) {
                setPedido(prev => ({
                  ...prev,
                  cliente: newValue.idCliente,
                  clienteFinal: newValue.idCliente,
                  clienteProveedor: newValue.idCliente
                }));
              } else {
                setPedido(prev => ({
                  ...prev,
                  cliente: ''
                }));
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente"
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  style: { fontSize: '13px' },
                }}
                InputLabelProps={{ style: { fontSize: '13px' } }}
                sx={{ mb: 2, minWidth: 220 }}
                helperText={error ? error : ''}
                error={!!error}
              />
            )}
            sx={{ width: 250, fontSize: '13px' }}
            ListboxProps={{ style: { fontSize: '13px', maxHeight: 200 } }}
            disabled={loading}
          />

          {/* CAMPO CLIENTE FINAL Y CLIENTE PROVEEDOR COMO AUTOCOMPLETE */}
          {/* Estos campos se llenan automáticamente al seleccionar un cliente */}
          <Autocomplete
            id='autocomplete-cliente-final'
            options={clientesUnicos}
            getOptionLabel={(option) => option.razonSocial || ''}
            // getOptionLabel={(option) =>
            //   option.razonSocial
            //     ?`${option.razonSocial} (${option.numDocumento}) || ${option.numDocumento}`
            //     : option.numDocumento || option.razonSocial || ''
            // }
            isOptionEqualToValue={(option, value) => option.idCliente === value.idCliente}
            value={clientes.find(c => c.idCliente === pedido.clienteFinal) || null}
            onChange={(_event, newValue) => setPedido(prev => ({ ...prev, clienteFinal: newValue ? newValue.idCliente : '' }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente Final"
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  style: { fontSize: '13px' },
                }}
                InputLabelProps={{ style: { fontSize: '13px' } }}
                sx={{ mb: 2, minWidth: 220, fontSize: '13px' }}
              />
            )}
            sx={{ width: 250, fontSize: '13px' }}
            ListboxProps={{ style: { fontSize: '13px', maxHeight: 200 } }}
            disabled={loading}
          />

          <Autocomplete
            id='autocomplete-cliente-proveedor'
            options={clientesUnicos}
            getOptionLabel={(option) => option.razonSocial || ''}
            // getOptionLabel={(option) =>
            //   option.razonSocial
            //     ?`${option.razonSocial} (${option.numDocumento}) || ${option.numDocumento}`
            //     : option.numDocumento || option.razonSocial || ''
            // }
            isOptionEqualToValue={(option, value) => option.idCliente === value.idCliente}
            value={clientes.find(c => c.idCliente === pedido.clienteProveedor) || null}
            onChange={(_event, newValue) => setPedido(prev => ({ ...prev, clienteProveedor: newValue ? newValue.idCliente : '' }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente Proveedor"
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  style: { fontSize: '13px' },
                }}
                InputLabelProps={{ style: { fontSize: '13px' } }}
                sx={{ mb: 2, minWidth: 220, fontSize: '13px' }}
              />
            )}
            sx={{ width: 250, fontSize: '13px' }}
            ListboxProps={{ style: { fontSize: '13px', maxHeight: 200 } }}
            disabled={loading}
          />

        </Box>
        <Box sx={{ display: 'flex', gap: 4, mb: 1 }}>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha de Recepción"
                value={pedido.fechaRecepcion}
                onChange={(newValue) => setPedido(prev => ({ ...prev, fechaRecepcion: newValue }))}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { fontSize: '13px', minWidth: 250 }
                  }
                }}
                sx={{ mb: 2, fontSize: '13px', minWidth: 250 }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha de Inicio"
                value={pedido.fechaInicio}
                onChange={(newValue) => setPedido(prev => ({ ...prev, fechaInicio: newValue }))}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { fontSize: '13px', minWidth: 250 }
                  }
                }}
                sx={{ mb: 2, fontSize: '13px', minWidth: 250 }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha de Procesamiento VI"
                value={pedido.fechaProcesamientoVI}
                onChange={(newValue) => setPedido(prev =>({ ...prev, fechaProcesamientoVI: newValue}))}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { fontSize: '13px', minWidth: 250 }
                  }
                }}
                sx={{ mb: 2, fontSize: '13px', minWidth: 250 }}
              />
            </LocalizationProvider>

        </Box>

        <Box sx={{ display: 'flex', gap: 4, mb: 1 }}>
          {/* CAMPO FORMA DE PAGO COMO AUTOCOMPLETE */}
          <Autocomplete
            id="autocomplete-forma-pago"
            options={formaPago}
            getOptionLabel={(option) => option.descripcionFp}
            value={formaPago.find(fp => fp.idFp === pedido.formaPago) || null}
            onChange={(_event, newValue) => setPedido(prev => ({ ...prev, formaPago: newValue ? newValue.idFp : '' }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Forma de Pago"
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  style: { fontSize: '13px' },
                }}
                InputLabelProps={{ style: { fontSize: '13px' } }}
                sx={{ mb: 2, minWidth: 220 }}
              />
            )}
            sx={{ width: 250, fontSize: '13px' }}
            ListboxProps={{ style: { fontSize: '13px', maxHeight: 200 } }}
            disabled={loading}
          />

          {/* CAMPO MONEDA SOLO SÍMBOLO */}
          <Autocomplete
            id='autocomplete-moneda'
            options={monedas}
            getOptionLabel={(option) => {
              let simbolo = '';
              switch ((option.nombre || '').toUpperCase()) {
                case 'SOLES': simbolo = 'S/'; break;
                case 'DOLARES AMERICANOS': simbolo = '$'; break;
                case 'EURO': simbolo = '€'; break;
                case 'YEN': simbolo = '¥'; break;
                default: simbolo = option.nombre;
              }
              return simbolo;
            }}
            value={monedas.find(m => m.idMda === pedido.moneda) || null}
            onChange={(_event, newValue) => setPedido(prev => ({ ...prev, moneda: newValue ? newValue.idMda : '' }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Moneda"
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  style: { fontSize: '13px' },
                }}
                InputLabelProps={{ style: { fontSize: '13px' } }}
                sx={{ mb: 2, minWidth: 220 }}
              />
            )}
            sx={{ width: 250, fontSize: '13px' }}
            ListboxProps={{ style: { fontSize: '13px', maxHeight: 200 } }}
            disabled={loading}
            // clearOnEscape // Permite limpiar el campo con Escape
          />

          <TextField
            id="total-sin-igv"
            label="Total sin IGV"
            variant="outlined"
            name="totalSinIGV"
            value={pedido.totalSinIGV}
            onChange={e => {
              let value = e.target.value;
              if (value.includes ('.')) {
                const [entero, decimales] = value.split('.');
                value = entero + '.' + (decimales || '').slice(0, 2);
              }
              setPedido(prev => ({ ...prev, totalSinIGV: value }));
            }}
            // fullWidth
            size='small'
            type='number'
            inputProps={{ step: '0.01', min: '0', style: { MozAppearance: 'textfield'}
             }}
            sx={{
              mb: 2, fontSize: '13px', minWidth: 250,
              // Estilos para eliminar flechas en campos numéricos
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              // Oculta flechas en Firefox
              '& input[type=number]': {
                MozAppearance: 'textfield',
              },
            }}
          />

        </Box>

        <Box sx={{ display: 'flex', gap: 4, mb: 1 }}>
          {/* Vendedor 1 */}
          <Autocomplete
            id="autocomplete-vendedor1"
            options={vendedores}
            getOptionLabel={(option) => option.nombreVendedor}
            value={vendedores.find(v => v.idVendedor === pedido.vendedor1) || null}
            onChange={(_event, newValue) => setPedido(prev => ({ ...prev, vendedor1: newValue ? newValue.idVendedor : '' }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Vendedor 1"
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  style: { fontSize: '13px' },
                }}
                InputLabelProps={{ style: { fontSize: '13px' } }}
                sx={{ mb: 2, minWidth: 220 }}
                helperText={error ? error : ''}
                error={!!error}
              />
            )}
            sx={{ width: 250, fontSize: '13px' }}
            ListboxProps={{ style: { fontSize: '13px', maxHeight: 200 } }}
            disabled={loading}
          />
          {/* Vendedor 2 */}
          <Autocomplete
            id='autocomplete-vendedor2'
            options={vendedores}
            getOptionLabel={(option) => option.nombreVendedor}
            value={vendedores.find(v => v.idVendedor === pedido.vendedor2) || null}
            onChange={(_event, newValue) => setPedido(prev => ({ ...prev, vendedor2: newValue ? newValue.idVendedor : '' }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Vendedor 2"
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  style: { fontSize: '13px' },
                }}
                InputLabelProps={{ style: { fontSize: '13px' } }}
                sx={{ mb: 2, minWidth: 220 }}
              />
            )}
            sx={{ width: 250, fontSize: '13px' }}
            ListboxProps={{ style: { fontSize: '13px', maxHeight: 200 } }}
            disabled={loading}
          />

          <Autocomplete
            id='autocomplete-lider'
            options={lideres}
            getOptionLabel={(option) => option.nombreVendedor}
            value={lideres.find(v => v.idVendedor === pedido.lider) || null}
            onChange={(_event, newValue) => setPedido(prev => ({ ...prev, lider: newValue ? newValue.idVendedor : '' }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Lider"
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  style: { fontSize: '13px' },
                }}
                InputLabelProps={{ style: { fontSize: '13px' } }}
                sx={{ mb: 2, minWidth: 220 }}
              />
            )}
            sx={{ width: 250, fontSize: '13px' }}
            ListboxProps={{ style: { fontSize: '13px', maxHeight: 200 } }}
            disabled={loading}
          />

        </Box>

        <Box sx={{ display: 'flex', gap: 4, mb: 1 }}>

          <TextField
            id="num-operacion"
            label="N° de Operación"
            variant="outlined"
            name="nroOperacion"
            value={pedido.nroOperacion}
            onChange={handleChange}
            // fullWidth
            size='small'
            InputLabelProps={{ style: { fontSize: '13px', } }}
            sx={{
              mb: 2, fontSize: '13px', minWidth: 250
            }}
          />

            <TextField
            id="num-referencia-cliente"
            label="N° Referencia de Cliente"
            variant="outlined"
            name="nroReferenciaCliente"
            value={pedido.nroReferenciaCliente}
            onChange={handleChange}
            // fullWidth
            size='small'
            InputLabelProps={{ style: { fontSize: '13px' } }}
            sx={{
              mb: 2, fontSize: '13px', minWidth: 250
            }}
          />

          <TextField
            id="ubruta-cotizacion"
            label="Ubruta Cotización"
            variant="outlined"
            name="ubrutaCotizacion"
            value={pedido.ubrutaCotizacion}
            onChange={handleChange}
            // fullWidth
            size='small'
            InputLabelProps={{ style: { fontSize: '13px' } }}
            sx={{
              mb: 2, fontSize: '13px', minWidth: 250
            }}
          />

          <FormControlLabel
              control={
              <Checkbox
                checked={pedido.comisionCompartida}
                onChange={handleChange}
                style={{ fontSize: '25px' }}
                name="comisionCompartida"
                inputProps={{ 'aria-label': 'primary checkbox' }}
                sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }} // Cambia tamaño del ícono
              />
              }
              label="Comisión compartida"
          />

        </Box>

          <div>

          <Button
            onClick={guardarPedido}
            sx={{ display: 'flex', justifyContent: 'center', mx: 'auto', mt: 2 }}
            color="primary"
            variant="contained"
            type="submit">
              GUARDAR
          </Button>

          </div>
        </form>
      </BaseCard>
    </div>
  );
};

export default FbDefaultForm;

