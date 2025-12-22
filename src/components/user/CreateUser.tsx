import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Box,
    Button,
    Typography,
    IconButton,
    TextField,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Alert,
    Divider,
    CircularProgress,
    Snackbar,
    FormHelperText,
    DialogTitle,
    Dialog,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Switch,
    Chip,
    OutlinedInput,
    Checkbox,
    ListItemText
} from '@mui/material';
import {
    Close as CloseIcon,
    Save as SaveIcon,
    Person as PersonIcon,
    AdminPanelSettings as RolesIcon
} from '@mui/icons-material';

// Interfaces basadas en la estructura de la BD Usuario
interface Usuario {
    usuarioID?: number;
    tipoDoc?: string;
    numDoc?: string;
    nombre?: string;
    apellido?: string;
    esLider: boolean;
    fechaCreacion?: Date;
    fechaModific?: Date;
    estado: boolean;
    areaID: number;
    password: string;
    correo: string;
}

interface Area {
    areaID: number;
    nombre: string;
    nCorto: string;
    estado: boolean;
}

interface Rol {
    rolID: number;
    nombre: string;
    estado: boolean;
}

interface UserFormData {
    tipoDoc: string;
    numDoc: string;
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
    confirmPassword: string;
    areaID: number;
    esLider: boolean;
    rolesIDs: number[];
}

interface CreateUserProps {
    openModal: boolean;
    handleCloseModal: () => void;
    onUserCreated?: (user: Usuario) => void;
}

export const CreateUser = ({ openModal, handleCloseModal, onUserCreated }: CreateUserProps) => {
    const [loading, setLoading] = useState(false);
    const [areas, setAreas] = useState<Area[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [generalError, setGeneralError] = useState<string>('');

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch,
        trigger
    } = useForm<UserFormData>({
        mode: 'onChange',
        defaultValues: {
            tipoDoc: '',
            numDoc: '',
            nombre: '',
            apellido: '',
            correo: '',
            password: '',
            confirmPassword: '',
            areaID: 0,
            esLider: false,
            rolesIDs: []
        }
    });

    const watchPassword = watch('password');

    // Cargar áreas y roles cuando se abre el modal
    useEffect(() => {
        const loadData = async () => {
            try {
                // Simular llamada a API para obtener áreas
                const mockAreas: Area[] = [
                    { areaID: 1, nombre: 'Ventas', nCorto: 'VTA', estado: true },
                    { areaID: 2, nombre: 'Compras', nCorto: 'CMP', estado: true },
                    { areaID: 3, nombre: 'Almacén', nCorto: 'ALM', estado: true },
                    { areaID: 4, nombre: 'Administración', nCorto: 'ADM', estado: true },
                    { areaID: 5, nombre: 'Logística', nCorto: 'LOG', estado: true },
                    { areaID: 6, nombre: 'Finanzas', nCorto: 'FIN', estado: true }
                ];

                // Simular llamada a API para obtener roles
                const mockRoles: Rol[] = [
                    { rolID: 1, nombre: 'Administrador', estado: true },
                    { rolID: 2, nombre: 'Vendedor', estado: true },
                    { rolID: 3, nombre: 'Comprador', estado: true },
                    { rolID: 4, nombre: 'Almacenero', estado: true },
                    { rolID: 5, nombre: 'Supervisor', estado: true },
                    { rolID: 6, nombre: 'Analista', estado: true },
                    { rolID: 7, nombre: 'Operador', estado: true }
                ];

                setAreas(mockAreas.filter(area => area.estado));
                setRoles(mockRoles.filter(rol => rol.estado));
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        if (openModal) {
            loadData();
        }
    }, [openModal]);

    // Resetear formulario cuando se abre el modal
    useEffect(() => {
        if (openModal) {
            reset();
            setGeneralError('');
        }
    }, [openModal, reset]);

    // Enviar formulario
    const onSubmit = async (data: UserFormData) => {
        try {
            setLoading(true);
            setGeneralError('');

            const newUser: Usuario = {
                tipoDoc: data.tipoDoc,
                numDoc: data.numDoc,
                nombre: data.nombre,
                apellido: data.apellido,
                correo: data.correo,
                password: data.password, // En producción debe ser hasheado
                areaID: data.areaID,
                esLider: data.esLider,
                estado: true,
                fechaCreacion: new Date(),
                fechaModific: new Date()
            };

            console.log('Creando usuario:', newUser);
            console.log('Roles seleccionados:', data.rolesIDs);

            // Aquí también se crearían los registros en UsuarioRol
            const rolesAsignados = data.rolesIDs.map(rolID => ({
                rolID: rolID,
                usuarioID: null, // Se asignaría después de crear el usuario
                fechaRegistro: new Date()
            }));

            console.log('Roles a asignar:', rolesAsignados);

            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simular posible error (10% de probabilidad)
            if (Math.random() < 0.1) {
                throw new Error('Error de servidor: No se pudo crear el usuario');
            }

            setShowSuccess(true);
            onUserCreated?.(newUser);

            // Cerrar modal después de mostrar éxito
            setTimeout(() => {
                handleClose();
                setShowSuccess(false);
            }, 1500);

        } catch (err: any) {
            setGeneralError(err.message || 'Error al crear el usuario. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    // Cerrar modal
    const handleClose = () => {
        reset();
        setGeneralError('');
        handleCloseModal();
    };

    const tiposDocumento = [
        { value: 'DNI', label: 'DNI' },
        { value: 'CE', label: 'Carné de Extranjería' },
        { value: 'PASSPORT', label: 'Pasaporte' },
        { value: 'RUC', label: 'RUC' }
    ];

    return (
        <>
            <Dialog
                open={openModal}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', p: 0 }}>
                    <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.dark', width: 48, height: 48 }}>
                                <PersonIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                    Registrar Nuevo Usuario
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Complete la información, área y roles del nuevo usuario
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ px: 4, py: 4 }}>
                    <Box sx={{ mb: 2 }} />
                    <Grid container spacing={3}>
                        {/* Tipo de Documento */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="tipoDoc"
                                control={control}
                                rules={{ required: 'Tipo de documento es requerido' }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.tipoDoc}>
                                        <InputLabel>Tipo de Documento *</InputLabel>
                                        <Select
                                            {...field}
                                            label="Tipo de Documento *"
                                        >
                                            {tiposDocumento.map((tipo) => (
                                                <MenuItem key={tipo.value} value={tipo.value}>
                                                    {tipo.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.tipoDoc && (
                                            <FormHelperText>{errors.tipoDoc.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        {/* Número de Documento */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="numDoc"
                                control={control}
                                rules={{
                                    required: 'Número de documento es requerido',
                                    minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                                    maxLength: { value: 50, message: 'Máximo 50 caracteres' }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Número de Documento *"
                                        error={!!errors.numDoc}
                                        helperText={errors.numDoc?.message}
                                        placeholder="Ej: 12345678"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Nombres */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="nombre"
                                control={control}
                                rules={{
                                    required: 'Nombres son requeridos',
                                    maxLength: { value: 200, message: 'Máximo 200 caracteres' }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Nombres *"
                                        error={!!errors.nombre}
                                        helperText={errors.nombre?.message}
                                        placeholder="Ej: Juan Carlos"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Apellidos */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="apellido"
                                control={control}
                                rules={{
                                    required: 'Apellidos son requeridos',
                                    maxLength: { value: 100, message: 'Máximo 100 caracteres' }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Apellidos *"
                                        error={!!errors.apellido}
                                        helperText={errors.apellido?.message}
                                        placeholder="Ej: Pérez García"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Correo */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="correo"
                                control={control}
                                rules={{
                                    required: 'Correo electrónico es requerido',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Correo electrónico inválido'
                                    }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        type="email"
                                        label="Correo Electrónico *"
                                        error={!!errors.correo}
                                        helperText={errors.correo?.message}
                                        placeholder="usuario@empresa.com"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Área */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="areaID"
                                control={control}
                                rules={{
                                    required: 'Área es requerida',
                                    validate: (value) => value > 0 || 'Seleccione un área válida'
                                }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.areaID}>
                                        <InputLabel>Área *</InputLabel>
                                        <Select
                                            {...field}
                                            label="Área *"
                                        >
                                            {areas.map((area) => (
                                                <MenuItem key={area.areaID} value={area.areaID}>
                                                    {area.nombre} ({area.nCorto})
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.areaID && (
                                            <FormHelperText>{errors.areaID.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        {/* Roles */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="rolesIDs"
                                control={control}
                                rules={{
                                    required: 'Debe seleccionar al menos un rol',
                                    validate: (value) => value.length > 0 || 'Debe seleccionar al menos un rol'
                                }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.rolesIDs}>
                                        <InputLabel>Roles *</InputLabel>
                                        <Select
                                            {...field}
                                            multiple
                                            label="Roles *"
                                            input={<OutlinedInput label="Roles *" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {(selected as number[]).map((value) => {
                                                        const rol = roles.find(r => r.rolID === value);
                                                        return (
                                                            <Chip
                                                                key={value}
                                                                label={rol?.nombre}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                            />
                                                        );
                                                    })}
                                                </Box>
                                            )}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                    },
                                                },
                                            }}
                                        >
                                            {roles.map((rol) => (
                                                <MenuItem key={rol.rolID} value={rol.rolID}>
                                                    <Checkbox
                                                        checked={field.value.indexOf(rol.rolID) > -1}
                                                        size="small"
                                                    />
                                                    <ListItemText
                                                        primary={rol.nombre}
                                                        sx={{ ml: 1 }}
                                                    />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.rolesIDs && (
                                            <FormHelperText>{errors.rolesIDs.message}</FormHelperText>
                                        )}
                                        {!errors.rolesIDs && (
                                            <FormHelperText sx={{ color: 'text.secondary' }}>
                                                Seleccione uno o más roles para el usuario
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        {/* Contraseña */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    required: 'Contraseña es requerida',
                                    minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                        message: 'Debe contener mayúscula, minúscula y número'
                                    }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        type="password"
                                        label="Contraseña *"
                                        error={!!errors.password}
                                        helperText={errors.password?.message || 'Mín. 8 caracteres, mayúscula, minúscula y número'}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            // Revalidar confirmPassword cuando cambie password
                                            if (watchPassword) {
                                                trigger('confirmPassword');
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Confirmar Contraseña */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                rules={{
                                    required: 'Confirmación de contraseña es requerida',
                                    validate: (value) =>
                                        value === watchPassword || 'Las contraseñas no coinciden'
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        type="password"
                                        label="Confirmar Contraseña *"
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Es Líder */}
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Controller
                                    name="esLider"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={value}
                                                    onChange={onChange}
                                                    color="primary"
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        ¿Es líder de equipo?
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Los líderes tienen permisos adicionales de gestión
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    )}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    {generalError && (
                        <Alert severity="error" sx={{ mt: 4, mb: 2 }}>
                            {generalError}
                        </Alert>
                    )}
                </DialogContent>

                <Divider sx={{ mt: 2 }} />

                <DialogActions sx={{ px: 4, py: 3, justifyContent: 'space-between', bgcolor: 'grey.50' }}>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        size="large"
                        color="inherit"
                        disabled={loading}
                        sx={{
                            minWidth: 120,
                            py: 1.5,
                            borderWidth: 2,
                            '&:hover': {
                                borderWidth: 2
                            }
                        }}
                    >
                        Cancelar
                    </Button>

                    <Button
                        onClick={handleSubmit(onSubmit)}
                        variant="contained"
                        size="large"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        disabled={loading || !isValid}
                        color="primary"
                        sx={{
                            minWidth: 160,
                            py: 1.5,
                            fontWeight: 'bold',
                            boxShadow: 2
                        }}
                    >
                        {loading ? 'Guardando...' : 'Registrar Usuario'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar de éxito */}
            <Snackbar
                open={showSuccess}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity="success"
                    sx={{
                        width: '100%',
                        fontSize: '1rem',
                        fontWeight: 'medium',
                        boxShadow: 3
                    }}
                    variant="filled"
                >
                    🎉 Usuario creado exitosamente
                </Alert>
            </Snackbar>
        </>
    );
};