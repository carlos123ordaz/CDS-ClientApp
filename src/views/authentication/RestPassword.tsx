import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Container,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
    useTheme,
    alpha,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Chip,
    useMediaQuery,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Lock,
    TrendingUp,
    CheckCircle,
    Security,
    VpnKey,
    Timer,
    Check,
    Close,
    ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';

interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
    requirements: {
        length: boolean;
        lowercase: boolean;
        uppercase: boolean;
        number: boolean;
        special: boolean;
    };
}

const ResetPasswordComponent: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState<boolean | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds

    const [formData, setFormData] = useState<ResetPasswordFormData>({
        password: '',
        confirmPassword: ''
    });

    // Simulate token validation on component mount
    useEffect(() => {
        const validateToken = async () => {
            // Get token from URL params
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            console.log('token: ', token)
            if (!token) {
                setTokenValid(true);
                return;
            }

            try {
                // Simulate API call to validate token
                await new Promise(resolve => setTimeout(resolve, 1000));
                // For demo, assume token is valid
                setTokenValid(true);
            } catch (err) {
                setTokenValid(false);
            }
        };

        validateToken();
    }, []);

    // Countdown timer for token expiration
    useEffect(() => {
        if (tokenValid && timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [tokenValid, timeRemaining]);

    const calculatePasswordStrength = (password: string): PasswordStrength => {
        const requirements = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };

        const score = Object.values(requirements).filter(Boolean).length;

        let label = '';
        let color = '';

        if (score === 0) {
            label = 'Sin contraseña';
            color = '#f44336';
        } else if (score <= 2) {
            label = 'Muy débil';
            color = '#f44336';
        } else if (score === 3) {
            label = 'Débil';
            color = '#ff9800';
        } else if (score === 4) {
            label = 'Buena';
            color = '#2196f3';
        } else {
            label = 'Muy segura';
            color = '#4caf50';
        }

        return { score, label, color, requirements };
    };

    const passwordStrength = calculatePasswordStrength(formData.password);

    const handleInputChange = (field: keyof ResetPasswordFormData) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        if (error) setError('');
    };

    const validateForm = (): boolean => {
        if (!formData.password) {
            setError('Por favor, ingrese su nueva contraseña');
            return false;
        }

        if (passwordStrength.score < 3) {
            setError('La contraseña debe ser más segura. Complete al menos 3 de los requisitos.');
            return false;
        }

        if (!formData.confirmPassword) {
            setError('Por favor, confirme su nueva contraseña');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return false;
        }

        return true;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Password reset successful');
            setSuccess(true);
        } catch (err) {
            setError('Error al restablecer la contraseña. Por favor, intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    const navigate = useNavigate();
    const handleBackToLogin = () => {
        navigate('/auth/login')
    };

    if (tokenValid === null) {
        // Loading token validation
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha('#5D87FF', 0.08)} 0%, ${alpha('#49BEFF', 0.08)} 100%)`
            }}>
                <Paper elevation={8} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        Validando enlace de recuperación...
                    </Typography>
                </Paper>
            </Box>
        );
    }

    if (!tokenValid) {
        // Invalid or expired token
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha('#5D87FF', 0.08)} 0%, ${alpha('#49BEFF', 0.08)} 100%)`
            }}>
                <Container maxWidth="sm">
                    <Paper elevation={8} sx={{ p: 5, borderRadius: 3, textAlign: 'center' }}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: alpha('#f44336', 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3,
                            }}
                        >
                            <Close sx={{ fontSize: 40, color: '#f44336' }} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: '#f44336' }}>
                            Enlace Inválido
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            El enlace de recuperación ha expirado o no es válido.
                            Por favor, solicite un nuevo enlace de recuperación.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handleBackToLogin}
                            sx={{
                                background: 'linear-gradient(45deg, #5D87FF, #4570EA)',
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                            }}
                        >
                            Volver al Login
                        </Button>
                    </Paper>
                </Container>
            </Box>
        );
    }

    if (success) {
        // Success state
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha('#5D87FF', 0.08)} 0%, ${alpha('#49BEFF', 0.08)} 100%)`
            }}>
                <Container maxWidth="sm">
                    <Paper elevation={8} sx={{ p: 5, borderRadius: 3, textAlign: 'center' }}>
                        <Box
                            sx={{
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                background: alpha('#4caf50', 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3,
                            }}
                        >
                            <CheckCircle sx={{ fontSize: 50, color: '#4caf50' }} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: '#4caf50' }}>
                            ¡Contraseña Restablecida!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            Su contraseña ha sido actualizada exitosamente.
                            Ya puede iniciar sesión con su nueva contraseña.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handleBackToLogin}
                            sx={{
                                background: 'linear-gradient(45deg, #5D87FF, #4570EA)',
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                            }}
                        >
                            Ir al Login
                        </Button>
                    </Paper>
                </Container>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${alpha('#5D87FF', 0.08)} 0%, ${alpha('#49BEFF', 0.08)} 100%)`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200%',
                    height: '200%',
                    background: `radial-gradient(circle, ${alpha('#4caf50', 0.1)} 0%, transparent 70%)`,
                    animation: 'float 30s ease-in-out infinite',
                }
            }}
        >
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    py: { xs: 2, md: 4 }
                }}>
                    <Grid container spacing={4} alignItems="center">

                        {/* Left Side - Security Info */}
                        <Grid size={{ xs: 12, lg: 7 }}>
                            <Box sx={{
                                textAlign: { xs: 'center', lg: 'left' },
                                mb: { xs: 4, lg: 0 },
                                px: { xs: 2, lg: 4 }
                            }}>
                                {/* Logo & Brand */}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: { xs: 'center', lg: 'flex-start' },
                                    mb: 4
                                }}>
                                    <Box
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 3,
                                            background: `linear-gradient(45deg, #5D87FF, #49BEFF)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 3,
                                            boxShadow: '0 8px 32px rgba(93, 135, 255, 0.3)'
                                        }}
                                    >
                                        <VpnKey sx={{ fontSize: 32, color: 'white' }} />
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                fontWeight: 700,
                                                background: 'linear-gradient(45deg, #5D87FF, #49BEFF)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                color: 'transparent',
                                                fontSize: { xs: '1.8rem', md: '2.5rem', lg: '3rem' }
                                            }}
                                        >
                                            Corsusa
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                color: theme.palette.text.secondary,
                                                fontWeight: 400,
                                                mt: 0.5
                                            }}
                                        >
                                            Nueva Contraseña Segura
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Time Remaining Alert */}
                                <Alert
                                    severity="warning"
                                    icon={<Timer />}
                                    sx={{ mb: 4, maxWidth: 500 }}
                                >
                                    <Typography variant="body2">
                                        <strong>Este enlace expira en: {formatTime(timeRemaining)}</strong>
                                    </Typography>
                                </Alert>

                                {/* Security Tips */}
                                {!isMobile && (
                                    <Box>
                                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                                            Consejos de Seguridad
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {[
                                                { icon: <Security sx={{ color: '#5D87FF' }} />, text: 'Use una contraseña única que no haya usado antes' },
                                                { icon: <VpnKey sx={{ color: '#49BEFF' }} />, text: 'Combine letras mayúsculas, minúsculas, números y símbolos' },
                                                { icon: <Lock sx={{ color: '#13DEB9' }} />, text: 'Mantenga su contraseña privada y segura' }
                                            ].map((tip, index) => (
                                                <Grid size={{ xs: 12 }} key={index}>
                                                    <Card
                                                        elevation={0}
                                                        sx={{
                                                            background: alpha(theme.palette.background.paper, 0.7),
                                                            backdropFilter: 'blur(10px)',
                                                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                            borderRadius: 2,
                                                            p: 2
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box sx={{ mr: 2 }}>
                                                                {tip.icon}
                                                            </Box>
                                                            <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                                                                {tip.text}
                                                            </Typography>
                                                        </Box>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        {/* Right Side - Reset Form */}
                        <Grid size={{ xs: 12, lg: 5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', px: { xs: 2, lg: 0 } }}>
                                <Paper
                                    elevation={24}
                                    sx={{
                                        p: { xs: 3, md: 5 },
                                        borderRadius: 4,
                                        background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 1)})`,
                                        backdropFilter: 'blur(20px)',
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        position: 'relative',
                                        width: '100%',
                                        maxWidth: 480,
                                        boxShadow: '0 20px 60px rgba(93, 135, 255, 0.15)',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 4,
                                            borderRadius: '16px 16px 0 0',
                                            background: 'linear-gradient(90deg, #4caf50, #2196f3)'
                                        }
                                    }}
                                >
                                    {/* Form Header */}
                                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                background: alpha('#4caf50', 0.1),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 3,
                                                border: `2px solid ${alpha('#4caf50', 0.2)}`
                                            }}
                                        >
                                            <VpnKey sx={{ fontSize: 40, color: '#4caf50' }} />
                                        </Box>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 1,
                                                color: theme.palette.text.primary,
                                                fontSize: { xs: '1.5rem', md: '2rem' }
                                            }}
                                        >
                                            Nueva Contraseña
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Cree una contraseña segura para su cuenta
                                        </Typography>
                                    </Box>

                                    {/* Error Alert */}
                                    {error && (
                                        <Alert
                                            severity="error"
                                            sx={{ mb: 3, borderRadius: 2 }}
                                            onClose={() => setError('')}
                                        >
                                            {error}
                                        </Alert>
                                    )}

                                    {/* Reset Form */}
                                    <Box component="form" onSubmit={handleSubmit} noValidate>
                                        <TextField
                                            fullWidth
                                            label="Nueva Contraseña"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleInputChange('password')}
                                            sx={{ mb: 2 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock color="action" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            disabled={isLoading}
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            variant="outlined"
                                            disabled={isLoading}
                                            autoComplete="new-password"
                                        />

                                        {/* Password Strength Indicator */}
                                        {formData.password && (
                                            <Box sx={{ mb: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="body2" sx={{ mr: 1 }}>
                                                        Seguridad:
                                                    </Typography>
                                                    <Chip
                                                        label={passwordStrength.label}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: alpha(passwordStrength.color, 0.1),
                                                            color: passwordStrength.color,
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem'
                                                        }}
                                                    />
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(passwordStrength.score / 5) * 100}
                                                    sx={{
                                                        height: 6,
                                                        borderRadius: 3,
                                                        mb: 2,
                                                        backgroundColor: alpha(passwordStrength.color, 0.1),
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: passwordStrength.color,
                                                            borderRadius: 3
                                                        }
                                                    }}
                                                />
                                                <Grid container spacing={1}>
                                                    {Object.entries(passwordStrength.requirements).map(([key, met]) => {
                                                        const labels: { [key: string]: string } = {
                                                            length: '8+ caracteres',
                                                            lowercase: 'Minúscula (a-z)',
                                                            uppercase: 'Mayúscula (A-Z)',
                                                            number: 'Número (0-9)',
                                                            special: 'Símbolo (!@#$...)'
                                                        };
                                                        return (
                                                            <Grid size={{ xs: 12, sm: 6 }} key={key}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    {met ? (
                                                                        <Check sx={{ fontSize: 16, color: '#4caf50', mr: 0.5 }} />
                                                                    ) : (
                                                                        <Close sx={{ fontSize: 16, color: '#f44336', mr: 0.5 }} />
                                                                    )}
                                                                    <Typography
                                                                        variant="caption"
                                                                        sx={{
                                                                            color: met ? '#4caf50' : theme.palette.text.secondary,
                                                                            fontSize: '0.7rem'
                                                                        }}
                                                                    >
                                                                        {labels[key]}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                        );
                                                    })}
                                                </Grid>
                                            </Box>
                                        )}

                                        <TextField
                                            fullWidth
                                            label="Confirmar Nueva Contraseña"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange('confirmPassword')}
                                            sx={{ mb: 4 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock color="action" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            edge="end"
                                                            disabled={isLoading}
                                                        >
                                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            variant="outlined"
                                            disabled={isLoading}
                                            autoComplete="new-password"
                                            // error={formData.confirmPassword && formData.password !== formData.confirmPassword}
                                            helperText={
                                                formData.confirmPassword && formData.password !== formData.confirmPassword
                                                    ? 'Las contraseñas no coinciden'
                                                    : ''
                                            }
                                        />

                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            disabled={isLoading || passwordStrength.score < 3}
                                            sx={{
                                                mb: 3,
                                                py: 1.8,
                                                borderRadius: 3,
                                                textTransform: 'none',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                background: 'linear-gradient(45deg, #4caf50, #2196f3)',
                                                boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #45a049, #1976d2)',
                                                    boxShadow: '0 12px 35px rgba(76, 175, 80, 0.4)',
                                                    transform: 'translateY(-2px)',
                                                },
                                                '&:disabled': {
                                                    background: alpha(theme.palette.action.disabledBackground, 0.3),
                                                },
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {isLoading ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                                                    Restableciendo...
                                                </Box>
                                            ) : (
                                                <>
                                                    <CheckCircle sx={{ mr: 1 }} />
                                                    Restablecer Contraseña
                                                </>
                                            )}
                                        </Button>

                                        {/* Back to Login */}
                                        <Box sx={{ textAlign: 'center', pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                                            <Button
                                                variant="text"
                                                onClick={handleBackToLogin}
                                                startIcon={<ArrowBack />}
                                                sx={{
                                                    color: theme.palette.text.secondary,
                                                    textTransform: 'none',
                                                    '&:hover': { color: '#5D87FF' }
                                                }}
                                            >
                                                Volver al Login
                                            </Button>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default ResetPasswordComponent;