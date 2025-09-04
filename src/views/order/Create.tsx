import React from 'react';
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
import BaseCard from 'src/components/BaseCard/BaseCard';
import { Controller, useForm } from "react-hook-form";
import { getVendedores } from 'src/services/VendorService';
import { getClientes } from 'src/services/CustomerService';
import { getFormaPago } from 'src/services/PaymentService';
import { getMonedas } from 'src/services/CurrencyService';
import { createOrdenPedido } from 'src/services/OrderService';
export interface FormData {
    idClt: string;
    ibCltFin: string;
    ibCltPrv: string;
    fecRecep: string;
    fecInicio: string;
    fecProcVi: string;
    idFp: number;
    idMda: number;
    totalSinIgv: number;
    idVdr: string;
    ibVdr1: string;
    ibVdr2: string;
    ibLider: number;
    numOp: string;
    numRefCliente: string;
    ubrutaCoti: string;
    comisionCompartida: boolean;
}

export interface Vendedor {
    idVdr: string;
    nomVdr: string;
    ibLider: boolean | number;
}

export interface Clientes {
    idClt: string;
    razonSocial: string;
    numDocumento: string;
}

export interface FormaPago {
    idFp: string;
    descrip: string;
}

export interface Monedas {
    idMda: string;
    nombre: string;
}

const OrderCreate = () => {
    const [vendedores, setVendedores] = React.useState<Vendedor[]>([]);
    const [clientes, setClientes] = React.useState<Clientes[]>([]);
    const [formaPago, setFormaPago] = React.useState<FormaPago[]>([]);
    const [monedas, setMonedas] = React.useState<Monedas[]>([]);

    const [loading, setLoading] = React.useState(false);
    const { register, handleSubmit, control } = useForm<FormData>()
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
    const lideres = vendedores.filter(v => v.ibLider === true || v.ibLider === 1);

    const guardarPedido = (data: FormData) => {
        const order = {
            ...data,
            idFp: Number(data.idFp),
            idMda: Number(data.idMda),
            totalSinIgv: Number(data.totalSinIgv),
            ibLider: Number(data.ibLider),
        }
        createOrdenPedido(order)
            .then(_ => {
                setLoading(false);
                alert('Pedido guardado con éxito');
            })
            .catch((err) => {
                setLoading(false);
                alert('error :c')
                console.log(err)
            })
    };

    React.useEffect(() => {
        getVendedores()
            .then((res) => {
                setVendedores(res.data as Vendedor[]);
            })
            .catch((err) => {
                console.error('Error al obtener vendedores:', err);
                setLoading(false);
            });
    }, []);
    React.useEffect(() => {
        getClientes()
            .then((res) => setClientes(res.data as Clientes[]))
            .catch((err) => {
                console.error('Error al obtener clientes:', err);
                setLoading(false);
            });
    }, []);
    React.useEffect(() => {
        getFormaPago()
            .then((res) => setFormaPago(res.data as FormaPago[]))
            .catch((err) => {
                console.error('Error al obtener forma de pago:', err);
                setLoading(false);
            });
    }, []);
    React.useEffect(() => {
        getMonedas()
            .then((res) => setMonedas(res.data as Monedas[]))
            .catch((err) => {
                console.error('Error al obtener monedas:', err);
                setLoading(false);
            });
    }, []);


    return (
        <div>
            <BaseCard title="REGISTRO DE PEDIDOS 2">
                <form onSubmit={handleSubmit(guardarPedido)}>
                    <Box sx={{ display: 'flex', gap: 4, mb: 1 }}>
                        <Controller
                            name='idClt'
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    {...field}
                                    id="autocomplete-cliente"
                                    options={clientesUnicos}
                                    onChange={(_, value) => field.onChange(value?.idClt)}
                                    getOptionLabel={(option) => option.razonSocial}
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


                                        />
                                    )}
                                    sx={{ width: 250, fontSize: '13px' }}
                                    ListboxProps={{ style: { fontSize: '13px', maxHeight: 200 } }}
                                    disabled={loading}
                                />
                            )}
                        />


                        {/* CAMPO CLIENTE FINAL Y CLIENTE PROVEEDOR COMO AUTOCOMPLETE */}
                        {/* Estos campos se llenan automáticamente al seleccionar un cliente */}
                        <Controller
                            name='ibCltFin'
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    {...field}
                                    id='autocomplete-cliente-final'
                                    options={clientesUnicos}
                                    getOptionLabel={(option) => option.razonSocial}
                                    onChange={(_, value) => field.onChange(value?.idClt)}
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
                            )}
                        />

                        <Controller
                            name='ibCltPrv'
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    {...field}
                                    id='autocomplete-cliente-proveedor'
                                    options={clientesUnicos}
                                    getOptionLabel={(option) => option.razonSocial}
                                    onChange={(_, value) => field.onChange(value?.idClt)}
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
                            )}
                        />

                    </Box>
                    <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                            <Controller
                                name='fecRecep'
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Fecha de Recepción"
                                        onChange={(value) => field.onChange(value?.toISOString())}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                sx: { fontSize: '13px', minWidth: 250 }
                                            }
                                        }}
                                        sx={{ mb: 2, fontSize: '13px', minWidth: 250 }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                            <Controller
                                name='fecInicio'
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        {...field}
                                        label="Fecha de Inicio"
                                        onChange={(value) => field.onChange(value?.toISOString())}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                sx: { fontSize: '13px', minWidth: 250 }
                                            }
                                        }}
                                        sx={{ mb: 2, fontSize: '13px', minWidth: 250 }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                            <Controller
                                name='fecProcVi'
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        {...field}
                                        label="Fecha de Procesamiento VI"
                                        onChange={(value) => field.onChange(value?.toISOString())}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                sx: { fontSize: '13px', minWidth: 250 }
                                            }
                                        }}
                                        sx={{ mb: 2, fontSize: '13px', minWidth: 250 }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 4, mb: 1 }}>
                        <Controller
                            name='idFp'
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    id="autocomplete-forma-pago"
                                    {...field}
                                    options={formaPago}
                                    getOptionLabel={(option) => option.descrip}
                                    onChange={(_, value) => field.onChange(value?.idFp)}
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
                            )}
                        />
                        <Controller
                            name='idMda'
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    {...field}
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
                                    onChange={(_, value) => field.onChange(value?.idMda)}
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
                                />
                            )}
                        />
                        <TextField
                            id="total-sin-igv"
                            label="Total sin IGV"
                            variant="outlined"
                            {...register('totalSinIgv')}
                            size='small'
                            type='number'
                            inputProps={{
                                step: '0.01', min: '0', style: { MozAppearance: 'textfield' }
                            }}
                            sx={{
                                mb: 2, fontSize: '13px', minWidth: 250,

                                '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                    WebkitAppearance: 'none',
                                    margin: 0,
                                },
                                '& input[type=number]': {
                                    MozAppearance: 'textfield',
                                },
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 4, mb: 1 }}>
                        <Controller
                            name='idVdr'
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    {...field}
                                    id="autocomplete-vendedor1"
                                    options={vendedores}
                                    getOptionLabel={(option) => option.nomVdr}
                                    onChange={(_, value) => field.onChange(value?.idVdr)}
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
                                       
                                        />
                                    )}
                                    sx={{ width: 250, fontSize: '13px' }}
                                    ListboxProps={{ style: { fontSize: '13px', maxHeight: 200 } }}
                                    disabled={loading}
                                />
                            )}
                        />
                        <Controller
                            name='ibVdr2'
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    {...field}
                                    id='autocomplete-vendedor2'
                                    options={vendedores}
                                    getOptionLabel={(option) => option.nomVdr}
                                    onChange={(_, value) => field.onChange(value?.idVdr)}
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
                            )}
                        />

                        <Controller
                            name='ibLider'
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    id='autocomplete-lider'
                                    options={lideres}
                                    {...field}
                                    getOptionLabel={(option) => option.nomVdr}
                                    onChange={(_, value) => field.onChange(value?.idVdr)}
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
                            )}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 4, mb: 1 }}>

                        <TextField
                            id="num-operacion"
                            label="N° de Operación"
                            variant="outlined"
                            {...register('numOp')}
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
                            {...register('numRefCliente')}
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
                            {...register('ubrutaCoti')}
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
                                    {...register('comisionCompartida')}
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

export default OrderCreate;

