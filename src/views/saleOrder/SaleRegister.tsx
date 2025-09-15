import React from 'react';
import {
    TextField,
    Checkbox,
    Button,
    Box,
    Autocomplete,
    Typography,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    ExpandMore as ExpandMoreIcon,
    Save as SaveIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Clear as ClearIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { getVendedores } from 'src/services/VendorService';
import { getFormaPago } from 'src/services/PaymentService';
import { getMonedas } from 'src/services/CurrencyService';
import { createOrdenPedido } from 'src/services/OrderService';
import { getCustomers } from 'src/services/CustomerService';

export interface FormData {
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

// Simple BaseCard component placeholder
const BaseCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            {title}
        </Typography>
        {children}
    </Paper>
);

// Item Modal Component
const ItemModal: React.FC<{
    open: boolean;
    onClose: () => void;
    onSave: (item: DetalleItem) => void;
    item?: DetalleItem;
    isEditing?: boolean;
}> = ({ open, onClose, onSave, item, isEditing = false }) => {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<DetalleItem>({
        defaultValues: item || {
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
        }
    });

    React.useEffect(() => {
        if (item) {
            reset(item);
        } else {
            reset({
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
            });
        }
    }, [item, reset, open]);

    const handleSave = (data: DetalleItem) => {
        onSave({ ...data, id: item?.id || Date.now().toString() });
        onClose();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: { minHeight: '80vh' }
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        {isEditing ? 'Editar Item' : 'Agregar Nuevo Item'}
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <form onSubmit={handleSubmit(handleSave)}>
                <DialogContent>
                    {/* Información Principal del Item */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Información Principal
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Controller
                                name="tipoNegocio"
                                control={control}
                                rules={{ required: 'Campo requerido' }}
                                render={({ field }) => (
                                    <FormControl fullWidth size="small" error={!!errors.tipoNegocio}>
                                        <InputLabel>Tipo Negocio *</InputLabel>
                                        <Select
                                            {...field}
                                            label="Tipo Negocio *"
                                        >
                                            <MenuItem value="COMPRAS">Compras</MenuItem>
                                            <MenuItem value="VENTAS">Ventas</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Controller
                                name="subTipoNegocio1"
                                control={control}
                                rules={{ required: 'Campo requerido' }}
                                render={({ field }) => (
                                    <FormControl fullWidth size="small" error={!!errors.subTipoNegocio1}>
                                        <InputLabel>Sub Tipo Negocio 1 *</InputLabel>
                                        <Select
                                            {...field}
                                            label="Sub Tipo Negocio 1 *"

                                        >
                                            <MenuItem value="NACIONAL">Nacional</MenuItem>
                                            <MenuItem value="INTERNACIONAL">Internacional</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Controller
                                name="subTipoNegocio2"
                                control={control}
                                rules={{ required: 'Campo requerido' }}
                                render={({ field }) => (
                                    <FormControl fullWidth size="small" error={!!errors.subTipoNegocio2}>
                                        <InputLabel>Sub Tipo Negocio 2 *</InputLabel>
                                        <Select
                                            {...field}
                                            label="Sub Tipo Negocio 2 *"
                                        >
                                            <MenuItem value="PRODUCTO">Producto</MenuItem>
                                            <MenuItem value="SERVICIO">Servicio</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Código Comercial *"
                                {...register('codigoComercial', { required: 'Campo requerido' })}
                                size="small"
                                fullWidth
                                error={!!errors.codigoComercial}
                                helperText={errors.codigoComercial?.message}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="N° Cotización"
                                {...register('numCotizacion')}
                                size="small"
                                fullWidth
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Información de Cantidad y Precios */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Cantidad y Precios
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                label="Cantidad *"
                                {...register('cantidad', {
                                    required: 'Campo requerido',
                                    min: { value: 1, message: 'Cantidad debe ser mayor a 0' }
                                })}
                                type="number"
                                size="small"
                                fullWidth
                                inputProps={{ min: 1, step: 1 }}
                                error={!!errors.cantidad}
                                helperText={errors.cantidad?.message}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                label="Unidad de Medida"
                                {...register('unidadMedida')}
                                size="small"
                                fullWidth
                                defaultValue="UND"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                label="PVU *"
                                {...register('pvu', {
                                    required: 'Campo requerido',
                                    min: { value: 0, message: 'PVU debe ser mayor o igual a 0' }
                                })}
                                type="number"
                                size="small"
                                fullWidth
                                inputProps={{ min: 0, step: 0.01 }}
                                error={!!errors.pvu}
                                helperText={errors.pvu?.message}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                label="T/C USD"
                                {...register('tcUsd')}
                                type="number"
                                size="small"
                                fullWidth
                                inputProps={{ min: 0, step: 0.01 }}
                                defaultValue={1}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Información de Fechas y Tiempos */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Fechas y Tiempos
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="fechaRequeridaCliente"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Fecha Requerida por Cliente"
                                        onChange={(value) => field.onChange(value?.toISOString())}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                fullWidth: true
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Semanas de Entrega"
                                {...register('teSemanasEntrega')}
                                type="number"
                                size="small"
                                fullWidth
                                inputProps={{ min: 1, step: 1 }}
                                defaultValue={1}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Controller
                                    name="requiereArmado"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            {...field}
                                            checked={field.value}
                                        />
                                    )}
                                />
                                <Typography variant="body2">
                                    Requiere Armado
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Información de Proyectos y Códigos */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Proyectos y Referencias
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Código Cliente"
                                {...register('codigoCliente')}
                                size="small"
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Número Deal"
                                {...register('numeroDeal')}
                                size="small"
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Número Servicio"
                                {...register('numeroServicio')}
                                size="small"
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Número Proyecto"
                                {...register('numeroProyecto')}
                                size="small"
                                fullWidth
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Centros de Costo */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Centros de Costo
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Centro de Costo"
                                {...register('ccs')}
                                size="small"
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Sub Centro de Costo"
                                {...register('ccss')}
                                size="small"
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Sub Sub Centro de Costo"
                                {...register('ccn')}
                                size="small"
                                fullWidth
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Notas */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Notas y Observaciones
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Nota 1"
                                {...register('nota1')}
                                size="small"
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Nota 2"
                                {...register('nota2')}
                                size="small"
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Nota 3"
                                {...register('nota3')}
                                size="small"
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Nota 4"
                                {...register('nota4')}
                                size="small"
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} variant="outlined">
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
                        {isEditing ? 'Actualizar Item' : 'Agregar Item'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const OrderCreate = () => {
    const [vendedores, setVendedores] = React.useState<Vendedor[]>([]);
    const [clientes, setClientes] = React.useState<Clientes[]>([]);
    const [formaPago, setFormaPago] = React.useState<FormaPago[]>([]);
    const [monedas, setMonedas] = React.useState<Monedas[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [itemModalOpen, setItemModalOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState<DetalleItem | undefined>(undefined);
    const [editingIndex, setEditingIndex] = React.useState<number | undefined>(undefined);

    const { register, handleSubmit, control, reset, watch } = useForm<FormData>({
        defaultValues: {
            detalles: []
        }
    });
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "detalles"
    });

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

    const abrirModalAgregar = () => {
        setEditingItem(undefined);
        setEditingIndex(undefined);
        setItemModalOpen(true);
    };

    const abrirModalEditar = (item: DetalleItem, index: number) => {
        setEditingItem(item);
        setEditingIndex(index);
        setItemModalOpen(true);
    };

    const cerrarModal = () => {
        setItemModalOpen(false);
        setEditingItem(undefined);
        setEditingIndex(undefined);
    };

    const guardarItem = (item: DetalleItem) => {
        if (editingIndex !== undefined) {
            // Editar item existente
            update(editingIndex, item);
        } else {
            // Agregar nuevo item
            append(item);
        }
    };

    const eliminarDetalle = (index: number) => {
        remove(index);
    };

    const calcularTotal = () => {
        const detalles = watch('detalles');
        return detalles?.reduce((total, detalle) => {
            return total + (detalle.cantidad * detalle.pvu);
        }, 0) || 0;
    };

    const guardarPedido = (data: FormData) => {
        setLoading(true);
        const order = {
            ...data,
            idFp: Number(data.idFp),
            idMda: Number(data.idMda),
            totalSinIgv: calcularTotal()
        };
        createOrdenPedido(order)
            .then(_ => {
                setLoading(false);
                reset();
            })
            .catch((err) => {
                setLoading(false);
                console.error(err);
            });
    };

    const limpiarFormulario = () => {
        reset();
    };

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
                        {/* Datos principales - mismo contenido anterior */}
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Datos Principales de la Orden
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
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
                                                    label="Fecha de Procesamiento VI"
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
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            label="N° Ref. Cliente"
                                            {...register('numRefCliente')}
                                            size="small"
                                            fullWidth
                                            disabled={loading}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            label="Utilidad bruta Cotización"
                                            {...register('ubrutaCoti')}
                                            size="small"
                                            fullWidth
                                            disabled={loading}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Controller
                                            name="comisionCompartida"
                                            control={control}
                                            render={({ field }) => (
                                                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                                    <Checkbox
                                                        {...field}
                                                        checked={field.value}
                                                        disabled={loading}
                                                    />
                                                    <Typography variant="body2">
                                                        Comisión Compartida
                                                    </Typography>
                                                </Box>
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        {/* Detalle de Items - Ahora con Modal */}
                        <Accordion defaultExpanded sx={{ mt: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Detalle de Items
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
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={abrirModalAgregar}
                                        disabled={loading}
                                        size="medium"
                                    >
                                        Agregar Item
                                    </Button>
                                </Box>

                                {fields.length === 0 ? (
                                    <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            No hay items agregados
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Utiliza el botón "Agregar Item" para añadir productos o servicios a este pedido
                                        </Typography>
                                    </Paper>
                                ) : (
                                    <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
                                        <Table stickyHeader size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ minWidth: 100 }}>Acciones</TableCell>
                                                    <TableCell sx={{ minWidth: 120 }}>Tipo Negocio</TableCell>
                                                    <TableCell sx={{ minWidth: 150 }}>Código Comercial</TableCell>
                                                    <TableCell sx={{ minWidth: 80 }}>Cantidad</TableCell>
                                                    <TableCell sx={{ minWidth: 100 }}>PVU</TableCell>
                                                    <TableCell sx={{ minWidth: 100 }}>Subtotal</TableCell>
                                                    <TableCell sx={{ minWidth: 150 }}>N° Cotización</TableCell>
                                                    <TableCell sx={{ minWidth: 120 }}>Fecha Requerida</TableCell>
                                                    <TableCell sx={{ minWidth: 80 }}>Semanas</TableCell>
                                                    <TableCell sx={{ minWidth: 80 }}>Armado</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {fields.map((field, index) => {
                                                    const subtotal = field.cantidad * field.pvu;
                                                    return (
                                                        <TableRow key={field.id} hover>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                    <Tooltip title="Ver/Editar">
                                                                        <IconButton
                                                                            size="small"
                                                                            color="primary"
                                                                            onClick={() => abrirModalEditar(field, index)}
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Eliminar">
                                                                        <IconButton
                                                                            size="small"
                                                                            color="error"
                                                                            onClick={() => eliminarDetalle(index)}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={field.tipoNegocio || 'No definido'}
                                                                    size="small"
                                                                    color={field.tipoNegocio === 'VENTAS' ? 'success' : field.tipoNegocio === 'COMPRAS' ? 'info' : 'default'}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    {field.codigoComercial || '-'}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {field.subTipoNegocio1} - {field.subTipoNegocio2}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {field.cantidad} {field.unidadMedida}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {field.pvu.toFixed(2)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                                    {subtotal.toFixed(2)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {field.numCotizacion || '-'}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {field.fechaRequeridaCliente ?
                                                                        new Date(field.fechaRequeridaCliente).toLocaleDateString() :
                                                                        '-'
                                                                    }
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {field.teSemanasEntrega}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={field.requiereArmado ? 'Sí' : 'No'}
                                                                    size="small"
                                                                    color={field.requiereArmado ? 'warning' : 'default'}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </AccordionDetails>
                        </Accordion>

                        {/* RESUMEN Y ACCIONES */}
                        <Paper sx={{ p: 2, mt: 2, backgroundColor: '#f5f5f5' }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="h6" color="primary">
                                        Total sin IGV: {calcularTotal().toFixed(2)}
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
                                            disabled={loading || fields.length === 0}
                                        >
                                            {loading ? 'Guardando...' : 'Guardar Pedido'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </form>
                </BaseCard>

                {/* Modal de Item */}
                <ItemModal
                    open={itemModalOpen}
                    onClose={cerrarModal}
                    onSave={guardarItem}
                    item={editingItem}
                    isEditing={editingIndex !== undefined}
                />
            </Box>
        </LocalizationProvider>
    );
};

export default OrderCreate;