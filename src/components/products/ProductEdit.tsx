import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Divider,
    Grid,
    Switch,
    FormControlLabel,
    IconButton,
    CircularProgress,
    Skeleton,
} from '@mui/material';
import {
    Close as CloseIcon,
    Save as SaveIcon,
    Edit as EditIcon,
    Language as LanguageIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

// Interfaces (las mismas que en ProductCreate)
interface Item {
    itemID: number;
    tipoItem: string;
    codigoERP: string;
    codCom: string;
    descrip: string;
    modeloTraduc?: string;
    descripTraduc?: string;
    materialTraduc?: string;
    usoTraduc?: string;
    codSunat: string;
    fecCrea: Date;
    fecMod: Date;
    marcaID: number;
    estado: boolean;
    ssClaseID?: number;
    sClaseID?: number;
    claseID?: number;
    marca?: string;
    nombreClase?: string;
    nombreSClase?: string;
    nombreSSClase?: string;
    unidadesMedida?: string[];
    stock?: number;
    stockMinimo?: number;
    precio?: number;
}

interface ProductEditForm {
    tipoItem: string;
    codigoERP: string;
    codCom: string;
    descrip: string;
    marcaID: number;
    claseID: number;
    sClaseID: number;
    ssClaseID: number;
    codSunat: string;
    estado: boolean;
    modeloTraduc: string;
    descripTraduc: string;
    materialTraduc: string;
    usoTraduc: string;
    incluirTraducciones: boolean;
    precio: number;
    stock: number;
    stockMinimo: number;
    unidadMedidaID: number;
}

interface Marca {
    marcaID: number;
    codigo: string;
    nombre: string;
    descrip: string;
    nCorto: string;
    estado: boolean;
}

interface Clase {
    claseID: number;
    nombre: string;
    codigo: string;
    estado: boolean;
}

interface SClase {
    sClaseID: number;
    claseID: number;
    nombre: string;
    codigo: string;
    estado: boolean;
}

interface SSClase {
    ssClaseID: number;
    sClaseID: number;
    claseID: number;
    nombre: string;
    codigo: string;
    estado: boolean;
}

interface UnidadMedida {
    umID: number;
    codigo: string;
    descrip: string;
    estado: boolean;
}

interface ProductEditProps {
    openModal: boolean;
    handleCloseModal: () => void;
    item: Item | null;
    marcas: Marca[];
    clases: Clase[];
    onItemUpdated?: (item: Item) => void;
}

export const ProductEdit: React.FC<ProductEditProps> = ({
    openModal,
    handleCloseModal,
    item,
    marcas,
    clases,
    onItemUpdated
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sClases, setSClases] = useState<SClase[]>([]);
    const [ssClases, setSSClases] = useState<SSClase[]>([]);
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isDirty }
    } = useForm<ProductEditForm>({
        defaultValues: {
            tipoItem: 'PRODUCTO',
            codigoERP: '',
            codCom: '',
            descrip: '',
            marcaID: 0,
            claseID: 0,
            sClaseID: 0,
            ssClaseID: 0,
            codSunat: '',
            estado: true,
            modeloTraduc: '',
            descripTraduc: '',
            materialTraduc: '',
            usoTraduc: '',
            incluirTraducciones: false,
            precio: 0,
            stock: 0,
            stockMinimo: 0,
            unidadMedidaID: 0,
        }
    });

    const incluirTraducciones = watch('incluirTraducciones');
    const claseSeleccionada = watch('claseID');
    const sClaseSeleccionada = watch('sClaseID');

    // Mock data (mismos que en ProductCreate)
    const mockSClases: SClase[] = [
        { sClaseID: 1, claseID: 1, nombre: 'Presión', codigo: '01-PRES', estado: true },
        { sClaseID: 2, claseID: 1, nombre: 'Analíticos', codigo: '02-ANAL', estado: true },
        { sClaseID: 3, claseID: 2, nombre: 'Cables', codigo: '01-CAB', estado: true },
    ];

    const mockSSClases: SSClase[] = [
        { ssClaseID: 1, sClaseID: 1, claseID: 1, nombre: 'Diferencial', codigo: '01-DIFF', estado: true },
        { ssClaseID: 2, sClaseID: 1, claseID: 1, nombre: 'Absoluta', codigo: '02-ABS', estado: true },
        { ssClaseID: 3, sClaseID: 2, claseID: 1, nombre: 'pH', codigo: '01-PH', estado: true },
    ];

    const mockUnidadesMedida: UnidadMedida[] = [
        { umID: 1, codigo: 'UND', descrip: 'Unidad', estado: true },
        { umID: 2, codigo: 'M', descrip: 'Metro', estado: true },
        { umID: 3, codigo: 'HRS', descrip: 'Horas', estado: true },
        { umID: 4, codigo: 'KG', descrip: 'Kilogramo', estado: true },
    ];

    // Cargar datos del item al abrir el modal
    useEffect(() => {
        if (openModal && item) {
            setLoading(true);

            // Simular carga de datos adicionales
            setTimeout(() => {
                setSClases(mockSClases);
                setSSClases(mockSSClases);
                setUnidadesMedida(mockUnidadesMedida);

                const hasTranslations = !!(item.modeloTraduc || item.descripTraduc ||
                    item.materialTraduc || item.usoTraduc);

                reset({
                    tipoItem: item.tipoItem || 'PRODUCTO',
                    codigoERP: item.codigoERP || '',
                    codCom: item.codCom || '',
                    descrip: item.descrip || '',
                    marcaID: item.marcaID || 0,
                    claseID: item.claseID || 0,
                    sClaseID: item.sClaseID || 0,
                    ssClaseID: item.ssClaseID || 0,
                    codSunat: item.codSunat || '',
                    estado: item.estado ?? true,
                    modeloTraduc: item.modeloTraduc || '',
                    descripTraduc: item.descripTraduc || '',
                    materialTraduc: item.materialTraduc || '',
                    usoTraduc: item.usoTraduc || '',
                    incluirTraducciones: hasTranslations,
                    precio: item.precio || 0,
                    stock: item.stock || 0,
                    stockMinimo: item.stockMinimo || 0,
                    unidadMedidaID: 1, // Por defecto UND
                });

                setLoading(false);
            }, 500);
        }
    }, [openModal, item, reset]);

    // Filtrar subclases según clase seleccionada
    const sClasesFiltradas = sClases.filter(sc => sc.claseID === claseSeleccionada);

    // Filtrar sub-subclases según subclase seleccionada
    const ssClasesFiltradas = ssClases.filter(ssc =>
        ssc.sClaseID === sClaseSeleccionada && ssc.claseID === claseSeleccionada
    );

    // Reset subclases cuando cambia la clase
    useEffect(() => {
        if (claseSeleccionada) {
            setValue('sClaseID', 0);
            setValue('ssClaseID', 0);
        }
    }, [claseSeleccionada, setValue]);

    // Reset sub-subclases cuando cambia la subclase
    useEffect(() => {
        if (sClaseSeleccionada) {
            setValue('ssClaseID', 0);
        }
    }, [sClaseSeleccionada, setValue]);

    const onSubmit = async (data: ProductEditForm) => {
        if (!item) return;

        setSubmitting(true);

        try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 2000));

            const updatedItem: Item = {
                ...item,
                tipoItem: data.tipoItem,
                codigoERP: data.codigoERP,
                codCom: data.codCom,
                descrip: data.descrip,
                marcaID: data.marcaID,
                claseID: data.claseID || undefined,
                sClaseID: data.sClaseID || undefined,
                ssClaseID: data.ssClaseID || undefined,
                codSunat: data.codSunat,
                estado: data.estado,
                modeloTraduc: data.incluirTraducciones ? data.modeloTraduc : undefined,
                descripTraduc: data.incluirTraducciones ? data.descripTraduc : undefined,
                materialTraduc: data.incluirTraducciones ? data.materialTraduc : undefined,
                usoTraduc: data.incluirTraducciones ? data.usoTraduc : undefined,
                fecMod: new Date(),
                // Datos relacionados actualizados
                marca: marcas.find(m => m.marcaID === data.marcaID)?.nombre,
                nombreClase: clases.find(c => c.claseID === data.claseID)?.nombre,
                nombreSClase: sClases.find(sc => sc.sClaseID === data.sClaseID)?.nombre,
                nombreSSClase: ssClases.find(ssc => ssc.ssClaseID === data.ssClaseID)?.nombre,
                precio: data.precio > 0 ? data.precio : undefined,
                stock: data.stock,
                stockMinimo: data.stockMinimo,
            };

            if (onItemUpdated) {
                onItemUpdated(updatedItem);
            }

            handleClose();
            alert('Item actualizado exitosamente');

        } catch (error) {
            alert('Error al actualizar el item');
            console.error('Error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!submitting) {
            if (isDirty) {
                if (window.confirm('¿Estás seguro de que quieres cerrar? Se perderán los cambios no guardados.')) {
                    reset();
                    handleCloseModal();
                }
            } else {
                handleCloseModal();
            }
        }
    };

    if (!item) {
        return null;
    }

    // Opciones para selects
    const tiposItem = [
        { value: 'PRODUCTO', label: 'Producto' },
        { value: 'SERVICIO', label: 'Servicio' },
        { value: 'REPUESTO', label: 'Repuesto' },
        { value: 'ACCESORIO', label: 'Accesorio' },
    ];

    return (
        <Dialog
            open={openModal}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { minHeight: '80vh' }
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EditIcon color="primary" />
                        <Typography variant="h6" component="div">
                            Editar Item - {item.codigoERP}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleClose} size="small" disabled={submitting}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            {loading ? (
                <DialogContent dividers>
                    <Box sx={{ p: 2 }}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <Skeleton variant="text" width={200} height={32} />
                                <Skeleton variant="rectangular" width="100%" height={1} sx={{ my: 2 }} />
                            </Grid>
                            {[...Array(8)].map((_, i) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                                    <Skeleton variant="text" width={120} height={20} />
                                    <Skeleton variant="rectangular" width="100%" height={56} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </DialogContent>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent dividers>
                        <Grid container spacing={3}>
                            {/* Información del item */}
                            <Grid size={{ xs: 12 }}>
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    <Typography variant="body2">
                                        <strong>ID:</strong> {item.itemID} |
                                        <strong> Creado:</strong> {item.fecCrea.toLocaleDateString()} |
                                        <strong> Última modificación:</strong> {item.fecMod.toLocaleDateString()}
                                    </Typography>
                                </Alert>
                            </Grid>

                            {/* Información básica */}
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Información Básica
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth error={!!errors.tipoItem}>
                                    <InputLabel>Tipo de Item</InputLabel>
                                    <Controller
                                        name="tipoItem"
                                        control={control}
                                        rules={{ required: 'El tipo de item es requerido' }}
                                        render={({ field }) => (
                                            <Select {...field} label="Tipo de Item">
                                                {tiposItem.map(tipo => (
                                                    <MenuItem key={tipo.value} value={tipo.value}>
                                                        {tipo.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    {errors.tipoItem && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                            {errors.tipoItem.message}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    {...register('codigoERP', {
                                        required: 'El código ERP es requerido',
                                        minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                                    })}
                                    label="Código ERP"
                                    fullWidth
                                    error={!!errors.codigoERP}
                                    helperText={errors.codigoERP?.message}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth error={!!errors.marcaID}>
                                    <InputLabel>Marca</InputLabel>
                                    <Controller
                                        name="marcaID"
                                        control={control}
                                        rules={{ required: 'La marca es requerida' }}
                                        render={({ field }) => (
                                            <Select {...field} label="Marca">
                                                <MenuItem value={0}>Seleccionar marca</MenuItem>
                                                {marcas.filter(m => m.estado).map(marca => (
                                                    <MenuItem key={marca.marcaID} value={marca.marcaID}>
                                                        {marca.nombre}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    {errors.marcaID && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                            {errors.marcaID.message}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    {...register('codCom', { required: 'El código comercial es requerido' })}
                                    label="Código Comercial"
                                    fullWidth
                                    error={!!errors.codCom}
                                    helperText={errors.codCom?.message}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    {...register('descrip', {
                                        required: 'La descripción es requerida',
                                        minLength: { value: 10, message: 'Mínimo 10 caracteres' }
                                    })}
                                    label="Descripción"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    error={!!errors.descrip}
                                    helperText={errors.descrip?.message}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    {...register('codSunat')}
                                    label="Código SUNAT"
                                    fullWidth
                                    placeholder="90261000"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="estado"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch {...field} checked={field.value} />
                                            )}
                                        />
                                    }
                                    label="Item Activo"
                                />
                            </Grid>

                            {/* Clasificación */}
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                                    Clasificación
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Clase</InputLabel>
                                    <Controller
                                        name="claseID"
                                        control={control}
                                        render={({ field }) => (
                                            <Select {...field} label="Clase">
                                                <MenuItem value={0}>Sin clasificar</MenuItem>
                                                {clases.filter(c => c.estado).map(clase => (
                                                    <MenuItem key={clase.claseID} value={clase.claseID}>
                                                        {clase.nombre}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Sub Clase</InputLabel>
                                    <Controller
                                        name="sClaseID"
                                        control={control}
                                        render={({ field }) => (
                                            <Select {...field} label="Sub Clase" disabled={!claseSeleccionada}>
                                                <MenuItem value={0}>Sin sub clase</MenuItem>
                                                {sClasesFiltradas.map(sClase => (
                                                    <MenuItem key={sClase.sClaseID} value={sClase.sClaseID}>
                                                        {sClase.nombre}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Sub Sub Clase</InputLabel>
                                    <Controller
                                        name="ssClaseID"
                                        control={control}
                                        render={({ field }) => (
                                            <Select {...field} label="Sub Sub Clase" disabled={!sClaseSeleccionada}>
                                                <MenuItem value={0}>Sin sub sub clase</MenuItem>
                                                {ssClasesFiltradas.map(ssClase => (
                                                    <MenuItem key={ssClase.ssClaseID} value={ssClase.ssClaseID}>
                                                        {ssClase.nombre}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Unidad de Medida</InputLabel>
                                    <Controller
                                        name="unidadMedidaID"
                                        control={control}
                                        render={({ field }) => (
                                            <Select {...field} label="Unidad de Medida">
                                                <MenuItem value={0}>Seleccionar</MenuItem>
                                                {unidadesMedida.filter(um => um.estado).map(unidad => (
                                                    <MenuItem key={unidad.umID} value={unidad.umID}>
                                                        {unidad.codigo} - {unidad.descrip}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            {/* Información comercial/inventario */}
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                                    Información Comercial e Inventario
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    {...register('precio', {
                                        min: { value: 0, message: 'El precio debe ser mayor o igual a 0' }
                                    })}
                                    label="Precio"
                                    type="number"
                                    fullWidth
                                    inputProps={{ step: "0.01", min: 0 }}
                                    error={!!errors.precio}
                                    helperText={errors.precio?.message}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    {...register('stock', {
                                        min: { value: 0, message: 'El stock debe ser mayor o igual a 0' }
                                    })}
                                    label="Stock Actual"
                                    type="number"
                                    fullWidth
                                    inputProps={{ min: 0 }}
                                    error={!!errors.stock}
                                    helperText={errors.stock?.message}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    {...register('stockMinimo', {
                                        min: { value: 0, message: 'El stock mínimo debe ser mayor o igual a 0' }
                                    })}
                                    label="Stock Mínimo"
                                    type="number"
                                    fullWidth
                                    inputProps={{ min: 0 }}
                                    error={!!errors.stockMinimo}
                                    helperText={errors.stockMinimo?.message}
                                />
                            </Grid>

                            {/* Traducciones */}
                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ mt: 2 }}>
                                    <FormControlLabel
                                        control={
                                            <Controller
                                                name="incluirTraducciones"
                                                control={control}
                                                render={({ field }) => (
                                                    <Switch {...field} checked={field.value} />
                                                )}
                                            />
                                        }
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LanguageIcon fontSize="small" />
                                                <Typography>Mostrar/Editar traducciones al inglés</Typography>
                                            </Box>
                                        }
                                    />
                                </Box>
                            </Grid>

                            {incluirTraducciones && (
                                <>
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="h6" gutterBottom color="primary">
                                            Traducciones al Inglés
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            {...register('modeloTraduc')}
                                            label="Modelo (English)"
                                            fullWidth
                                            placeholder="Model name in English"
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            {...register('materialTraduc')}
                                            label="Material (English)"
                                            fullWidth
                                            placeholder="Material description"
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            {...register('descripTraduc')}
                                            label="Descripción (English)"
                                            fullWidth
                                            multiline
                                            rows={2}
                                            placeholder="Product description in English"
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            {...register('usoTraduc')}
                                            label="Uso/Aplicación (English)"
                                            fullWidth
                                            multiline
                                            rows={2}
                                            placeholder="Usage and application in English"
                                        />
                                    </Grid>
                                </>
                            )}

                            {/* Información de auditoría */}
                            <Grid size={{ xs: 12 }}>
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    <Typography variant="body2">
                                        <strong>Importante:</strong> Al guardar los cambios, se actualizará automáticamente la fecha de modificación.
                                        {isDirty && " Tienes cambios sin guardar."}
                                    </Typography>
                                </Alert>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ p: 3 }}>
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            disabled={submitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting || !isDirty}
                            startIcon={submitting ? <CircularProgress size={16} /> : <SaveIcon />}
                        >
                            {submitting ? 'Actualizando...' : 'Guardar Cambios'}
                        </Button>
                    </DialogActions>
                </form>
            )}
        </Dialog>
    );
};