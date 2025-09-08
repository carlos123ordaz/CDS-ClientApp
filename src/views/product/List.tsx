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
  Breadcrumbs,
  Link,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Inventory as InventoryIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  RefreshOutlined as RefreshIcon,
  Language as LanguageIcon,
  QrCode as QrCodeIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

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
  // Información adicional
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

const ListProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, watch, reset } = useForm<SearchForm>({
    defaultValues: {
      searchTerm: '',
      marca: '',
      clase: '',
      estado: '',
      unidadMedida: '',
    }
  });

  const searchTerm = watch('searchTerm');
  const marcaFilter = watch('marca');
  const claseFilter = watch('clase');
  const estadoFilter = watch('estado');
  const unidadMedidaFilter = watch('unidadMedida');

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
    navigate('/product-create');
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
  ];

  // Calcular estadísticas
  const productosActivos = filteredProducts.filter(p => p.estado === 'ACTIVO').length;
  const valorInventario = filteredProducts.reduce((sum, product) => sum + ((product.precio || 0) * (product.stock || 0)), 0);
  const productosStockBajo = filteredProducts.filter(p => (p.stock || 0) <= (p.stockMinimo || 0)).length;
  const valorPromedio = filteredProducts.length > 0 ? 
    filteredProducts.reduce((sum, product) => sum + (product.precio || 0), 0) / filteredProducts.length : 0;

  return (
    <Box sx={{ p: 3 }}>
     
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent sx={{ color: 'white', pb: '16px !important' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Gestión de Productos
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {filteredProducts.length} producto(s) registrado(s)
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Avatar
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  border: '3px solid rgba(255,255,255,0.3)'
                }}
              >
                <InventoryIcon sx={{ fontSize: 40 }} />
              </Avatar>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Cards de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm:6, md:3}}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <InventoryIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{productosActivos}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Productos Activos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm:6, md:3}}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    ${(valorInventario / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Valor Inventario
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm:6, md:3}}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{productosStockBajo}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock Bajo
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm:6, md:3}}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <ShoppingCartIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    ${valorPromedio.toFixed(0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Precio Promedio
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Toolbar con búsqueda y filtros */}
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
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
              }}
            >
              Agregar Producto
            </Button>
          </Stack>
        </Toolbar>
      </Paper>

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