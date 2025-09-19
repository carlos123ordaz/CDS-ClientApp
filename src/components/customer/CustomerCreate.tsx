import React, { useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    Stack,
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
} from '@mui/material';
import {
    Close as CloseIcon,
    Save as SaveIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

// Interfaz basada en la tabla Empresa de la BD
interface Empresa {
    empresaID: number;
    tipoDocumento: string;
    numDoc: string;
    razonSocial: string;
    tipoCliente: string;
    industria: string;
    sector: string;
    zona: string;
    pais: string;
    fecCreacion: Date;
    fecModific: Date;
    estado: boolean;
    ib_Prv: boolean;  // Es proveedor
    ib_Clt: boolean;  // Es cliente
    // Campos adicionales no en BD principal
    telefono?: string;
    correo?: string;
    direccion?: string;
    contactoPrincipal?: string;
    cargoContacto?: string;
}

// Interfaz para el formulario
interface EmpresaForm {
    tipoDocumento: string;
    numDoc: string;
    razonSocial: string;
    tipoCliente: string;
    industria: string;
    sector: string;
    zona: string;
    pais: string;
    estado: boolean;
    ib_Prv: boolean;
    ib_Clt: boolean;
    // Campos adicionales
    telefono: string;
    correo: string;
    direccion: string;
    contactoPrincipal: string;
    cargoContacto: string;
    incluirDatosAdicionales: boolean;
}

// Opciones para los selects basadas en contexto peruano/latinoamericano
const industrias = [
    { value: '', label: 'Seleccione...' },
    { value: 'Manufactura', label: 'Manufactura' },
    { value: 'Tecnología', label: 'Tecnología' },
    { value: 'Servicios', label: 'Servicios' },
    { value: 'Construcción', label: 'Construcción' },
    { value: 'Minería', label: 'Minería' },
    { value: 'Agricultura', label: 'Agricultura' },
    { value: 'Comercio', label: 'Comercio' },
    { value: 'Transporte', label: 'Transporte y Logística' },
    { value: 'Financiero', label: 'Financiero y Seguros' },
    { value: 'Educación', label: 'Educación' },
    { value: 'Salud', label: 'Salud' },
];

const sectores = [
    { value: '', label: 'Seleccione...' },
    { value: 'Industrial', label: 'Industrial' },
    { value: 'Software', label: 'Software y TI' },
    { value: 'Consultoría', label: 'Consultoría' },
    { value: 'Comercial', label: 'Comercial' },
    { value: 'Educación', label: 'Educativo' },
    { value: 'Distribución', label: 'Distribución' },
    { value: 'Logística', label: 'Logística' },
    { value: 'Infraestructura', label: 'Infraestructura' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Bancario', label: 'Bancario' },
];

const zonas = [
    { value: '', label: 'Seleccione...' },
    { value: 'Lima Norte', label: 'Lima Norte' },
    { value: 'Lima Sur', label: 'Lima Sur' },
    { value: 'Lima Este', label: 'Lima Este' },
    { value: 'Lima Centro', label: 'Lima Centro' },
    { value: 'San Isidro', label: 'San Isidro' },
    { value: 'Miraflores', label: 'Miraflores' },
    { value: 'San Borja', label: 'San Borja' },
    { value: 'Surco', label: 'Surco' },
    { value: 'Callao', label: 'Callao' },
    { value: 'Provincia', label: 'Provincia' },
];

const paises = [
    { value: 'Perú', label: 'Perú' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Ecuador', label: 'Ecuador' },
    { value: 'Chile', label: 'Chile' },
    { value: 'Bolivia', label: 'Bolivia' },
    { value: 'Brasil', label: 'Brasil' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Uruguay', label: 'Uruguay' },
    { value: 'Paraguay', label: 'Paraguay' },
    { value: 'Venezuela', label: 'Venezuela' },
];

const tiposCliente = [
    { value: 'CORPORATIVO', label: 'Corporativo' },
    { value: 'PYME', label: 'PYME' },
    { value: 'PERSONA_NATURAL', label: 'Persona Natural' },
    { value: 'GOBIERNO', label: 'Gobierno' },
    { value: 'ONG', label: 'ONG' },
    { value: 'STARTUP', label: 'Startup' },
];

const tiposDocumento = [
    { value: 'RUC', label: 'RUC' },
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carnet de Extranjería' },
    { value: 'PASAPORTE', label: 'Pasaporte' },
];

export const CustomerCreate = ({
    openModal,
    handleCloseModal,
    onEmpresaCreated
}: {
    openModal: boolean;
    handleCloseModal: () => void;
    onEmpresaCreated?: (empresa: Empresa) => void;
}) => {
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
        setValue,
    } = useForm<EmpresaForm>({
        defaultValues: {
            tipoDocumento: 'RUC',
            numDoc: '',
            razonSocial: '',
            tipoCliente: 'CORPORATIVO',
            industria: '',
            sector: '',
            zona: '',
            pais: 'Perú',
            estado: true,
            ib_Prv: false,
            ib_Clt: true,
            telefono: '',
            correo: '',
            direccion: '',
            contactoPrincipal: '',
            cargoContacto: '',
            incluirDatosAdicionales: false,
        }
    });

    const incluirDatosAdicionales = watch('incluirDatosAdicionales');
    const tipoDocumento = watch('tipoDocumento');
    const tipoCliente = watch('tipoCliente');

    // Validar documento según tipo
    const getDocumentValidation = (tipo: string) => {
        switch (tipo) {
            case 'RUC':
                return {
                    required: 'El RUC es requerido',
                    pattern: {
                        value: /^[0-9]{11}$/,
                        message: 'El RUC debe tener 11 dígitos'
                    }
                };
            case 'DNI':
                return {
                    required: 'El DNI es requerido',
                    pattern: {
                        value: /^[0-9]{8}$/,
                        message: 'El DNI debe tener 8 dígitos'
                    }
                };
            case 'CE':
                return {
                    required: 'El Carnet de Extranjería es requerido',
                    minLength: {
                        value: 9,
                        message: 'Mínimo 9 caracteres'
                    }
                };
            default:
                return {
                    required: 'El documento es requerido'
                };
        }
    };

    // Auto-completar campos según tipo de cliente
    React.useEffect(() => {
        if (tipoCliente === 'PERSONA_NATURAL') {
            setValue('tipoDocumento', 'DNI');
            setValue('ib_Prv', false);
            setValue('ib_Clt', true);
        } else {
            setValue('tipoDocumento', 'RUC');
        }
    }, [tipoCliente, setValue]);

    const onSubmit = async (data: EmpresaForm) => {
        setSubmitting(true);

        try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 2000));

            const newEmpresa: Empresa = {
                empresaID: Date.now(), // En producción, esto vendría de la BD
                tipoDocumento: data.tipoDocumento,
                numDoc: data.numDoc,
                razonSocial: data.razonSocial,
                tipoCliente: data.tipoCliente,
                industria: data.industria,
                sector: data.sector,
                zona: data.zona,
                pais: data.pais,
                estado: data.estado,
                ib_Prv: data.ib_Prv,
                ib_Clt: data.ib_Clt,
                fecCreacion: new Date(),
                fecModific: new Date(),
                telefono: data.incluirDatosAdicionales ? data.telefono : undefined,
                correo: data.incluirDatosAdicionales ? data.correo : undefined,
                direccion: data.incluirDatosAdicionales ? data.direccion : undefined,
                contactoPrincipal: data.incluirDatosAdicionales ? data.contactoPrincipal : undefined,
                cargoContacto: data.incluirDatosAdicionales ? data.cargoContacto : undefined,
            };

            // Callback para actualizar la lista padre
            if (onEmpresaCreated) {
                onEmpresaCreated(newEmpresa);
            }

            handleCloseModal();
            reset();
            alert('Empresa creada exitosamente');

        } catch (error) {
            alert('Error al crear la empresa');
            console.error('Error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!submitting) {
            reset();
            handleCloseModal();
        }
    };

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
                    <Typography variant="h6" component="div">
                        Agregar Nueva Empresa
                    </Typography>
                    <IconButton onClick={handleClose} size="small" disabled={submitting}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        {/* Información de identificación */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="h6" gutterBottom color="primary">
                                Información de Identificación
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth error={!!errors.tipoDocumento}>
                                <InputLabel>Tipo de Documento</InputLabel>
                                <Controller
                                    name="tipoDocumento"
                                    control={control}
                                    rules={{ required: 'El tipo de documento es requerido' }}
                                    render={({ field }) => (
                                        <Select {...field} label="Tipo de Documento">
                                            {tiposDocumento.map(tipo => (
                                                <MenuItem key={tipo.value} value={tipo.value}>
                                                    {tipo.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.tipoDocumento && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                        {errors.tipoDocumento.message}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                {...register('numDoc', getDocumentValidation(tipoDocumento))}
                                label={`Número de ${tipoDocumento}`}
                                fullWidth
                                error={!!errors.numDoc}
                                helperText={errors.numDoc?.message}
                                placeholder={tipoDocumento === 'RUC' ? '20123456789' : tipoDocumento === 'DNI' ? '12345678' : ''}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                {...register('razonSocial', {
                                    required: 'La razón social es requerida',
                                    minLength: {
                                        value: 3,
                                        message: 'Mínimo 3 caracteres'
                                    }
                                })}
                                label="Razón Social / Nombres y Apellidos"
                                fullWidth
                                error={!!errors.razonSocial}
                                helperText={errors.razonSocial?.message}
                                placeholder="Ingrese la razón social completa"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth error={!!errors.tipoCliente}>
                                <InputLabel>Tipo de Cliente</InputLabel>
                                <Controller
                                    name="tipoCliente"
                                    control={control}
                                    rules={{ required: 'El tipo de cliente es requerido' }}
                                    render={({ field }) => (
                                        <Select {...field} label="Tipo de Cliente">
                                            {tiposCliente.map(tipo => (
                                                <MenuItem key={tipo.value} value={tipo.value}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {tipo.value === 'PERSONA_NATURAL' ? <PersonIcon fontSize="small" /> : <BusinessIcon fontSize="small" />}
                                                        {tipo.label}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.tipoCliente && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                        {errors.tipoCliente.message}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>País</InputLabel>
                                <Controller
                                    name="pais"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field} label="País">
                                            {paises.map(pais => (
                                                <MenuItem key={pais.value} value={pais.value}>
                                                    {pais.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Grid>

                        {/* Información comercial */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                                Información Comercial
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Industria</InputLabel>
                                <Controller
                                    name="industria"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field} label="Industria">
                                            {industrias.map(industria => (
                                                <MenuItem key={industria.value} value={industria.value}>
                                                    {industria.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Sector</InputLabel>
                                <Controller
                                    name="sector"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field} label="Sector">
                                            {sectores.map(sector => (
                                                <MenuItem key={sector.value} value={sector.value}>
                                                    {sector.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Zona</InputLabel>
                                <Controller
                                    name="zona"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field} label="Zona">
                                            {zonas.map(zona => (
                                                <MenuItem key={zona.value} value={zona.value}>
                                                    {zona.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Grid>

                        {/* Roles en el sistema */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                                Roles en el Sistema
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="ib_Clt"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch {...field} checked={field.value} />
                                        )}
                                    />
                                }
                                label="Es Cliente"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="ib_Prv"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch {...field} checked={field.value} />
                                        )}
                                    />
                                }
                                label="Es Proveedor"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
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
                                label="Empresa Activa"
                            />
                        </Grid>

                        {/* Datos adicionales */}
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ mt: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="incluirDatosAdicionales"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch {...field} checked={field.value} />
                                            )}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocationIcon fontSize="small" />
                                            <Typography>Incluir datos de contacto adicionales</Typography>
                                        </Box>
                                    }
                                />
                            </Box>
                        </Grid>

                        {incluirDatosAdicionales && (
                            <>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="h6" gutterBottom color="primary">
                                        Información de Contacto
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        {...register('telefono', {
                                            pattern: {
                                                value: /^[\+]?[0-9\s\-\(\)]+$/,
                                                message: 'Formato de teléfono inválido'
                                            }
                                        })}
                                        label="Teléfono"
                                        fullWidth
                                        error={!!errors.telefono}
                                        helperText={errors.telefono?.message}
                                        placeholder="+51 123 456 789"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PhoneIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        {...register('correo', {
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Formato de email inválido'
                                            }
                                        })}
                                        label="Correo Electrónico"
                                        fullWidth
                                        type="email"
                                        error={!!errors.correo}
                                        helperText={errors.correo?.message}
                                        placeholder="empresa@dominio.com"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        {...register('direccion')}
                                        label="Dirección"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        placeholder="Dirección completa de la empresa"
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        {...register('contactoPrincipal')}
                                        label="Contacto Principal"
                                        fullWidth
                                        placeholder="Nombres y apellidos del contacto"
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        {...register('cargoContacto')}
                                        label="Cargo del Contacto"
                                        fullWidth
                                        placeholder="Gerente General, Administrador, etc."
                                    />
                                </Grid>
                            </>
                        )}

                        {/* Información adicional */}
                        <Grid size={{ xs: 12 }}>
                            <Alert severity="info" sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    <strong>Nota:</strong> Los campos obligatorios son Tipo de Documento, Número de Documento,
                                    Razón Social y Tipo de Cliente. La fecha de creación y modificación se generarán automáticamente.
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
                        disabled={submitting}
                        startIcon={submitting ? undefined : <SaveIcon />}
                    >
                        {submitting ? 'Guardando...' : 'Guardar Empresa'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};