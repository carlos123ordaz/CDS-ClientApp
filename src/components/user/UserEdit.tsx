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
    ListItemText,
    Badge,
    Paper
} from '@mui/material';
import {
    Close as CloseIcon,
    Save as SaveIcon,
    Edit as EditIcon,
    SupervisorAccount as LeaderIcon,
    Refresh as ResetIcon
} from '@mui/icons-material';

// Interfaces basadas en la estructura de la BD Usuario
interface Usuario {
    usuarioID: number;
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
    // Datos adicionales
    areaNombre?: string;
    roles?: string[];
    rolesIDs?: number[];
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
    areaID: number;
    esLider: boolean;
    estado: boolean;
    rolesIDs: number[];
    // No incluimos password en edición por seguridad
}

interface UserEditProps {
    openModal: boolean;
    handleCloseModal: () => void;
    user: Usuario | null;
    onUserUpdated?: (user: Usuario) => void;
}

export const UserEdit: React.FC<UserEditProps> = ({
    openModal,
    handleCloseModal,
    user,
    onUserUpdated
}) => {
    const [loading, setLoading] = useState(false);
    const [areas, setAreas] = useState<Area[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [generalError, setGeneralError] = useState<string>('');

    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        reset,
    } = useForm<UserFormData>({
        mode: 'onChange'
    });

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
    useEffect(() => {
        if (openModal && user) {
            // Simular mapeo de roles nombres a IDs
            const rolesIDs = user.roles?.map(rolNombre => {
                const rol = roles.find(r => r.nombre === rolNombre);
                return rol?.rolID || 0;
            }).filter(id => id > 0) || [];

            reset({
                tipoDoc: user.tipoDoc || '',
                numDoc: user.numDoc || '',
                nombre: user.nombre || '',
                apellido: user.apellido || '',
                correo: user.correo || '',
                areaID: user.areaID || 0,
                esLider: user.esLider || false,
                estado: user.estado !== undefined ? user.estado : true,
                rolesIDs: rolesIDs
            });
            setGeneralError('');
        }
    }, [openModal, user, reset, roles]);

    // Enviar formulario
    const onSubmit = async (data: UserFormData) => {
        if (!user) return;

        try {
            setLoading(true);
            setGeneralError('');

            const updatedUser: Usuario = {
                ...user, // Mantener los datos originales
                tipoDoc: data.tipoDoc,
                numDoc: data.numDoc,
                nombre: data.nombre,
                apellido: data.apellido,
                correo: data.correo,
                areaID: data.areaID,
                esLider: data.esLider,
                estado: data.estado,
                fechaModific: new Date(),
                // Actualizar datos derivados
                areaNombre: areas.find(a => a.areaID === data.areaID)?.nombre,
                rolesIDs: data.rolesIDs,
                roles: data.rolesIDs.map(rolID =>
                    roles.find(r => r.rolID === rolID)?.nombre || ''
                ).filter(nombre => nombre !== '')
            };

            console.log('Actualizando usuario:', updatedUser);
            console.log('Cambios realizados:', { data, original: user });

            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simular posible error (10% de probabilidad)
            if (Math.random() < 0.1) {
                throw new Error('Error de servidor: No se pudo actualizar el usuario');
            }

            setShowSuccess(true);
            onUserUpdated?.(updatedUser);

            // Cerrar modal después de mostrar éxito
            setTimeout(() => {
                handleClose();
                setShowSuccess(false);
            }, 1500);

        } catch (err: any) {
            setGeneralError(err.message || 'Error al actualizar el usuario. Intente nuevamente.');
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

    // Resetear formulario a los valores originales
    const handleReset = () => {
        if (user) {
            const rolesIDs = user.roles?.map(rolNombre => {
                const rol = roles.find(r => r.nombre === rolNombre);
                return rol?.rolID || 0;
            }).filter(id => id > 0) || [];

            reset({
                tipoDoc: user.tipoDoc || '',
                numDoc: user.numDoc || '',
                nombre: user.nombre || '',
                apellido: user.apellido || '',
                correo: user.correo || '',
                areaID: user.areaID || 0,
                esLider: user.esLider || false,
                estado: user.estado !== undefined ? user.estado : true,
                rolesIDs: rolesIDs
            });
        }
    };

    const tiposDocumento = [
        { value: 'DNI', label: 'DNI' },
        { value: 'CE', label: 'Carné de Extranjería' },
        { value: 'PASSPORT', label: 'Pasaporte' },
        { value: 'RUC', label: 'RUC' }
    ];

    if (!user) {
        return null;
    }

    const userInitials = `${user.nombre?.charAt(0) || ''}${user.apellido?.charAt(0) || ''}`;

    return (
        <>
            <Dialog
                open={openModal}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', p: 0 }}>
                    <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    user.esLider ? (
                                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'warning.main' }}>
                                            <LeaderIcon sx={{ fontSize: 14 }} />
                                        </Avatar>
                                    ) : null
                                }
                            >
                                <Avatar
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        fontSize: '1.25rem',
                                        fontWeight: 'bold',
                                        border: '3px solid rgba(255,255,255,0.3)'
                                    }}
                                >
                                    {userInitials}
                                </Avatar>
                            </Badge>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                    Editar Usuario
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {user.nombre} {user.apellido} • ID: {user.usuarioID}
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

                    {/* Información de cambios */}
                    {isDirty && (
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Has realizado cambios en el formulario. Recuerda guardar para aplicar los cambios.
                        </Alert>
                    )}

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
                        <Grid size={{ xs: 12 }}>
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

                        {/* Configuraciones */}
                        <Grid size={{ xs: 12 }}>
                            <Paper sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    Configuraciones
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
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
                                                                Los líderes tienen permisos adicionales
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="estado"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={value}
                                                            onChange={onChange}
                                                            color="success"
                                                        />
                                                    }
                                                    label={
                                                        <Box>
                                                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                                Usuario activo
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Define si el usuario puede acceder al sistema
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
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
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            color="inherit"
                            size="large"
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

                        {isDirty && (
                            <Button
                                onClick={handleReset}
                                variant="outlined"
                                color="warning"
                                size="large"
                                startIcon={<ResetIcon />}
                                disabled={loading}
                                sx={{
                                    minWidth: 140,
                                    py: 1.5
                                }}
                            >
                                Resetear
                            </Button>
                        )}
                    </Box>

                    <Button
                        onClick={handleSubmit(onSubmit)}
                        variant="contained"
                        size="large"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        disabled={loading || !isValid || !isDirty}
                        color="primary"
                        sx={{
                            minWidth: 160,
                            py: 1.5,
                            fontWeight: 'bold',
                            boxShadow: 2
                        }}
                    >
                        {loading ? 'Actualizando...' : 'Guardar Cambios'}
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
                    🎉 Usuario actualizado exitosamente
                </Alert>
            </Snackbar>
        </>
    );
};