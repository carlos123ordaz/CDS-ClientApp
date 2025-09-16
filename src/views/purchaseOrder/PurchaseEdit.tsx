import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    IconButton,
    Divider,
    Alert,
    Breadcrumbs,
    Link,
    Skeleton,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
    Stack,
    Stepper,
    Step,
    StepLabel,
    FormHelperText,
    InputAdornment,
    Tooltip
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Business as BusinessIcon,
    Inventory as InventoryIcon,
    LocalShipping as ShippingIcon,
    AttachMoney as MoneyIcon,
    CalendarToday as CalendarIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    Edit as EditIcon
} from '@mui/icons-material';

// Interfaces (mismas del componente anterior)
interface OrdenCompraEditar {
    OCID?: number;
    TipoOC: string;
    NumeroOC: string;
    FechaOC: string;
    FormaPagoID: number | null;
    MonedaID: number | null;
    MontoTotal?: number;
    EstadoID: number | null;
    ProveedorID: number | null;
    RSocialProveedor: string;
    Detalles: OrdenCompraDetalleEditar[];
}

interface OrdenCompraDetalleEditar {
    OCDetalleID?: number;
    ItemID: number | null;
    ItemOC: string;
    Cantidad: number;
    PrecioCompraUnitario1: number;
    TipoCambioUSD: number;
    TiempoEntregaSemanas: number;
    NumCotizacionProveedor: string;
    PaisEmbarque: string;
    CiudadEmbarque: string;
    PaisOrigen: string;
    TipoEmbarque: string;
    IncotermID: number;
    OperadorLogisticoID: number | null;
    Nota1: string;
    Nota2: string;
    // Info del item para mostrar
    Item?: {
        ItemID: number;
        CodCom: string;
        Descrip: string;
        UnidadMedida: { Codigo: string };
        Marca: { Nombre: string };
    };
}

interface CatalogoItem {
    value: number;
    label: string;
    extra?: any;
}

const OrdenCompraEditar = () => {
    // Estados principales
    const [ordenCompra, setOrdenCompra] = useState<OrdenCompraEditar>({
        TipoOC: 'IMPORTACION',
        NumeroOC: '',
        FechaOC: new Date().toISOString().split('T')[0],
        FormaPagoID: null,
        MonedaID: null,
        EstadoID: 1,
        ProveedorID: null,
        RSocialProveedor: '',
        Detalles: []
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string>('');
    const [currentStep, setCurrentStep] = useState(0);
    const [itemDialogOpen, setItemDialogOpen] = useState(false);
    const [proveedorDialogOpen, setProveedorDialogOpen] = useState(false);

    // Catálogos
    const [proveedores, setProveedores] = useState<CatalogoItem[]>([]);
    const [items, setItems] = useState<CatalogoItem[]>([]);
    const [monedas, setMonedas] = useState<CatalogoItem[]>([]);
    const [formasPago, setFormasPago] = useState<CatalogoItem[]>([]);
    const [operadoresLogisticos, setOperadoresLogisticos] = useState<CatalogoItem[]>([]);
    const [incoterms, setIncoterms] = useState<CatalogoItem[]>([]);

    // Estados para validaciones
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Simular ID de orden desde URL (para edición)
    const ordenId = 1; // En una app real, esto vendría de useParams()

    const steps = ['Información General', 'Detalles de Items', 'Configuración Logística'];

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            // Simular carga de catálogos
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data para catálogos
            setProveedores([
                { value: 1001, label: "SCHNEIDER ELECTRIC PERU S.A.", extra: { ruc: "20298765432", pais: "Perú" } },
                { value: 1002, label: "ABB SAC", extra: { ruc: "20100047218", pais: "Perú" } },
                { value: 1003, label: "SIEMENS S.A.", extra: { ruc: "20100136248", pais: "Perú" } }
            ]);

            setItems([
                {
                    value: 101,
                    label: "Variador de frecuencia 75kW",
                    extra: {
                        codCom: "COM-SE-001",
                        marca: "Schneider Electric",
                        unidad: "UND",
                        descrip: "Variador de frecuencia 75kW, 380-480V, IP20"
                    }
                },
                {
                    value: 102,
                    label: "Contactor 3P+1NA 25A 24VDC",
                    extra: {
                        codCom: "COM-SE-002",
                        marca: "Schneider Electric",
                        unidad: "UND",
                        descrip: "Contactor 3P+1NA 25A 24VDC"
                    }
                }
            ]);

            setMonedas([
                { value: 1, label: "PEN - Soles" },
                { value: 2, label: "USD - Dólares Americanos" },
                { value: 3, label: "EUR - Euros" }
            ]);

            setFormasPago([
                { value: 1, label: "30 días después de la recepción" },
                { value: 2, label: "Contado" },
                { value: 3, label: "60 días después de la recepción" }
            ]);

            setOperadoresLogisticos([
                { value: 5, label: "MAERSK LINE" },
                { value: 6, label: "MSC" },
                { value: 7, label: "CMA CGM" }
            ]);

            setIncoterms([
                { value: 1, label: "EXW - Ex Works" },
                { value: 2, label: "FOB - Free on Board" },
                { value: 3, label: "CIF - Cost, Insurance and Freight" }
            ]);

            // Si es edición, cargar datos existentes
            if (ordenId) {
                const mockOrden: OrdenCompraEditar = {
                    OCID: 1,
                    TipoOC: "IMPORTACION",
                    NumeroOC: "OC-2025-001",
                    FechaOC: "2025-09-10",
                    FormaPagoID: 1,
                    MonedaID: 2,
                    MontoTotal: 75320.50,
                    EstadoID: 2,
                    ProveedorID: 1001,
                    RSocialProveedor: "SCHNEIDER ELECTRIC PERU S.A.",
                    Detalles: [
                        {
                            OCDetalleID: 1,
                            ItemID: 101,
                            ItemOC: "OC-001",
                            Cantidad: 25,
                            PrecioCompraUnitario1: 1250.75,
                            TipoCambioUSD: 3.75,
                            TiempoEntregaSemanas: 8,
                            NumCotizacionProveedor: "COT-SE-2025-0156",
                            PaisEmbarque: "Francia",
                            CiudadEmbarque: "Le Havre",
                            PaisOrigen: "Francia",
                            TipoEmbarque: "MARITIMO",
                            IncotermID: 3,
                            OperadorLogisticoID: 5,
                            Nota1: "Requiere certificación CE",
                            Nota2: "Embalaje especial para transporte marítimo",
                            Item: {
                                ItemID: 101,
                                CodCom: "COM-SE-001",
                                Descrip: "Variador de frecuencia 75kW, 380-480V, IP20",
                                UnidadMedida: { Codigo: "UND" },
                                Marca: { Nombre: "Schneider Electric" }
                            }
                        }
                    ]
                };
                setOrdenCompra(mockOrden);
            }

        } catch (error) {
            console.error("Error al cargar datos:", error);
            setError('Error al cargar los datos necesarios para la edición');
        } finally {
            setLoading(false);
        }
    };

    const validarFormulario = (): boolean => {
        const errores: Record<string, string> = {};

        // Validaciones step 0 - Información General
        if (!ordenCompra.TipoOC) errores.TipoOC = 'El tipo de orden es obligatorio';
        if (!ordenCompra.NumeroOC.trim()) errores.NumeroOC = 'El número de orden es obligatorio';
        if (!ordenCompra.FechaOC) errores.FechaOC = 'La fecha de orden es obligatoria';
        if (!ordenCompra.ProveedorID) errores.ProveedorID = 'Debe seleccionar un proveedor';
        if (!ordenCompra.FormaPagoID) errores.FormaPagoID = 'Debe seleccionar una forma de pago';
        if (!ordenCompra.MonedaID) errores.MonedaID = 'Debe seleccionar una moneda';

        // Validaciones step 1 - Items
        if (ordenCompra.Detalles.length === 0) {
            errores.detalles = 'Debe agregar al menos un item a la orden';
        }

        ordenCompra.Detalles.forEach((detalle, index) => {
            if (!detalle.ItemID) errores[`item_${index}`] = `Item ${index + 1}: Debe seleccionar un producto`;
            if (!detalle.Cantidad || detalle.Cantidad <= 0) errores[`cantidad_${index}`] = `Item ${index + 1}: Cantidad debe ser mayor a 0`;
            if (!detalle.PrecioCompraUnitario1 || detalle.PrecioCompraUnitario1 <= 0) errores[`precio_${index}`] = `Item ${index + 1}: Precio debe ser mayor a 0`;
        });

        setValidationErrors(errores);
        return Object.keys(errores).length === 0;
    };

    const handleSave = async () => {
        if (!validarFormulario()) {
            return;
        }

        setSaving(true);
        try {
            // Simular guardado
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Calcular monto total
            const montoTotal = ordenCompra.Detalles.reduce((total, detalle) =>
                total + (detalle.Cantidad * detalle.PrecioCompraUnitario1), 0
            );

            console.log('Guardando orden:', { ...ordenCompra, MontoTotal: montoTotal });

            // Redirigir al detalle
            window.location.href = `/compras/${ordenCompra.OCID || 'nueva'}`;

        } catch (error) {
            console.error("Error al guardar:", error);
            setError('Error al guardar la orden de compra');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (ordenCompra.OCID) {
            window.location.href = `/compras/${ordenCompra.OCID}`;
        } else {
            window.location.href = '/compras';
        }
    };

    const agregarDetalle = () => {
        const nuevoDetalle: OrdenCompraDetalleEditar = {
            ItemID: null,
            ItemOC: `OC-${ordenCompra.Detalles.length + 1}`.padStart(6, '0'),
            Cantidad: 1,
            PrecioCompraUnitario1: 0,
            TipoCambioUSD: 3.75,
            TiempoEntregaSemanas: 4,
            NumCotizacionProveedor: '',
            PaisEmbarque: '',
            CiudadEmbarque: '',
            PaisOrigen: '',
            TipoEmbarque: 'MARITIMO',
            IncotermID: 3,
            OperadorLogisticoID: null,
            Nota1: '',
            Nota2: ''
        };

        setOrdenCompra(prev => ({
            ...prev,
            Detalles: [...prev.Detalles, nuevoDetalle]
        }));
    };

    const eliminarDetalle = (index: number) => {
        setOrdenCompra(prev => ({
            ...prev,
            Detalles: prev.Detalles.filter((_, i) => i !== index)
        }));
    };

    const actualizarDetalle = (index: number, campo: keyof OrdenCompraDetalleEditar, valor: any) => {
        setOrdenCompra(prev => ({
            ...prev,
            Detalles: prev.Detalles.map((detalle, i) =>
                i === index ? { ...detalle, [campo]: valor } : detalle
            )
        }));

        // Si se selecciona un item, actualizar la información
        if (campo === 'ItemID' && valor) {
            const item = items.find(i => i.value === valor);
            if (item) {
                actualizarDetalle(index, 'Item', {
                    ItemID: valor,
                    CodCom: item.extra.codCom,
                    Descrip: item.extra.descrip,
                    UnidadMedida: { Codigo: item.extra.unidad },
                    Marca: { Nombre: item.extra.marca }
                });
            }
        }
    };

    const calcularMontoTotal = () => {
        return ordenCompra.Detalles.reduce((total, detalle) =>
            total + (detalle.Cantidad * detalle.PrecioCompraUnitario1), 0
        );
    };

    const handleNext = () => {
        if (currentStep === 0) {
            // Validar información general antes de avanzar
            const erroresStep0 = {};


            if (Object.keys(erroresStep0).length > 0) {
                setValidationErrors(erroresStep0);
                return;
            }
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={400} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent={'space-between'} spacing={2}>
                <Box>
                    <Typography variant="h4" component="h1" fontWeight={700} color="primary">
                        {ordenCompra.OCID ? `Editar Orden ${ordenCompra.NumeroOC}` : 'Nueva Orden de Compra'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {ordenCompra.OCID ? 'Modifique los campos necesarios y guarde los cambios' : 'Complete la información para crear una nueva orden de compra'}
                    </Typography>
                </Box>
                <Box>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={handleCancel}
                            size="large"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            disabled={saving}
                            size="large"
                        >
                            {saving ? 'Guardando...' : 'Guardar Orden'}
                        </Button>
                    </Stack>
                </Box>
            </Stack>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Stepper */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Stepper activeStep={currentStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </CardContent>
            </Card>

            {/* Contenido principal */}
            <Card elevation={2}>
                <CardContent sx={{ p: 4 }}>
                    {/* Step 0 - Información General */}
                    {currentStep === 0 && (
                        <Box>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', mb: 3 }}>
                                <BusinessIcon />
                                Información General de la Orden
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 2, md: 6 }}>
                                    <FormControl fullWidth error={!!validationErrors.TipoOC}>
                                        <InputLabel>Tipo de Orden *</InputLabel>
                                        <Select
                                            value={ordenCompra.TipoOC}
                                            onChange={(e) => setOrdenCompra(prev => ({ ...prev, TipoOC: e.target.value }))}
                                            label="Tipo de Orden *"
                                        >
                                            <MenuItem value="NACIONAL">Nacional</MenuItem>
                                            <MenuItem value="IMPORTACION">Importación</MenuItem>
                                        </Select>
                                        {validationErrors.TipoOC && <FormHelperText>{validationErrors.TipoOC}</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 2, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Número de Orden *"
                                        value={ordenCompra.NumeroOC}
                                        onChange={(e) => setOrdenCompra(prev => ({ ...prev, NumeroOC: e.target.value }))}
                                        error={!!validationErrors.NumeroOC}
                                        helperText={validationErrors.NumeroOC || 'Ingrese el número de la orden de compra'}
                                    />
                                </Grid>

                                <Grid size={{ xs: 2, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Fecha de Orden *"
                                        type="date"
                                        value={ordenCompra.FechaOC}
                                        onChange={(e) => setOrdenCompra(prev => ({ ...prev, FechaOC: e.target.value }))}
                                        InputLabelProps={{ shrink: true }}
                                        error={!!validationErrors.FechaOC}
                                        helperText={validationErrors.FechaOC}
                                    />
                                </Grid>

                                <Grid size={{ xs: 2, md: 6 }}>
                                    <FormControl fullWidth error={!!validationErrors.MonedaID}>
                                        <InputLabel>Moneda *</InputLabel>
                                        <Select
                                            value={ordenCompra.MonedaID || ''}
                                            onChange={(e) => setOrdenCompra(prev => ({ ...prev, MonedaID: Number(e.target.value) }))}
                                            label="Moneda *"
                                        >
                                            {monedas.map((moneda) => (
                                                <MenuItem key={moneda.value} value={moneda.value}>
                                                    {moneda.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {validationErrors.MonedaID && <FormHelperText>{validationErrors.MonedaID}</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <FormControl fullWidth error={!!validationErrors.ProveedorID}>
                                        <Autocomplete
                                            options={proveedores}
                                            getOptionLabel={(option) => option.label}
                                            value={proveedores.find(p => p.value === ordenCompra.ProveedorID) || null}
                                            onChange={(event, newValue) => {
                                                setOrdenCompra(prev => ({
                                                    ...prev,
                                                    ProveedorID: newValue?.value || null,
                                                    RSocialProveedor: newValue?.label || ''
                                                }));
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Proveedor *"
                                                    placeholder="Buscar proveedor..."
                                                    error={!!validationErrors.ProveedorID}
                                                    helperText={validationErrors.ProveedorID || 'Seleccione el proveedor para esta orden'}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <SearchIcon />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                            renderOption={(props, option) => (
                                                <Box component="li" {...props}>
                                                    <Box>
                                                        <Typography variant="body1">{option.label}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            RUC: {option.extra?.ruc} • {option.extra?.pais}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 2, md: 6 }}>
                                    <FormControl fullWidth error={!!validationErrors.FormaPagoID}>
                                        <InputLabel>Forma de Pago *</InputLabel>
                                        <Select
                                            value={ordenCompra.FormaPagoID || ''}
                                            onChange={(e) => setOrdenCompra(prev => ({ ...prev, FormaPagoID: Number(e.target.value) }))}
                                            label="Forma de Pago *"
                                        >
                                            {formasPago.map((forma) => (
                                                <MenuItem key={forma.value} value={forma.value}>
                                                    {forma.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {validationErrors.FormaPagoID && <FormHelperText>{validationErrors.FormaPagoID}</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 2, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Monto Total"
                                        value={calcularMontoTotal().toFixed(2)}
                                        InputProps={{
                                            readOnly: true,
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                        helperText="Se calcula automáticamente basado en los items"
                                        variant="filled"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Step 1 - Detalles de Items */}
                    {currentStep === 1 && (
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                                    <InventoryIcon />
                                    Items de la Orden
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={agregarDetalle}
                                    size="large"
                                >
                                    Agregar Item
                                </Button>
                            </Box>

                            {validationErrors.detalles && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {validationErrors.detalles}
                                </Alert>
                            )}

                            {ordenCompra.Detalles.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <InventoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        No hay items en esta orden
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Agregue items para completar la orden de compra
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={agregarDetalle}
                                    >
                                        Agregar Primer Item
                                    </Button>
                                </Box>
                            ) : (
                                <Stack spacing={2}>
                                    {ordenCompra.Detalles.map((detalle, index) => (
                                        <Card key={index} variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid size={{ xs: 12 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                                        <Typography variant="h6" color="primary">
                                                            Item {index + 1}
                                                        </Typography>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => eliminarDetalle(index)}
                                                            size="small"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                </Grid>

                                                <Grid size={{ xs: 2, md: 6 }}>
                                                    <FormControl fullWidth error={!!validationErrors[`item_${index}`]}>
                                                        <Autocomplete
                                                            options={items}
                                                            getOptionLabel={(option) => `${option.extra?.codCom} - ${option.label}`}
                                                            value={items.find(i => i.value === detalle.ItemID) || null}
                                                            onChange={(event, newValue) => {
                                                                actualizarDetalle(index, 'ItemID', newValue?.value || null);
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Producto *"
                                                                    placeholder="Buscar producto..."
                                                                    error={!!validationErrors[`item_${index}`]}
                                                                    helperText={validationErrors[`item_${index}`]}
                                                                />
                                                            )}
                                                            renderOption={(props, option) => (
                                                                <Box component="li" {...props}>
                                                                    <Box>
                                                                        <Typography variant="body2" fontWeight="medium">
                                                                            {option.extra?.codCom} - {option.label}
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {option.extra?.marca} • {option.extra?.unidad}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            )}
                                                        />
                                                    </FormControl>
                                                </Grid>

                                                <Grid size={{ xs: 6, md: 2 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Cantidad *"
                                                        type="number"
                                                        value={detalle.Cantidad}
                                                        onChange={(e) => actualizarDetalle(index, 'Cantidad', Number(e.target.value))}
                                                        error={!!validationErrors[`cantidad_${index}`]}
                                                        helperText={validationErrors[`cantidad_${index}`]}
                                                        inputProps={{ min: 0 }}
                                                    />
                                                </Grid>

                                                <Grid size={{ xs: 6, md: 2 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Precio Unit. *"
                                                        type="number"
                                                        value={detalle.PrecioCompraUnitario1}
                                                        onChange={(e) => actualizarDetalle(index, 'PrecioCompraUnitario1', Number(e.target.value))}
                                                        error={!!validationErrors[`precio_${index}`]}
                                                        helperText={validationErrors[`precio_${index}`]}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                        }}
                                                        inputProps={{ min: 0, step: 0.01 }}
                                                    />
                                                </Grid>

                                                <Grid size={{ xs: 12, md: 2 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Subtotal"
                                                        value={(detalle.Cantidad * detalle.PrecioCompraUnitario1).toFixed(2)}
                                                        InputProps={{
                                                            readOnly: true,
                                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                        }}
                                                        variant="filled"
                                                    />
                                                </Grid>

                                                <Grid size={{ xs: 6, md: 3 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Código Item"
                                                        value={detalle.ItemOC}
                                                        onChange={(e) => actualizarDetalle(index, 'ItemOC', e.target.value)}
                                                    />
                                                </Grid>

                                                <Grid size={{ xs: 6, md: 3 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Tiempo Entrega (sem)"
                                                        type="number"
                                                        value={detalle.TiempoEntregaSemanas}
                                                        onChange={(e) => actualizarDetalle(index, 'TiempoEntregaSemanas', Number(e.target.value))}
                                                        inputProps={{ min: 1 }}
                                                    />
                                                </Grid>

                                                <Grid size={{ xs: 6, md: 3 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Tipo de Cambio USD"
                                                        type="number"
                                                        value={detalle.TipoCambioUSD}
                                                        onChange={(e) => actualizarDetalle(index, 'TipoCambioUSD', Number(e.target.value))}
                                                        inputProps={{ min: 0, step: 0.001 }}
                                                    />
                                                </Grid>

                                                <Grid size={{ xs: 6, md: 3 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Cotización Proveedor"
                                                        value={detalle.NumCotizacionProveedor}
                                                        onChange={(e) => actualizarDetalle(index, 'NumCotizacionProveedor', e.target.value)}
                                                    />
                                                </Grid>

                                                <Grid size={{ xs: 2, md: 6 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Nota 1"
                                                        value={detalle.Nota1}
                                                        onChange={(e) => actualizarDetalle(index, 'Nota1', e.target.value)}
                                                        multiline
                                                        rows={2}
                                                    />
                                                </Grid>

                                                <Grid size={{ xs: 2, md: 6 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Nota 2"
                                                        value={detalle.Nota2}
                                                        onChange={(e) => actualizarDetalle(index, 'Nota2', e.target.value)}
                                                        multiline
                                                        rows={2}
                                                    />
                                                </Grid>

                                                {detalle.Item && (
                                                    <Grid size={{ xs: 12 }}>
                                                        <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                                                            <Typography variant="body2" fontWeight="medium" gutterBottom>
                                                                Información del Producto:
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {detalle.Item.Descrip} • {detalle.Item.Marca.Nombre} • {detalle.Item.UnidadMedida.Codigo}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Card>
                                    ))}

                                    {/* Resumen de totales */}
                                    <Card sx={{ bgcolor: 'primary.50', p: 3 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid size={{ xs: 2, md: 6 }}>
                                                <Typography variant="h6" color="primary">
                                                    Resumen de la Orden
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {ordenCompra.Detalles.length} items en total
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 2, md: 6 }}>
                                                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                                    <Typography variant="h4" fontWeight="bold" color="primary">
                                                        ${calcularMontoTotal().toFixed(2)}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Monto Total (antes de impuestos)
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Stack>
                            )}
                        </Box>
                    )}

                    {/* Step 2 - Configuración Logística */}
                    {currentStep === 2 && (
                        <Box>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', mb: 3 }}>
                                <ShippingIcon />
                                Configuración Logística
                            </Typography>

                            <Alert severity="info" sx={{ mb: 3 }}>
                                <Typography variant="body2">
                                    Esta configuración se aplicará a todos los items de la orden. Podrá personalizar cada item individualmente después de guardar.
                                </Typography>
                            </Alert>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 2, md: 6 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Tipo de Embarque</InputLabel>
                                        <Select
                                            value={ordenCompra.Detalles[0]?.TipoEmbarque || 'MARITIMO'}
                                            onChange={(e) => {
                                                // Aplicar a todos los detalles
                                                setOrdenCompra(prev => ({
                                                    ...prev,
                                                    Detalles: prev.Detalles.map(d => ({ ...d, TipoEmbarque: e.target.value }))
                                                }));
                                            }}
                                            label="Tipo de Embarque"
                                        >
                                            <MenuItem value="MARITIMO">Marítimo</MenuItem>
                                            <MenuItem value="AEREO">Aéreo</MenuItem>
                                            <MenuItem value="TERRESTRE">Terrestre</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 2, md: 6 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Incoterm</InputLabel>
                                        <Select
                                            value={ordenCompra.Detalles[0]?.IncotermID || 3}
                                            onChange={(e) => {
                                                setOrdenCompra(prev => ({
                                                    ...prev,
                                                    Detalles: prev.Detalles.map(d => ({ ...d, IncotermID: Number(e.target.value) }))
                                                }));
                                            }}
                                            label="Incoterm"
                                        >
                                            {incoterms.map((incoterm) => (
                                                <MenuItem key={incoterm.value} value={incoterm.value}>
                                                    {incoterm.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12., md: 4 }}>
                                    <TextField
                                        fullWidth
                                        label="País de Origen"
                                        value={ordenCompra.Detalles[0]?.PaisOrigen || ''}
                                        onChange={(e) => {
                                            setOrdenCompra(prev => ({
                                                ...prev,
                                                Detalles: prev.Detalles.map(d => ({ ...d, PaisOrigen: e.target.value }))
                                            }));
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12., md: 4 }}>
                                    <TextField
                                        fullWidth
                                        label="País de Embarque"
                                        value={ordenCompra.Detalles[0]?.PaisEmbarque || ''}
                                        onChange={(e) => {
                                            setOrdenCompra(prev => ({
                                                ...prev,
                                                Detalles: prev.Detalles.map(d => ({ ...d, PaisEmbarque: e.target.value }))
                                            }));
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12., md: 4 }}>
                                    <TextField
                                        fullWidth
                                        label="Ciudad de Embarque"
                                        value={ordenCompra.Detalles[0]?.CiudadEmbarque || ''}
                                        onChange={(e) => {
                                            setOrdenCompra(prev => ({
                                                ...prev,
                                                Detalles: prev.Detalles.map(d => ({ ...d, CiudadEmbarque: e.target.value }))
                                            }));
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 2, md: 6 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Operador Logístico</InputLabel>
                                        <Select
                                            value={ordenCompra.Detalles[0]?.OperadorLogisticoID || ''}
                                            onChange={(e) => {
                                                setOrdenCompra(prev => ({
                                                    ...prev,
                                                    Detalles: prev.Detalles.map(d => ({ ...d, OperadorLogisticoID: Number(e.target.value) }))
                                                }));
                                            }}
                                            label="Operador Logístico"
                                        >
                                            {operadoresLogisticos.map((operador) => (
                                                <MenuItem key={operador.value} value={operador.value}>
                                                    {operador.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Navegación de pasos */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 4, borderTop: 1, borderColor: 'divider', mt: 4 }}>
                        <Button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            startIcon={<ArrowBackIcon />}
                        >
                            Anterior
                        </Button>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {currentStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                    disabled={saving}
                                    startIcon={<SaveIcon />}
                                    size="large"
                                >
                                    {saving ? 'Guardando...' : 'Guardar Orden'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    endIcon={<ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
                                >
                                    Siguiente
                                </Button>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default OrdenCompraEditar;