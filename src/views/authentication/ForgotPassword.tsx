import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Container,
    InputAdornment,
    Alert,
    CircularProgress,
    Link,
    useTheme,
    alpha,
    Grid,
    Card,
    CardContent,
    Stepper,
    Step,
    StepLabel,
    useMediaQuery,
    IconButton,
} from '@mui/material';
import {
    Email,
    ArrowBack,
    TrendingUp,
    CheckCircle,
    Send,
    Security,
    Timer,
    Support,
    Refresh,
} from '@mui/icons-material';

type RecoveryStep = 'email' | 'sent' | 'success';

interface ForgotPasswordFormData {
    email: string;
}

const ForgotPasswordComponent: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [currentStep, setCurrentStep] = useState<RecoveryStep>('email');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [formData, setFormData] = useState<ForgotPasswordFormData>({
        email: ''
    });
    const [countdown, setCountdown] = useState(0);

    const handleInputChange = (field: keyof ForgotPasswordFormData) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        if (error) setError('');
    };

    const validateEmail = (): boolean => {
        if (!formData.email) {
            setError('Por favor, ingrese su correo electrónico');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Por favor, ingrese un email válido');
            return false;
        }

        return true;
    };

    const startCountdown = () => {
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateEmail()) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulate success - in real app, this would be an API call
            console.log('Password recovery email sent to:', formData.email);
            setCurrentStep('sent');
            startCountdown();

        } catch (err) {
            setError('Error al enviar el correo. Por favor, intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendEmail = async () => {
        if (countdown > 0) return;

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Resend email to:', formData.email);
            startCountdown();
        } catch (err) {
            setError('Error al reenviar el correo');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        // In real app, this would use React Router navigation
        console.log('Navigate back to login');
        window.history.back(); // Simple back navigation for demo
    };

    const steps = [
        { label: 'Ingreso de Email', icon: <Email /> },
        { label: 'Correo Enviado', icon: <Send /> },
        { label: 'Contraseña Restablecida', icon: <CheckCircle /> }
    ];

    const getStepIndex = (): number => {
        switch (currentStep) {
            case 'email': return 0;
            case 'sent': return 1;
            case 'success': return 2;
            default: return 0;
        }
    };

    const securityFeatures = [
        {
            icon: <Security sx={{ fontSize: 40, color: '#5D87FF' }} />,
            title: 'Seguridad Avanzada',
            desc: 'Encriptación de extremo a extremo para proteger tu información'
        },
        {
            icon: <Timer sx={{ fontSize: 40, color: '#49BEFF' }} />,
            title: 'Enlaces Temporales',
            desc: 'Los enlaces de recuperación expiran automáticamente por seguridad'
        },
        {
            icon: <Support sx={{ fontSize: 40, color: '#13DEB9' }} />,
            title: 'Soporte 24/7',
            desc: 'Nuestro equipo está disponible para ayudarte en todo momento'
        }
    ];

    const renderEmailStep = () => (
        <Box>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `linear-gradient(45deg, ${alpha('#5D87FF', 0.1)}, ${alpha('#49BEFF', 0.1)})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        border: `2px solid ${alpha('#5D87FF', 0.2)}`
                    }}
                >
                    <Email sx={{ fontSize: 40, color: '#5D87FF' }} />
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
                    Recuperar Contraseña
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                    Ingrese su correo electrónico y le enviaremos las instrucciones para restablecer su contraseña
                </Typography>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                            fontSize: '1.2rem'
                        }
                    }}
                    onClose={() => setError('')}
                >
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    fullWidth
                    label="Correo Electrónico"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    sx={{ mb: 4 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email color="action" />
                            </InputAdornment>
                        ),
                    }}
                    variant="outlined"
                    placeholder="ejemplo@empresa.com"
                    disabled={isLoading}
                    autoComplete="email"
                    autoFocus
                    error={!!error && !formData.email}
                    helperText="Ingrese el email asociado a su cuenta CDS"
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                        mb: 3,
                        py: 1.8,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #5D87FF, #4570EA)',
                        boxShadow: '0 8px 25px rgba(93, 135, 255, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #4570EA, #5D87FF)',
                            boxShadow: '0 12px 35px rgba(93, 135, 255, 0.4)',
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
                            Enviando correo...
                        </Box>
                    ) : (
                        <>
                            <Send sx={{ mr: 1 }} />
                            Enviar Instrucciones
                        </>
                    )}
                </Button>
            </Box>
        </Box>
    );

    const renderSentStep = () => (
        <Box sx={{ textAlign: 'center' }}>
            <Box
                sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: `linear-gradient(45deg, ${alpha('#13DEB9', 0.1)}, ${alpha('#49BEFF', 0.1)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    border: `2px solid ${alpha('#13DEB9', 0.3)}`
                }}
            >
                <CheckCircle sx={{ fontSize: 50, color: '#13DEB9' }} />
            </Box>

            <Typography
                variant="h4"
                sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: theme.palette.text.primary,
                    fontSize: { xs: '1.5rem', md: '2rem' }
                }}
            >
                ¡Correo Enviado!
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                Hemos enviado las instrucciones de recuperación a:
            </Typography>

            <Typography
                variant="h6"
                sx={{
                    fontWeight: 600,
                    color: '#5D87FF',
                    mb: 4,
                    p: 2,
                    bgcolor: alpha('#5D87FF', 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha('#5D87FF', 0.2)}`
                }}
            >
                {formData.email}
            </Typography>

            <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>¿No recibió el correo?</strong>
                </Typography>
                <Typography variant="body2" component="ul" sx={{ pl: 2, mb: 0 }}>
                    <li>Verifique su carpeta de spam o correo no deseado</li>
                    <li>Asegúrese de que el email sea correcto</li>
                    <li>El enlace expira en 15 minutos por seguridad</li>
                </Typography>
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                    variant="outlined"
                    onClick={handleResendEmail}
                    disabled={countdown > 0 || isLoading}
                    startIcon={countdown > 0 ? <Timer /> : <Refresh />}
                    sx={{
                        flex: 1,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                    }}
                >
                    {countdown > 0 ? `Reenviar en ${countdown}s` : 'Reenviar Correo'}
                </Button>

                <Button
                    variant="text"
                    onClick={handleBackToLogin}
                    startIcon={<ArrowBack />}
                    sx={{
                        flex: 1,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 500,
                        color: theme.palette.text.secondary,
                    }}
                >
                    Volver al Login
                </Button>
            </Box>
        </Box>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'email':
                return renderEmailStep();
            case 'sent':
                return renderSentStep();
            default:
                return renderEmailStep();
        }
    };

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
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: `radial-gradient(circle, ${alpha('#49BEFF', 0.1)} 0%, transparent 70%)`,
                    animation: 'float 25s ease-in-out infinite',
                },
                '@keyframes float': {
                    '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
                    '33%': { transform: 'translate(-30px, 30px) rotate(-120deg)' },
                    '66%': { transform: 'translate(20px, -20px) rotate(-240deg)' }
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

                        {/* Left Side - Branding & Security Features */}
                        <Grid size={{ xs: 12, lg: 7 }} sx={{ display: { xs: 'block', lg: 'block' } }}>
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
                                    <IconButton
                                        onClick={handleBackToLogin}
                                        sx={{
                                            mr: 2,
                                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                                            '&:hover': { bgcolor: alpha(theme.palette.background.paper, 1) }
                                        }}
                                    >
                                        <ArrowBack />
                                    </IconButton>
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
                                        <TrendingUp sx={{ fontSize: 32, color: 'white' }} />
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
                                            Recuperación Segura de Contraseña
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Progress Stepper - Only on Desktop */}
                                {!isMobile && (
                                    <Box sx={{ mb: 5 }}>
                                        <Stepper
                                            activeStep={getStepIndex()}
                                            sx={{
                                                '& .MuiStepLabel-label': {
                                                    fontSize: '0.9rem',
                                                    fontWeight: 500
                                                },
                                                '& .MuiStepIcon-root': {
                                                    fontSize: '1.5rem'
                                                }
                                            }}
                                        >
                                            {steps.map((step, index) => (
                                                <Step key={step.label}>
                                                    <StepLabel>{step.label}</StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </Box>
                                )}

                                {/* Main Description */}
                                <Typography
                                    variant="h5"
                                    sx={{
                                        mb: 5,
                                        color: theme.palette.text.primary,
                                        fontWeight: 300,
                                        lineHeight: 1.4,
                                        maxWidth: 600,
                                        fontSize: { xs: '1.1rem', md: '1.3rem' }
                                    }}
                                >
                                    Su seguridad es nuestra prioridad. Utilizamos los más altos estándares de seguridad para proteger su cuenta y datos empresariales.
                                </Typography>

                                {/* Security Features - Hidden on mobile */}
                                {!isMobile && (
                                    <Grid container spacing={3}>
                                        {securityFeatures.map((feature, index) => (
                                            <Grid size={{ xs: 12 }} key={index}>
                                                <Card
                                                    elevation={0}
                                                    sx={{
                                                        background: alpha(theme.palette.background.paper, 0.7),
                                                        backdropFilter: 'blur(10px)',
                                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                        borderRadius: 3,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: `0 8px 30px ${alpha('#5D87FF', 0.15)}`,
                                                        }
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 3 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box sx={{ mr: 3, flexShrink: 0 }}>
                                                                {feature.icon}
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                                    {feature.title}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                                                                    {feature.desc}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Box>
                        </Grid>

                        {/* Right Side - Recovery Form */}
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
                                            background: 'linear-gradient(90deg, #5D87FF, #49BEFF)'
                                        }
                                    }}
                                >
                                    {renderCurrentStep()}

                                    {/* Back to Login - Always visible at bottom */}
                                    {currentStep === 'email' && (
                                        <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                ¿Recordaste tu contraseña?
                                            </Typography>
                                            <Link
                                                href="#"
                                                onClick={handleBackToLogin}
                                                sx={{
                                                    color: '#5D87FF',
                                                    textDecoration: 'none',
                                                    fontWeight: 500,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    '&:hover': {
                                                        textDecoration: 'underline',
                                                        color: '#4570EA'
                                                    }
                                                }}
                                            >
                                                <ArrowBack fontSize="small" />
                                                Volver al Login
                                            </Link>
                                        </Box>
                                    )}
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default ForgotPasswordComponent;