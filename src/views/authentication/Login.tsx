import React, { useState } from 'react';
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
  Divider,
  Link,
  useTheme,
  alpha,
  Grid,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  useMediaQuery,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Business,
  TrendingUp,
  Inventory,
  Assessment,
  Security,
  Speed,
  Verified,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginComponent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (field: keyof LoginFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'rememberMe' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('Por favor, complete todos los campos requeridos');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, ingrese un email válido');
      return false;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Demo credentials check
      if (formData.email === 'demo@cds.com' && formData.password === 'demo123') {
        // Here you would typically:
        // 1. Store JWT token in localStorage/cookies
        // 2. Update global auth state
        // 3. Redirect to dashboard
        console.log('Login successful!', formData);
        alert('¡Login exitoso! Redirigiendo al dashboard...');
      } else if (formData.email === 'admin@cds.com' && formData.password === 'admin123') {
        console.log('Admin login successful!');
        alert('¡Admin login exitoso!');
      } else {
        setError('Credenciales incorrectas. Intente con demo@cds.com / demo123 o admin@cds.com / admin123');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const features = [
    {
      icon: <Business sx={{ fontSize: 48, color: '#5D87FF' }} />,
      title: 'Gestión Empresarial',
      desc: 'Control completo de clientes, pedidos y compras en tiempo real'
    },
    {
      icon: <Inventory sx={{ fontSize: 48, color: '#49BEFF' }} />,
      title: 'Control de Inventario',
      desc: 'Seguimiento automático de productos, stock y ubicaciones de almacén'
    },
    {
      icon: <Assessment sx={{ fontSize: 48, color: '#13DEB9' }} />,
      title: 'Análisis Avanzado',
      desc: 'Reportes inteligentes y dashboards interactivos para decisiones estratégicas'
    }
  ];

  const trustBadges = [
    { icon: <Security fontSize="small" />, text: 'SSL Seguro' },
    { icon: <Speed fontSize="small" />, text: '99.9% Uptime' },
    { icon: <Verified fontSize="small" />, text: 'ISO 27001' }
  ];
  const navigate = useNavigate();
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
          background: `radial-gradient(circle, ${alpha('#5D87FF', 0.1)} 0%, transparent 70%)`,
          animation: 'float 20s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '33%': { transform: 'translate(30px, -30px) rotate(120deg)' },
          '66%': { transform: 'translate(-20px, 20px) rotate(240deg)' }
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

            {/* Left Side - Branding & Features */}
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
                      CORSUSA
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: 400,
                        mt: 0.5
                      }}
                    >
                      Sistema Integral de Gestión
                    </Typography>
                  </Box>
                </Box>

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
                  Transforme su cadena de suministro con tecnología de vanguardia.
                  Gestione pedidos, inventario, clientes y proyectos desde una sola plataforma.
                </Typography>

                {/* Features Cards - Hidden on mobile */}
                {!isMobile && (
                  <Grid container spacing={3}>
                    {features.map((feature, index) => (
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
                              transform: 'translateY(-4px)',
                              boxShadow: `0 12px 40px ${alpha('#5D87FF', 0.15)}`,
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

            {/* Right Side - Login Form */}
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
                  {/* Form Header */}
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: theme.palette.text.primary,
                        fontSize: { xs: '1.5rem', md: '2rem' }
                      }}
                    >
                      Bienvenido de vuelta
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Ingrese sus credenciales para continuar
                    </Typography>
                  </Box>

                  {/* Error Alert */}
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

                  {/* Login Form */}
                  <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                      fullWidth
                      label="Correo Electrónico"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      sx={{ mb: 3 }}
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
                      error={!!error && !formData.email}
                    />

                    <TextField
                      fullWidth
                      label="Contraseña"
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
                              onClick={togglePasswordVisibility}
                              edge="end"
                              disabled={isLoading}
                              aria-label="toggle password visibility"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      placeholder="Ingrese su contraseña"
                      disabled={isLoading}
                      autoComplete="current-password"
                      error={!!error && !formData.password}
                    />

                    {/* Remember Me & Forgot Password */}
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3,
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 2, sm: 0 }
                    }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.rememberMe}
                            onChange={handleInputChange('rememberMe')}
                            disabled={isLoading}
                            size="small"
                          />
                        }
                        label={
                          <Typography variant="body2" color="text.secondary">
                            Recordar sesión
                          </Typography>
                        }
                      />
                      <Link
                        href="#"
                        variant="body2"
                        sx={{
                          color: '#5D87FF',
                          textDecoration: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            textDecoration: 'underline',
                            color: '#4570EA'
                          }
                        }}
                        onClick={() => navigate('/auth/reset-password')}
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </Box>

                    {/* Demo Credentials */}
                    <Box sx={{
                      mb: 3,
                      p: 2,
                      bgcolor: alpha('#5D87FF', 0.05),
                      borderRadius: 2,
                      border: `1px solid ${alpha('#5D87FF', 0.2)}`
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#5D87FF', display: 'block', mb: 0.5 }}>
                        📝 Credenciales de Prueba:
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        <strong>Usuario:</strong> demo@cds.com | <strong>Admin:</strong> admin@cds.com
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Contraseña:</strong> demo123 | admin123
                      </Typography>
                    </Box>
                    <Button
                      type="submit"
                      onClick={() => navigate('/')}
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
                        '&:active': {
                          transform: 'translateY(0px)',
                        },
                        '&:disabled': {
                          background: alpha(theme.palette.action.disabledBackground, 0.3),
                          color: theme.palette.action.disabled,
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                          Iniciando sesión...
                        </Box>
                      ) : (
                        'Iniciar Sesión'
                      )}
                    </Button>

                    <Divider sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        ¿Nuevo en CDS?
                      </Typography>
                    </Divider>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      sx={{
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: 'none',
                        borderColor: '#5D87FF',
                        color: '#5D87FF',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: alpha('#5D87FF', 0.04),
                          borderColor: '#4570EA',
                          color: '#4570EA',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease'
                      }}
                      disabled={isLoading}
                    >
                      🎯 Solicitar Demo Gratuito
                    </Button>
                  </Box>
                </Paper>
              </Box>

              {/* Trust Badges */}
              <Box sx={{ textAlign: 'center', mt: 4, px: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Plataforma segura y confiable
                </Typography>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 3,
                  flexWrap: 'wrap'
                }}>
                  {trustBadges.map((badge, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: alpha(theme.palette.text.secondary, 0.8),
                      }}
                    >
                      {badge.icon}
                      <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                        {badge.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginComponent;