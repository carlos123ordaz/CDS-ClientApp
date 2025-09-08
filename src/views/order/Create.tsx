import React from 'react';
import {
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    Box,
    Autocomplete,
    Typography,
    Grid,
    Paper,
    Divider,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
    Save as SaveIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import BaseCard from 'src/components/BaseCard/BaseCard';
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { getVendedores } from 'src/services/VendorService';
import { getFormaPago } from 'src/services/PaymentService';
import { getMonedas } from 'src/services/CurrencyService';
import { createOrdenPedido } from 'src/services/OrderService';
import dayjs from 'dayjs';
import { getCustomers } from 'src/services/CustomerService';

// Interfaces principales
export interface FormData {
    // Datos de la orden
    correlativoOPCI: string;
    fecRecep: string;
    fecInicio: string;
    fecProcVi: string;
    idClt: string;
    numOp: string;
    idMda: number;
    totalSinIgv: number;
    numRefCliente: string;
    idFp: number;
    ibCltFin: string;
    ibCltPrv: string;
    idVdr: string;
    ibVdr2: string;
    ibLider: string;
    ubrutaCoti: string;
    comisionCompartida: boolean;
    
    // Detalles de la orden
    detalles: DetalleItem[];
}

export interface DetalleItem {
    id: string;
    statusOP: string;
    tipoNegocio: string;
    subTipoNegocio1: string;
    subTipoNegocio2: string;
    itemOP: string;
    codigoComercial: string;
    cantidad: number;
    unidadMedida: string;
    moneda: string;
    pvu: number;
    tcUsd: number;
    fechaRequeridaCliente: string;
    teSemanasEntrega: number;
    numCotizacion: string;
    requiereArmado: boolean;
    codigoCliente: string;
    numeroDeal: string;
    numeroServicio: string;
    numeroProyecto: string;
    ccs: string;
    ccss: string;
    ccn: string;
    nota1: string;
    nota2: string;
    nota3: string;
    nota4: string;
}

// Interfaces de datos maestros
export interface Vendedor {
    idVdr: string;
    nomVdr: string;
    ibLider: boolean;
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

// Opciones para campos select
const statusOptions = ['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'];
const tipoNegocioOptions = ['PRODUCTO', 'SERVICIO', 'MIXTO'];
const subTipoNegocioOptions = ['VENTA', 'ALQUILER', 'MANTENIMIENTO', 'CONSULTORIA'];
const unidadMedidaOptions = ['UND', 'KG', 'M', 'M2', 'M3', 'LT', 'SET', 'PAR'];

const OrderCreate = () => {
    // Estados para datos maestros
    const [vendedores, setVendedores] = React.useState<Vendedor[]>([]);
    const [clientes, setClientes] = React.useState<Clientes[]>([]);
    const [formaPago, setFormaPago] = React.useState<FormaPago[]>([]);
    const [monedas, setMonedas] = React.useState<Monedas[]>([]);
    const [loading, setLoading] = React.useState(false);

    // Form control
    const { register, handleSubmit, control, reset, watch } = useForm<FormData>({
        defaultValues: {
            detalles: [
                {
                    id: '1',
                    statusOP: 'PENDIENTE',
                    tipoNegocio: '',
                    subTipoNegocio1: '',
                    subTipoNegocio2: '',
                    itemOP: '',
                    codigoComercial: '',
                    cantidad: 1,
                    unidadMedida: 'UND',
                    moneda: '',
                    pvu: 0,
                    tcUsd: 1,
                    fechaRequeridaCliente: '',
                    teSemanasEntrega: 1,
                    numCotizacion: '',
                    requiereArmado: false,
                    codigoCliente: '',
                    numeroDeal: '',
                    numeroServicio: '',
                    numeroProyecto: '',
                    ccs: '',
                    ccss: '',
                    ccn: '',
                    nota1: '',
                    nota2: '',
                    nota3: '',
                    nota4: '',
                }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "detalles"
    });

    // Memoized data
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

    const lideres = vendedores.filter(v => v.ibLider);

    // Agregar nuevo detalle
    const agregarDetalle = () => {
        const nuevoDetalle: DetalleItem = {
            id: Date.now().toString(),
            statusOP: 'PENDIENTE',
            tipoNegocio: '',
            subTipoNegocio1: '',
            subTipoNegocio2: '',
            itemOP: '',
            codigoComercial: '',
            cantidad: 1,
            unidadMedida: 'UND',
            moneda: '',
            pvu: 0,
            tcUsd: 1,
            fechaRequeridaCliente: '',
            teSemanasEntrega: 1,
            numCotizacion: '',
            requiereArmado: false,
            codigoCliente: '',
            numeroDeal: '',
            numeroServicio: '',
            numeroProyecto: '',
            ccs: '',
            ccss: '',
            ccn: '',
            nota1: '',
            nota2: '',
            nota3: '',
            nota4: '',
        };
        append(nuevoDetalle);
    };

    // Función para calcular total
    const calcularTotal = () => {
        const detalles = watch('detalles');
        return detalles?.reduce((total, detalle) => {
            return total + (detalle.cantidad * detalle.pvu);
        }, 0) || 0;
    };

    // Guardar pedido
    const guardarPedido = (data: FormData) => {
        setLoading(true);
        console.log('Datos del pedido:', data);
        
        const order = {
            ...data,
            idFp: Number(data.idFp),
            idMda: Number(data.idMda),
            totalSinIgv: calcularTotal(),
            correlativoOPCI: data.correlativoOPCI || `OP-${Date.now()}`,
        };

        console.log('Orden procesada:', order);
        
        createOrdenPedido(order)
            .then(_ => {
                alert('Pedido guardado con éxito');
                setLoading(false);
                reset();
            })
            .catch((err) => {
                setLoading(false);
                alert('Error al guardar el pedido');
                console.error(err);
            });
    };

    // Limpiar formulario
    const limpiarFormulario = () => {
        reset();
    };

    // Cargar datos maestros
    React.useEffect(() => {
        setLoading(true);

        Promise.all([
            getMonedas(),
            getVendedores(),
            getCustomers(),
            getFormaPago()
        ])
        .then(([monedasRes, vendedoresRes, clientesRes, formaPagoRes]) => {
            setMonedas(monedasRes.data as Monedas[]);
            setVendedores(vendedoresRes.data as Vendedor[]);
            setClientes(clientesRes.data as Clientes[]);
            setFormaPago(formaPagoRes.data as FormaPago[]);
            setLoading(false);
        })
        .catch((err) => {
            console.error('Error al cargar datos maestros:', err);
            setLoading(false);
        });
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Box sx={{ p: 2 }}>
                <BaseCard title="REGISTRO DE PEDIDOS">
                    <form onSubmit={handleSubmit(guardarPedido)}>
                        {/* DATOS PRINCIPALES DE LA ORDEN */}
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    📋 Datos Principales de la Orden
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    {/* Fila 1 */}
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            label="Correlativo OPCI"
                                            {...register('correlativoOPCI')}
                                            size="small"
                                            fullWidth
                                            disabled={loading}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Controller
                                            name="fecRecep"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    label="Fecha Recepción"
                                                    onChange={(value) => field.onChange(value?.toISOString())}
                                                    slotProps={{
                                                        textField: { size: 'small', fullWidth: true }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Controller
                                            name="fecInicio"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    label="Fecha Inicio"
                                                    onChange={(value) => field.onChange(value?.toISOString())}
                                                    slotProps={{
                                                        textField: { size: 'small', fullWidth: true }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Controller
                                            name="fecProcVi"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    label="Fecha Proc. VI"
                                                    onChange={(value) => field.onChange(value?.toISOString())}
                                                    slotProps={{
                                                        textField: { size: 'small', fullWidth: true }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* Fila 2 - Clientes */}
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Controller
                                            name="idClt"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    
                                                    options={clientesUnicos}
                                                    onChange={(_, value) => field.onChange(value?.idClt)}
                                                    getOptionLabel={(option) => option.razonSocial}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Cliente Principal"
                                                            size="small"
                                                            fullWidth
                                                        />
                                                    )}
                                                    disabled={loading}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Controller
                                            name="ibCltFin"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    
                                                    options={clientesUnicos}
                                                    getOptionLabel={(option) => option.razonSocial}
                                                    onChange={(_, value) => field.onChange(value?.idClt)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Cliente Final"
                                                            size="small"
                                                            fullWidth
                                                        />
                                                    )}
                                                    disabled={loading}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Controller
                                            name="ibCltPrv"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    
                                                    options={clientesUnicos}
                                                    getOptionLabel={(option) => option.razonSocial}
                                                    onChange={(_, value) => field.onChange(value?.idClt)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Cliente Proveedor"
                                                            size="small"
                                                            fullWidth
                                                        />
                                                    )}
                                                    disabled={loading}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* Fila 3 - Vendedores */}
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Controller
                                            name="idVdr"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    
                                                    options={vendedores}
                                                    getOptionLabel={(option) => option.nomVdr}
                                                    onChange={(_, value) => field.onChange(value?.idVdr)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Vendedor 1"
                                                            size="small"
                                                            fullWidth
                                                        />
                                                    )}
                                                    disabled={loading}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Controller
                                            name="ibVdr2"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                   
                                                    options={vendedores}
                                                    getOptionLabel={(option) => option.nomVdr}
                                                    onChange={(_, value) => field.onChange(value?.idVdr)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Vendedor 2"
                                                            size="small"
                                                            fullWidth
                                                        />
                                                    )}
                                                    disabled={loading}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Controller
                                            name="ibLider"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    options={lideres}
                                                    getOptionLabel={(option) => option.nomVdr}
                                                    onChange={(_, value) => field.onChange(value?.idVdr)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Líder"
                                                            size="small"
                                                            fullWidth
                                                        />
                                                    )}
                                                    disabled={loading}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* Fila 4 - Datos financieros */}
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            label="N° Operación"
                                            {...register('numOp')}
                                            size="small"
                                            fullWidth
                                            disabled={loading}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Controller
                                            name="idMda"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    options={monedas}
                                                    getOptionLabel={(option) => {
                                                        const simbolos: Record<string, string> = {
                                                            'SOLES': 'S/ - Soles',
                                                            'DOLARES AMERICANOS': '$ - Dólares',
                                                            'EURO': '€ - Euros',
                                                            'YEN': '¥ - Yenes'
                                                        };
                                                        return simbolos[option.nombre.toUpperCase()] || option.nombre;
                                                    }}
                                                    onChange={(_, value) => field.onChange(value?.idMda)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Moneda"
                                                            size="small"
                                                            fullWidth
                                                        />
                                                    )}
                                                    disabled={loading}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            label="Total sin IGV"
                                            type="number"
                                            value={calcularTotal().toFixed(2)}
                                            size="small"
                                            fullWidth
                                            disabled
                                            inputProps={{ step: '0.01' }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Controller
                                            name="idFp"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    options={formaPago}
                                                    getOptionLabel={(option) => option.descrip}
                                                    onChange={(_, value) => field.onChange(value?.idFp)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Forma de Pago"
                                                            size="small"
                                                            fullWidth
                                                        />
                                                    )}
                                                    disabled={loading}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* Fila 5 - Campos adicionales */}
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="N° Ref. Cliente"
                                            {...register('numRefCliente')}
                                            size="small"
                                            fullWidth
                                            disabled={loading}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Ubruta Cotización"
                                            {...register('ubrutaCoti')}
                                            size="small"
                                            fullWidth
                                            disabled={loading}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    {...register('comisionCompartida')}
                                                    disabled={loading}
                                                />
                                            }
                                            label="Comisión Compartida"
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        {/* DETALLE DE ITEMS */}
                        <Accordion defaultExpanded sx={{ mt: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        🛍️ Detalle de Items
                                    </Typography>
                                    <Chip 
                                        label={`${fields.length} item(s)`} 
                                        color="primary" 
                                        size="small"
                                        sx={{ mr: 2 }}
                                    />
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ mb: 2 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={agregarDetalle}
                                        disabled={loading}
                                        size="small"
                                    >
                                        Agregar Item
                                    </Button>
                                </Box>

                                <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Acciones</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Tipo Negocio</TableCell>
                                                <TableCell>Sub Tipo 1</TableCell>
                                                <TableCell>Sub Tipo 2</TableCell>
                                                <TableCell>Item OP</TableCell>
                                                <TableCell>Código Comercial</TableCell>
                                                <TableCell>Cantidad</TableCell>
                                                <TableCell>U.M.</TableCell>
                                                <TableCell>Moneda</TableCell>
                                                <TableCell>PVU</TableCell>
                                                <TableCell>T/C USD</TableCell>
                                                <TableCell>Fecha Req.</TableCell>
                                                <TableCell>Semanas</TableCell>
                                                <TableCell>N° Cotización</TableCell>
                                                <TableCell>Req. Armado</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fields.map((field, index) => (
                                                <TableRow key={field.id}>
                                                    <TableCell>
                                                        <TextField
                                                            {...register(`detalles.${index}.pvu`)}
                                                            type="number"
                                                            size="small"
                                                            sx={{ width: 100 }}
                                                            inputProps={{ min: 0, step: 0.01 }}
                                                            disabled={loading}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            {...register(`detalles.${index}.tcUsd`)}
                                                            type="number"
                                                            size="small"
                                                            sx={{ width: 80 }}
                                                            inputProps={{ min: 0, step: 0.01 }}
                                                            disabled={loading}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Controller
                                                            name={`detalles.${index}.fechaRequeridaCliente`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    onChange={(value) => field.onChange(value?.toISOString())}
                                                                    slotProps={{
                                                                        textField: { 
                                                                            size: 'small', 
                                                                            sx: { minWidth: 140 } 
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            {...register(`detalles.${index}.teSemanasEntrega`)}
                                                            type="number"
                                                            size="small"
                                                            sx={{ width: 80 }}
                                                            inputProps={{ min: 1, step: 1 }}
                                                            disabled={loading}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            {...register(`detalles.${index}.numCotizacion`)}
                                                            size="small"
                                                            sx={{ minWidth: 120 }}
                                                            disabled={loading}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            {...register(`detalles.${index}.requiereArmado`)}
                                                            disabled={loading}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Información adicional de detalle en accordions expandibles */}
                                {fields.map((field, index) => (
                                    <Accordion key={field.id} sx={{ mt: 1 }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="subtitle2">
                                                📄 Información Adicional - Item {index + 1}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, md: 3 }}>
                                                    <TextField
                                                        label="Código Cliente"
                                                        {...register(`detalles.${index}.codigoCliente`)}
                                                        size="small"
                                                        fullWidth
                                                        disabled={loading}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 3 }}>
                                                    <TextField
                                                        label="Número Deal"
                                                        {...register(`detalles.${index}.numeroDeal`)}
                                                        size="small"
                                                        fullWidth
                                                        disabled={loading}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 3 }}>
                                                    <TextField
                                                        label="Número Servicio"
                                                        {...register(`detalles.${index}.numeroServicio`)}
                                                        size="small"
                                                        fullWidth
                                                        disabled={loading}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 3 }}>
                                                    <TextField
                                                        label="Número Proyecto"
                                                        {...register(`detalles.${index}.numeroProyecto`)}
                                                        size="small"
                                                        fullWidth
                                                        disabled={loading}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <TextField
                                                        label="CCS"
                                                        {...register(`detalles.${index}.ccs`)}
                                                        size="small"
                                                        fullWidth
                                                        disabled={loading}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <TextField
                                                        label="CCSS"
                                                        {...register(`detalles.${index}.ccss`)}
                                                        size="small"
                                                        fullWidth
                                                        disabled={loading}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <TextField
                                                        label="CCN"
                                                        {...register(`detalles.${index}.ccn`)}
                                                        size="small"
                                                        fullWidth
                                                        disabled={loading}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField
                                                        label="Nota 1"
                                                        {...register(`detalles.${index}.nota1`)}
                                                        size="small"
                                                        fullWidth
                                                        multiline
                                                        rows={2}
                                                        disabled={loading}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField
                                                        label="Nota 2"
                                                        {...register(`detalles.${index}.nota2`)}
                                                        size="small"
                                                        fullWidth
                                                        multiline
                                                        rows={2}
                                                        disabled={loading}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField
                                                        label="Nota 3"
                                                        {...register(`detalles.${index}.nota3`)}
                                                        size="small"
                                                        fullWidth
                                                        multiline
                                                        rows={2}
                                                        disabled={loading}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField
                                                        label="Nota 4"
                                                        {...register(`detalles.${index}.nota4`)}
                                                        size="small"
                                                        fullWidth
                                                        multiline
                                                        rows={2}
                                                        disabled={loading}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </AccordionDetails>
                        </Accordion>

                        {/* RESUMEN Y ACCIONES */}
                        <Paper sx={{ p: 2, mt: 2, backgroundColor: '#f5f5f5' }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="h6" color="primary">
                                        💰 Total sin IGV: {calcularTotal().toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Cantidad de items: {fields.length}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<ClearIcon />}
                                            onClick={limpiarFormulario}
                                            disabled={loading}
                                        >
                                            Limpiar
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<SaveIcon />}
                                            disabled={loading}
                                            size="large"
                                            sx={{
                                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                            }}
                                        >
                                            {loading ? 'Guardando...' : 'Guardar Pedido'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </form>
                </BaseCard>
            </Box>
        </LocalizationProvider>
    );
};

export default OrderCreate;