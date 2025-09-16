import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Toolbar,
  Stack,
  Card,
  CardContent,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Inventory as InventoryIcon,
  NavigateNext as NavigateNextIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  RefreshOutlined as RefreshIcon,
  Language as LanguageIcon,
  QrCode as QrCodeIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

// Interfaz para los datos del producto
interface Product {
  id: string;
  codERP: string;
  marca: string;
  codComercial: string;
  descripcion: string;
  unidadMedida: string;
  clase: string;
  subClase: string;
  subSubClase: string;
  modeloTraduccion?: string;
  descripcionTraduccion?: string;
  materialTraduccion?: string;
  usoTraduccion?: string;
  bbssSunat: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'DESCONTINUADO' | 'EN_DESARROLLO';
  precio?: number;
  stock?: number;
  stockMinimo?: number;
  fechaCreacion?: Date;
  ultimaVenta?: Date;
}

// Interfaz para el formulario de búsqueda
interface SearchForm {
  searchTerm: string;
  marca: string;
  clase: string;
  estado: string;
  unidadMedida: string;
}

// Interfaz para el formulario de producto
interface ProductForm {
  codERP: string;
  marca: string;
  codComercial: string;
  descripcion: string;
  unidadMedida: string;
  clase: string;
  subClase: string;
  subSubClase: string;
  modeloTraduccion: string;
  descripcionTraduccion: string;
  materialTraduccion: string;
  usoTraduccion: string;
  bbssSunat: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'DESCONTINUADO' | 'EN_DESARROLLO';
  precio: number;
  stock: number;
  stockMinimo: number;
  incluirTraducciones: boolean;
}

const ListProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, watch, reset } = useForm<SearchForm>({
    defaultValues: {
      searchTerm: '',
      marca: '',
      clase: '',
      estado: '',
      unidadMedida: '',
    }
  });

  const {
    register: registerProduct,
    control: controlProduct,
    handleSubmit: handleSubmitProduct,
    reset: resetProduct,
    watch: watchProduct,
    formState: { errors }
  } = useForm<ProductForm>({
    defaultValues: {
      codERP: '',
      marca: '',
      codComercial: '',
      descripcion: '',
      unidadMedida: 'UND',
      clase: '01-PROD',
      subClase: '',
      subSubClase: '',
      modeloTraduccion: '',
      descripcionTraduccion: '',
      materialTraduccion: '',
      usoTraduccion: '',
      bbssSunat: 'USD',
      estado: 'ACTIVO',
      precio: 0,
      stock: 0,
      stockMinimo: 0,
      incluirTraducciones: false,
    }
  });

  const searchTerm = watch('searchTerm');
  const marcaFilter = watch('marca');
  const claseFilter = watch('clase');
  const estadoFilter = watch('estado');
  const unidadMedidaFilter = watch('unidadMedida');
  const incluirTraducciones = watchProduct('incluirTraducciones');

  // Datos de ejemplo basados en la imagen
  const mockProducts: Product[] = [
    {
      id: '1',
      codERP: 'PQ02028',
      marca: 'Endress+Hauser',
      codComercial: 'HAW5E9-CBXC1-PA',
      descripcion: 'Sensor de presión diferencial para líquidos',
      unidadMedida: 'UND',
      clase: '01-PROD',
      subClase: '1A-INST',
      subSubClase: '1A1-PRES',
      modeloTraduccion: 'Differential Pressure Sensor',
      descripcionTraduccion: 'Differential pressure sensor for liquids',
      materialTraduccion: 'Stainless Steel 316L',
      usoTraduccion: 'Industrial pressure measurement',
      bbssSunat: 'USD',
      estado: 'ACTIVO',
      precio: 1250.00,
      stock: 15,
      stockMinimo: 5,
      fechaCreacion: new Date('2023-01-15'),
      ultimaVenta: new Date('2024-08-20'),
    },
    {
      id: '2',
      codERP: 'PQ03446',
      marca: 'Endress+Hauser',
      codComercial: 'CPF51E-AASLA02',
      descripcion: 'Sensor de pH para aplicaciones químicas',
      unidadMedida: 'UND',
      clase: '01-PROD',
      subClase: '1A-INST',
      subSubClase: '1A2-ANAL',
      modeloTraduccion: 'pH Sensor',
      descripcionTraduccion: 'pH sensor for chemical applications',
      materialTraduccion: 'Glass electrode',
      usoTraduccion: 'Chemical process monitoring',
      bbssSunat: 'USD',
      estado: 'ACTIVO',
      precio: 850.00,
      stock: 8,
      stockMinimo: 3,
      fechaCreacion: new Date('2023-02-10'),
      ultimaVenta: new Date('2024-09-05'),
    },
    {
      id: '3',
      codERP: 'PQ00087',
      marca: 'Endress+Hauser',
      codComercial: 'CYK10-A101',
      descripcion: 'Transmisor de conductividad',
      unidadMedida: 'UND',
      clase: '01-PROD',
      subClase: '1A-INST',
      subSubClase: '1A2-ANAL',
      modeloTraduccion: 'Conductivity Transmitter',
      descripcionTraduccion: 'Conductivity transmitter for water treatment',
      materialTraduccion: 'Plastic housing',
      usoTraduccion: 'Water quality monitoring',
      bbssSunat: 'USD',
      estado: 'DESCONTINUADO',
      precio: 650.00,
      stock: 2,
      stockMinimo: 0,
      fechaCreacion: new Date('2022-05-20'),
      ultimaVenta: new Date('2023-12-15'),
    },
    {
      id: '4',
      codERP: 'PQ00810',
      marca: 'Endress+Hauser',
      codComercial: 'CTA11-A4Z1B2A8',
      descripcion: 'Analizador de temperatura multicanal',
      unidadMedida: 'UND',
      clase: '01-PROD',
      subClase: '1A-INST',
      subSubClase: '1A3-TEMP',
      modeloTraduccion: 'Multi-channel Temperature Analyzer',
      descripcionTraduccion: 'Multi-channel temperature analyzer',
      materialTraduccion: 'Aluminum housing',
      usoTraduccion: 'Process temperature control',
      bbssSunat: 'USD',
      estado: 'ACTIVO',
      precio: 2100.00,
      stock: 5,
      stockMinimo: 2,
      fechaCreacion: new Date('2023-06-12'),
      ultimaVenta: new Date('2024-07-30'),
    },
    {
      id: '5',
      codERP: 'PQ04452',
      marca: 'Endress+Hauser',
      codComercial: 'CPT20-EN2D1',
      descripcion: 'Transmisor de presión absoluta',
      unidadMedida: 'UND',
      clase: '01-PROD',
      subClase: '1A-INST',
      subSubClase: '1A1-PRES',
      modeloTraduccion: 'Absolute Pressure Transmitter',
      descripcionTraduccion: 'Absolute pressure transmitter',
      materialTraduccion: 'Stainless Steel',
      usoTraduccion: 'Vacuum and pressure measurement',
      bbssSunat: 'USD',
      estado: 'EN_DESARROLLO',
      precio: 1800.00,
      stock: 0,
      stockMinimo: 3,
      fechaCreacion: new Date('2024-01-08'),
      ultimaVenta: undefined,
    },
    {
      id: '6',
      codERP: 'PQ00473',
      marca: 'Endress+Hauser',
      codComercial: 'CPT20-G02D1',
      descripcion: 'Transmisor de presión manométrica',
      unidadMedida: 'UND',
      clase: '01-PROD',
      subClase: '1A-INST',
      subSubClase: '1A1-PRES',
      modeloTraduccion: 'Gauge Pressure Transmitter',
      descripcionTraduccion: 'Gauge pressure transmitter',
      materialTraduccion: 'Stainless Steel 316',
      usoTraduccion: 'Industrial pressure monitoring',
      bbssSunat: 'USD',
      estado: 'ACTIVO',
      precio: 1650.00,
      stock: 12,
      stockMinimo: 4,
      fechaCreacion: new Date('2023-03-25'),
      ultimaVenta: new Date('2024-08-15'),
    },
    {
      id: '7',
      codERP: 'PQ00811',
      marca: 'Endress+Hauser',
      codComercial: '71158246',
      descripcion: 'Cable de extensión para sensores',
      unidadMedida: 'M',
      clase: '02-ACC',
      subClase: '2A-CAB',
      subSubClase: '2A1-EXT',
      modeloTraduccion: 'Extension Cable',
      descripcionTraduccion: 'Extension cable for sensors',
      materialTraduccion: 'PVC insulated copper',
      usoTraduccion: 'Sensor signal transmission',
      bbssSunat: 'USD',
      estado: 'ACTIVO',
      precio: 25.00,
      stock: 150,
      stockMinimo: 50,
      fechaCreacion: new Date('2022-11-10'),
      ultimaVenta: new Date('2024-09-01'),
    },
  ];

  useEffect(() => {
    // Simular carga de datos
    setLoading(true);
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar productos basado en los criterios de búsqueda
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.codERP.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcionTraduccion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (marcaFilter) {
      filtered = filtered.filter(product => product.marca === marcaFilter);
    }

    if (claseFilter) {
      filtered = filtered.filter(product => product.clase === claseFilter);
    }

    if (estadoFilter) {
      filtered = filtered.filter(product => product.estado === estadoFilter);
    }

    if (unidadMedidaFilter) {
      filtered = filtered.filter(product => product.unidadMedida === unidadMedidaFilter);
    }

    setFilteredProducts(filtered);
    setPage(0);
  }, [searchTerm, marcaFilter, claseFilter, estadoFilter, unidadMedidaFilter, products]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddProduct = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetProduct();
  };

  const onSubmitProduct = async (data: ProductForm) => {
    setSubmitting(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newProduct: Product = {
        id: String(Date.now()),
        codERP: data.codERP,
        marca: data.marca,
        codComercial: data.codComercial,
        descripcion: data.descripcion,
        unidadMedida: data.unidadMedida,
        clase: data.clase,
        subClase: data.subClase,
        subSubClase: data.subSubClase,
        modeloTraduccion: data.incluirTraducciones ? data.modeloTraduccion : undefined,
        descripcionTraduccion: data.incluirTraducciones ? data.descripcionTraduccion : undefined,
        materialTraduccion: data.incluirTraducciones ? data.materialTraduccion : undefined,
        usoTraduccion: data.incluirTraducciones ? data.usoTraduccion : undefined,
        bbssSunat: data.bbssSunat,
        estado: data.estado,
        precio: data.precio,
        stock: data.stock,
        stockMinimo: data.stockMinimo,
        fechaCreacion: new Date(),
      };

      setProducts(prev => [newProduct, ...prev]);
      setFilteredProducts(prev => [newProduct, ...prev]);
      handleCloseModal();

      // Mostrar mensaje de éxito (podrías usar un snackbar aquí)
      alert('Producto creado exitosamente');
    } catch (error) {
      alert('Error al crear el producto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = (productId: string) => {
    console.log('Editar producto:', productId);
  };

  const handleViewProduct = (productId: string) => {
    console.log('Ver producto:', productId);
  };

  const handleDeleteProduct = (productId: string) => {
    console.log('Eliminar producto:', productId);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleClearFilters = () => {
    reset();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVO': return 'success';
      case 'INACTIVO': return 'default';
      case 'DESCONTINUADO': return 'error';
      case 'EN_DESARROLLO': return 'info';
      default: return 'default';
    }
  };

  const getStockStatus = (stock: number, stockMinimo: number) => {
    if (stock === 0) return { color: 'error', label: 'Sin Stock' };
    if (stock <= stockMinimo) return { color: 'warning', label: 'Stock Bajo' };
    return { color: 'success', label: 'Stock OK' };
  };

  // Opciones para filtros
  const marcas = Array.from(new Set(products.map(p => p.marca))).map(marca => ({ value: marca, label: marca }));

  const clases = [
    { value: '01-PROD', label: '01-PROD - Productos' },
    { value: '02-ACC', label: '02-ACC - Accesorios' },
    { value: '03-SRV', label: '03-SRV - Servicios' },
    { value: '04-REP', label: '04-REP - Repuestos' },
  ];

  const subClasesMap: Record<string, Array<{ value: string; label: string }>> = {
    '01-PROD': [
      { value: '1A-INST', label: '1A-INST - Instrumentos' },
      { value: '1B-EQUI', label: '1B-EQUI - Equipos' },
      { value: '1C-COMP', label: '1C-COMP - Componentes' },
    ],
    '02-ACC': [
      { value: '2A-CAB', label: '2A-CAB - Cables' },
      { value: '2B-CON', label: '2B-CON - Conectores' },
      { value: '2C-SOP', label: '2C-SOP - Soportes' },
    ],
    '03-SRV': [
      { value: '3A-MAN', label: '3A-MAN - Mantenimiento' },
      { value: '3B-CAL', label: '3B-CAL - Calibración' },
      { value: '3C-INS', label: '3C-INS - Instalación' },
    ],
    '04-REP': [
      { value: '4A-SEN', label: '4A-SEN - Sensores' },
      { value: '4B-ELE', label: '4B-ELE - Electrónicos' },
      { value: '4C-MEC', label: '4C-MEC - Mecánicos' },
    ],
  };

  const subSubClasesMap: Record<string, Array<{ value: string; label: string }>> = {
    '1A-INST': [
      { value: '1A1-PRES', label: '1A1-PRES - Presión' },
      { value: '1A2-ANAL', label: '1A2-ANAL - Analíticos' },
      { value: '1A3-TEMP', label: '1A3-TEMP - Temperatura' },
      { value: '1A4-FLOW', label: '1A4-FLOW - Flujo' },
    ],
    '2A-CAB': [
      { value: '2A1-EXT', label: '2A1-EXT - Extensión' },
      { value: '2A2-POW', label: '2A2-POW - Alimentación' },
      { value: '2A3-SIG', label: '2A3-SIG - Señal' },
    ],
  };

  const estadosProducto = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'INACTIVO', label: 'Inactivo' },
    { value: 'DESCONTINUADO', label: 'Descontinuado' },
    { value: 'EN_DESARROLLO', label: 'En Desarrollo' },
  ];

  const unidadesMedida = [
    { value: 'UND', label: 'Unidad' },
    { value: 'M', label: 'Metro' },
    { value: 'KG', label: 'Kilogramo' },
    { value: 'L', label: 'Litro' },
    { value: 'M2', label: 'Metro cuadrado' },
    { value: 'M3', label: 'Metro cúbico' },
  ];

  const monedas = [
    { value: 'USD', label: 'USD - Dólar' },
    { value: 'PEN', label: 'PEN - Sol' },
    { value: 'EUR', label: 'EUR - Euro' },
  ];

  // Calcular estadísticas
  const productosActivos = filteredProducts.filter(p => p.estado === 'ACTIVO').length;
  const valorInventario = filteredProducts.reduce((sum, product) => sum + ((product.precio || 0) * (product.stock || 0)), 0);
  const productosStockBajo = filteredProducts.filter(p => (p.stock || 0) <= (p.stockMinimo || 0)).length;
  const valorPromedio = filteredProducts.length > 0 ?
    filteredProducts.reduce((sum, product) => sum + (product.precio || 0), 0) / filteredProducts.length : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ mb: 2 }}>
        <Toolbar sx={{ px: 2, py: 2 }}>
          <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
            <TextField
              {...register('searchTerm')}
              placeholder="Buscar por código ERP, código comercial o descripción..."
              variant="outlined"
              size="small"
              sx={{ minWidth: 350 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Marca</InputLabel>
              <Select
                {...register('marca')}
                label="Marca"
              >
                <MenuItem value="">Todas</MenuItem>
                {marcas.map(marca => (
                  <MenuItem key={marca.value} value={marca.value}>
                    {marca.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Clase</InputLabel>
              <Select
                {...register('clase')}
                label="Clase"
              >
                <MenuItem value="">Todas</MenuItem>
                {clases.map(clase => (
                  <MenuItem key={clase.value} value={clase.value}>
                    {clase.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                {...register('estado')}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                {estadosProducto.map(estado => (
                  <MenuItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Unidad</InputLabel>
              <Select
                {...register('unidadMedida')}
                label="Unidad"
              >
                <MenuItem value="">Todas</MenuItem>
                {unidadesMedida.map(unidad => (
                  <MenuItem key={unidad.value} value={unidad.value}>
                    {unidad.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Limpiar filtros">
              <IconButton onClick={handleClearFilters} size="small">
                <FilterIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Actualizar">
              <IconButton onClick={handleRefresh} size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Exportar">
              <IconButton size="small">
                <DownloadIcon />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddProduct}
              size="small" >
              Agregar Producto
            </Button>
          </Stack>
        </Toolbar>
      </Paper>

      {/* Modal para agregar producto */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '80vh' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div">
              Agregar Nuevo Producto
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmitProduct(onSubmitProduct)}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              {/* Información básica */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  Información Básica
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...registerProduct('codERP', {
                    required: 'El código ERP es requerido',
                    pattern: { value: /^PQ\d{5}$/, message: 'Formato: PQ00000' }
                  })}
                  label="Código ERP"
                  fullWidth
                  placeholder="PQ00000"
                  error={!!errors.codERP}
                  helperText={errors.codERP?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...registerProduct('marca', { required: 'La marca es requerida' })}
                  label="Marca"
                  fullWidth
                  error={!!errors.marca}
                  helperText={errors.marca?.message}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  {...registerProduct('codComercial', { required: 'El código comercial es requerido' })}
                  label="Código Comercial"
                  fullWidth
                  error={!!errors.codComercial}
                  helperText={errors.codComercial?.message}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  {...registerProduct('descripcion', { required: 'La descripción es requerida' })}
                  label="Descripción"
                  fullWidth
                  multiline
                  rows={2}
                  error={!!errors.descripcion}
                  helperText={errors.descripcion?.message}
                />
              </Grid>

              {/* Clasificación */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                  Clasificación
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth error={!!errors.unidadMedida}>
                  <InputLabel>Unidad de Medida</InputLabel>
                  <Controller
                    name="unidadMedida"
                    control={controlProduct}
                    rules={{ required: 'La unidad de medida es requerida' }}
                    render={({ field }) => (
                      <Select {...field} label="Unidad de Medida">
                        {unidadesMedida.map(unidad => (
                          <MenuItem key={unidad.value} value={unidad.value}>
                            {unidad.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.unidadMedida && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.unidadMedida.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth error={!!errors.clase}>
                  <InputLabel>Clase</InputLabel>
                  <Controller
                    name="clase"
                    control={controlProduct}
                    rules={{ required: 'La clase es requerida' }}
                    render={({ field }) => (
                      <Select {...field} label="Clase">
                        {clases.map(clase => (
                          <MenuItem key={clase.value} value={clase.value}>
                            {clase.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.clase && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.clase.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth error={!!errors.estado}>
                  <InputLabel>Estado</InputLabel>
                  <Controller
                    name="estado"
                    control={controlProduct}
                    rules={{ required: 'El estado es requerido' }}
                    render={({ field }) => (
                      <Select {...field} label="Estado">
                        {estadosProducto.map(estado => (
                          <MenuItem key={estado.value} value={estado.value}>
                            {estado.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.estado && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.estado.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Sub Clase</InputLabel>
                  <Controller
                    name="subClase"
                    control={controlProduct}
                    render={({ field }) => (
                      <Select {...field} label="Sub Clase">
                        <MenuItem value="">Seleccionar</MenuItem>
                        {(subClasesMap[watchProduct('clase')] || []).map(subClase => (
                          <MenuItem key={subClase.value} value={subClase.value}>
                            {subClase.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Sub Sub Clase</InputLabel>
                  <Controller
                    name="subSubClase"
                    control={controlProduct}
                    render={({ field }) => (
                      <Select {...field} label="Sub Sub Clase">
                        <MenuItem value="">Seleccionar</MenuItem>
                        {(subSubClasesMap[watchProduct('subClase')] || []).map(subSubClase => (
                          <MenuItem key={subSubClase.value} value={subSubClase.value}>
                            {subSubClase.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Información comercial */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                  Información Comercial
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  {...registerProduct('precio', {
                    required: 'El precio es requerido',
                    min: { value: 0, message: 'El precio debe ser mayor a 0' }
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
                  {...registerProduct('stock', {
                    required: 'El stock es requerido',
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
                  {...registerProduct('stockMinimo', {
                    required: 'El stock mínimo es requerido',
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

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Moneda</InputLabel>
                  <Controller
                    name="bbssSunat"
                    control={controlProduct}
                    render={({ field }) => (
                      <Select {...field} label="Moneda">
                        {monedas.map(moneda => (
                          <MenuItem key={moneda.value} value={moneda.value}>
                            {moneda.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Traducciones */}
              <Grid size={12}>
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="incluirTraducciones"
                        control={controlProduct}
                        render={({ field }) => (
                          <Switch {...field} checked={field.value} />
                        )}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LanguageIcon fontSize="small" />
                        <Typography>Incluir traducciones al inglés</Typography>
                      </Box>
                    }
                  />
                </Box>
              </Grid>

              {incluirTraducciones && (
                <>
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Traducciones
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...registerProduct('modeloTraduccion')}
                      label="Modelo (Inglés)"
                      fullWidth
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...registerProduct('materialTraduccion')}
                      label="Material (Inglés)"
                      fullWidth
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      {...registerProduct('descripcionTraduccion')}
                      label="Descripción (Inglés)"
                      fullWidth
                      multiline
                      rows={2}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      {...registerProduct('usoTraduccion')}
                      label="Uso/Aplicación (Inglés)"
                      fullWidth
                      multiline
                      rows={2}
                    />
                  </Grid>
                </>
              )}

              {/* Información adicional */}
              <Grid size={12}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Nota:</strong> Una vez creado el producto, se generará automáticamente la fecha de creación
                    y estará disponible para su gestión en el inventario.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleCloseModal}
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
              {submitting ? 'Guardando...' : 'Guardar Producto'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1600 }} aria-label="tabla de productos">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cód. ERP</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Marca</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cód. Comercial</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Unidad</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Clasificación</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Stock</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Precio</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => {
                const stockStatus = getStockStatus(product.stock || 0, product.stockMinimo || 0);
                return (
                  <TableRow
                    key={product.id}
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                      '&:hover': { backgroundColor: 'action.selected' }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <QrCodeIcon fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ fontWeight: 'medium', fontFamily: 'monospace' }}>
                          {product.codERP}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={product.marca} size="small" variant="outlined" color="primary" />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap title={product.codComercial} sx={{ fontFamily: 'monospace' }}>
                        {product.codComercial}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 250 }}>
                      <Box>
                        <Typography variant="body2" noWrap title={product.descripcion}>
                          {product.descripcion}
                        </Typography>
                        {product.descripcionTraduccion && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LanguageIcon fontSize="small" />
                            {product.descripcionTraduccion}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={product.unidadMedida} size="small" variant="filled" />
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Chip label={product.clase} size="small" variant="outlined" />
                        <Typography variant="caption" color="text.secondary">
                          {product.subClase} → {product.subSubClase}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {product.stock || 0}
                          </Typography>
                          <Chip
                            label={stockStatus.label}
                            color={stockStatus.color as any}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Mín: {product.stockMinimo || 0}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          ${(product.precio || 0).toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.bbssSunat}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.estado}
                        color={getStatusColor(product.estado) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => handleViewProduct(product.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => handleEditProduct(product.id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteProduct(product.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No se encontraron productos que coincidan con los filtros
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />
    </Box>
  );
};

export default ListProducts;