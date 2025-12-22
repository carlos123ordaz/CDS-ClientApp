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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Avatar,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Inventory as InventoryIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  RefreshOutlined as RefreshIcon,
  Language as LanguageIcon,
  QrCode as QrCodeIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { ProductEdit } from 'src/components/products/ProductEdit';
import { ProductCreate } from 'src/components/products/ProductCreate';


// Interfaces basadas en la tabla Item de la BD
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
  // Datos adicionales de otras tablas relacionadas
  marca?: string; // De tabla Marca
  nombreClase?: string; // De tabla Clase
  nombreSClase?: string; // De tabla SClase
  nombreSSClase?: string; // De tabla SSClase
  unidadesMedida?: string[]; // De tabla ProdUM
  stock?: number; // De tabla AlmacenStock
  stockMinimo?: number; // Configuración adicional
  precio?: number; // Si tienes tabla de precios
}

// Interfaz para el formulario de búsqueda
interface SearchForm {
  searchTerm: string;
  tipoItem: string;
  marcaID: string;
  claseID: string;
  estado: string;
}

// Datos auxiliares para selects
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

const ListProducts: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  // Modales
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Item seleccionado para editar/eliminar
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Datos maestros
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [clases, setClases] = useState<Clase[]>([]);

  const { register, watch, reset } = useForm<SearchForm>({
    defaultValues: {
      searchTerm: '',
      tipoItem: '',
      marcaID: '',
      claseID: '',
      estado: '',
    }
  });

  const searchTerm = watch('searchTerm');
  const tipoItemFilter = watch('tipoItem');
  const marcaFilter = watch('marcaID');
  const claseFilter = watch('claseID');
  const estadoFilter = watch('estado');

  // Mock data basado en tu estructura de BD
  const mockMarcas: Marca[] = [
    {
      marcaID: 1,
      codigo: 'EH',
      nombre: 'Endress+Hauser',
      descrip: 'Instrumentación industrial',
      nCorto: 'E+H',
      estado: true,
    },
    {
      marcaID: 2,
      codigo: 'SIE',
      nombre: 'Siemens',
      descrip: 'Automatización industrial',
      nCorto: 'Siemens',
      estado: true,
    },
    {
      marcaID: 3,
      codigo: 'ABB',
      nombre: 'ABB Group',
      descrip: 'Tecnología de potencia y automatización',
      nCorto: 'ABB',
      estado: true,
    },
  ];

  const mockClases: Clase[] = [
    {
      claseID: 1,
      nombre: 'Instrumentos',
      codigo: '01-INST',
      estado: true,
    },
    {
      claseID: 2,
      nombre: 'Accesorios',
      codigo: '02-ACC',
      estado: true,
    },
    {
      claseID: 3,
      nombre: 'Servicios',
      codigo: '03-SRV',
      estado: true,
    },
  ];

  const mockItems: Item[] = [
    {
      itemID: 1,
      tipoItem: 'PRODUCTO',
      codigoERP: 'PQ02028',
      codCom: 'HAW5E9-CBXC1-PA',
      descrip: 'Sensor de presión diferencial para líquidos, rango 0-100 bar, salida 4-20mA',
      modeloTraduc: 'Differential Pressure Sensor',
      descripTraduc: 'Differential pressure sensor for liquids, range 0-100 bar, output 4-20mA',
      materialTraduc: 'Stainless Steel 316L',
      usoTraduc: 'Industrial pressure measurement in chemical processes',
      codSunat: '90261000',
      fecCrea: new Date('2023-01-15'),
      fecMod: new Date('2024-01-15'),
      marcaID: 1,
      estado: true,
      claseID: 1,
      sClaseID: 1,
      ssClaseID: 1,
      marca: 'Endress+Hauser',
      nombreClase: 'Instrumentos',
      nombreSClase: 'Presión',
      nombreSSClase: 'Diferencial',
      unidadesMedida: ['UND'],
      stock: 15,
      stockMinimo: 5,
      precio: 1250.00,
    },
    {
      itemID: 2,
      tipoItem: 'PRODUCTO',
      codigoERP: 'PQ03446',
      codCom: 'CPF51E-AASLA02',
      descrip: 'Sensor de pH para aplicaciones químicas, electrodo de vidrio, compensación automática de temperatura',
      modeloTraduc: 'pH Sensor',
      descripTraduc: 'pH sensor for chemical applications, glass electrode, automatic temperature compensation',
      materialTraduc: 'Glass electrode with Pt1000',
      usoTraduc: 'Chemical process monitoring and water treatment',
      codSunat: '90271000',
      fecCrea: new Date('2023-02-10'),
      fecMod: new Date('2024-02-10'),
      marcaID: 1,
      estado: true,
      claseID: 1,
      sClaseID: 2,
      ssClaseID: 3,
      marca: 'Endress+Hauser',
      nombreClase: 'Instrumentos',
      nombreSClase: 'Analíticos',
      nombreSSClase: 'pH',
      unidadesMedida: ['UND'],
      stock: 8,
      stockMinimo: 3,
      precio: 850.00,
    },
    {
      itemID: 3,
      tipoItem: 'SERVICIO',
      codigoERP: 'SV00001',
      codCom: 'CAL-INST-001',
      descrip: 'Servicio de calibración de instrumentos de presión y temperatura según normas ISO',
      codSunat: '71200000',
      fecCrea: new Date('2023-03-01'),
      fecMod: new Date('2024-03-01'),
      marcaID: 1,
      estado: true,
      claseID: 3,
      marca: 'Endress+Hauser',
      nombreClase: 'Servicios',
      unidadesMedida: ['HRS'],
      precio: 120.00,
    },
    {
      itemID: 4,
      tipoItem: 'ACCESORIO',
      codigoERP: 'AC00811',
      codCom: '71158246',
      descrip: 'Cable de extensión para sensores, 10 metros, conectores M12, certificado IP67',
      modeloTraduc: 'Extension Cable',
      descripTraduc: 'Extension cable for sensors, 10 meters, M12 connectors, IP67 certified',
      materialTraduc: 'PVC insulated copper wire',
      usoTraduc: 'Sensor signal transmission in industrial environments',
      codSunat: '85444290',
      fecCrea: new Date('2022-11-10'),
      fecMod: new Date('2024-01-20'),
      marcaID: 1,
      estado: true,
      claseID: 2,
      marca: 'Endress+Hauser',
      nombreClase: 'Accesorios',
      unidadesMedida: ['M'],
      stock: 150,
      stockMinimo: 50,
      precio: 25.00,
    },
    {
      itemID: 5,
      tipoItem: 'PRODUCTO',
      codigoERP: 'PQ00473',
      codCom: 'CPT20-G02D1',
      descrip: 'Transmisor de presión manométrica, 0-10 bar, display LCD, protocolo HART',
      modeloTraduc: 'Gauge Pressure Transmitter',
      descripTraduc: 'Gauge pressure transmitter, 0-10 bar, LCD display, HART protocol',
      materialTraduc: 'Stainless Steel 316 housing',
      usoTraduc: 'Industrial pressure monitoring in process control',
      codSunat: '90261000',
      fecCrea: new Date('2023-03-25'),
      fecMod: new Date('2024-08-15'),
      marcaID: 1,
      estado: false, // Inactivo
      claseID: 1,
      marca: 'Endress+Hauser',
      nombreClase: 'Instrumentos',
      unidadesMedida: ['UND'],
      stock: 0,
      stockMinimo: 4,
      precio: 1650.00,
    },
    {
      itemID: 6,
      tipoItem: 'PRODUCTO',
      codigoERP: 'PQ04452',
      codCom: 'CPT20-EN2D1',
      descrip: 'Transmisor de presión absoluta en desarrollo, tecnología cerámica avanzada',
      modeloTraduc: 'Absolute Pressure Transmitter',
      descripTraduc: 'Absolute pressure transmitter in development, advanced ceramic technology',
      materialTraduc: 'Ceramic sensing element',
      usoTraduc: 'Vacuum and absolute pressure measurement',
      codSunat: '90261000',
      fecCrea: new Date('2024-01-08'),
      fecMod: new Date('2024-09-01'),
      marcaID: 2, // Siemens
      estado: true,
      claseID: 1,
      marca: 'Siemens',
      nombreClase: 'Instrumentos',
      unidadesMedida: ['UND'],
      stock: 0,
      stockMinimo: 3,
      precio: 1800.00,
    },
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);

    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMarcas(mockMarcas);
      setClases(mockClases);
      setItems(mockItems);
      setFilteredItems(mockItems);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar items basado en los criterios de búsqueda
  useEffect(() => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.codigoERP.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codCom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descrip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descripTraduc?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (tipoItemFilter) {
      filtered = filtered.filter(item => item.tipoItem === tipoItemFilter);
    }

    if (marcaFilter) {
      filtered = filtered.filter(item => item.marcaID.toString() === marcaFilter);
    }

    if (claseFilter) {
      filtered = filtered.filter(item => item.claseID?.toString() === claseFilter);
    }

    if (estadoFilter) {
      const estadoBool = estadoFilter === 'true';
      filtered = filtered.filter(item => item.estado === estadoBool);
    }

    setFilteredItems(filtered);
    setPage(0);
  }, [searchTerm, tipoItemFilter, marcaFilter, claseFilter, estadoFilter, items]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handlers para modales
  const handleAddProduct = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  const handleEditProduct = (item: Item) => {
    setSelectedItem(item);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedItem(null);
  };

  const handleDeleteProduct = (item: Item) => {
    setSelectedItem(item);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedItem) {
      try {
        // Simular eliminación
        await new Promise(resolve => setTimeout(resolve, 1000));

        setItems(prev => prev.filter(item => item.itemID !== selectedItem.itemID));
        setFilteredItems(prev => prev.filter(item => item.itemID !== selectedItem.itemID));

        setOpenDeleteDialog(false);
        setSelectedItem(null);
        alert('Item eliminado exitosamente');
      } catch (error) {
        alert('Error al eliminar el item');
      }
    }
  };

  const handleViewProduct = (itemID: number) => {
    console.log('Ver item:', itemID);
    // Aquí podrías abrir un modal de vista o navegar a una página de detalles
  };

  const handleRefresh = () => {
    loadInitialData();
  };

  const handleClearFilters = () => {
    reset();
  };

  // Handlers para callbacks de modales
  const handleItemCreated = (newItem: Item) => {
    setItems(prev => [newItem, ...prev]);
    setFilteredItems(prev => [newItem, ...prev]);
  };

  const handleItemUpdated = (updatedItem: Item) => {
    setItems(prev => prev.map(item =>
      item.itemID === updatedItem.itemID ? updatedItem : item
    ));
    setFilteredItems(prev => prev.map(item =>
      item.itemID === updatedItem.itemID ? updatedItem : item
    ));
  };

  const getStockStatus = (stock: number = 0, stockMinimo: number = 0) => {
    if (stock === 0) return { color: 'error', label: 'Sin Stock' };
    if (stock <= stockMinimo) return { color: 'warning', label: 'Stock Bajo' };
    return { color: 'success', label: 'Stock OK' };
  };

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Opciones para filtros
  const tiposItem = [
    { value: 'PRODUCTO', label: 'Producto' },
    { value: 'SERVICIO', label: 'Servicio' },
    { value: 'REPUESTO', label: 'Repuesto' },
    { value: 'ACCESORIO', label: 'Accesorio' },
  ];

  // Calcular estadísticas
  const itemsActivos = filteredItems.filter(i => i.estado).length;
  const productos = filteredItems.filter(i => i.tipoItem === 'PRODUCTO').length;
  const servicios = filteredItems.filter(i => i.tipoItem === 'SERVICIO').length;
  const stockBajo = filteredItems.filter(i =>
    i.stock !== undefined && i.stockMinimo !== undefined && i.stock <= i.stockMinimo
  ).length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Estadísticas rápidas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <InventoryIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{itemsActivos}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Items Activos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <QrCodeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{productos}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Productos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{servicios}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Servicios
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stockBajo}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock Bajo
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
              <InputLabel>Tipo Item</InputLabel>
              <Select
                {...register('tipoItem')}
                label="Tipo Item"
              >
                <MenuItem value="">Todos</MenuItem>
                {tiposItem.map(tipo => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Marca</InputLabel>
              <Select
                {...register('marcaID')}
                label="Marca"
              >
                <MenuItem value="">Todas</MenuItem>
                {marcas.map(marca => (
                  <MenuItem key={marca.marcaID} value={marca.marcaID.toString()}>
                    {marca.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Clase</InputLabel>
              <Select
                {...register('claseID')}
                label="Clase"
              >
                <MenuItem value="">Todas</MenuItem>
                {clases.map(clase => (
                  <MenuItem key={clase.claseID} value={clase.claseID.toString()}>
                    {clase.nombre}
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
              size="small"
            >
              Nuevo Producto
            </Button>
          </Stack>
        </Toolbar>
      </Paper>

      {/* Tabla mejorada */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1600 }} aria-label="tabla de items">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cód. ERP</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Marca</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cód. Comercial</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Clasificación</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Stock</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Precio</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Skeleton loaders elegantes
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Skeleton variant="circular" width={20} height={20} />
                      <Skeleton variant="text" width={100} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={120} height={24} sx={{ borderRadius: 1 }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={140} />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Skeleton variant="text" width={200} />
                      <Skeleton variant="text" width={160} height={16} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Skeleton variant="rectangular" width={90} height={20} sx={{ borderRadius: 1, mb: 0.5 }} />
                      <Skeleton variant="text" width={120} height={14} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Skeleton variant="text" width={40} />
                        <Skeleton variant="rectangular" width={70} height={20} sx={{ borderRadius: 1 }} />
                      </Box>
                      <Skeleton variant="text" width={50} height={14} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // Datos reales
              filteredItems
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => {
                  const stockStatus = getStockStatus(item.stock, item.stockMinimo);
                  return (
                    <TableRow
                      key={item.itemID}
                      sx={{
                        '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                        '&:hover': { backgroundColor: 'action.selected' },
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <QrCodeIcon fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ fontWeight: 'medium', fontFamily: 'monospace' }}>
                            {item.codigoERP}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={item.marca} size="small" variant="outlined" color="primary" />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" noWrap title={item.codCom} sx={{ fontFamily: 'monospace' }}>
                          {item.codCom}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Box>
                          <Typography variant="body2" noWrap title={item.descrip}>
                            {item.descrip}
                          </Typography>
                          {item.descripTraduc && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LanguageIcon fontSize="small" />
                              {item.descripTraduc}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Chip label={item.nombreClase} size="small" variant="outlined" />
                          {item.nombreSClase && (
                            <Typography variant="caption" color="text.secondary">
                              {item.nombreSClase}
                              {item.nombreSSClase && ` → ${item.nombreSSClase}`}
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {item.stock !== undefined ? (
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {item.stock}
                              </Typography>
                              <Chip
                                label={stockStatus.label}
                                color={stockStatus.color as any}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Mín: {item.stockMinimo || 0}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.precio !== undefined ? (
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {formatCurrency(item.precio)}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.estado ? 'Activo' : 'Inactivo'}
                          color={item.estado ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={() => handleEditProduct(item)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteProduct(item)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
            {!loading && filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 8 }}>
                  <Box>
                    <InventoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No se encontraron productos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Intenta ajustar los filtros de búsqueda
                    </Typography>
                  </Box>
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
        count={filteredItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />

      {/* Modal de creación */}
      <ProductCreate
        openModal={openCreateModal}
        handleCloseModal={handleCloseCreateModal}
        marcas={marcas}
        clases={clases}
        onItemCreated={handleItemCreated}
      />

      {/* Modal de edición */}
      <ProductEdit
        openModal={openEditModal}
        handleCloseModal={handleCloseEditModal}
        item={selectedItem}
        marcas={marcas}
        clases={clases}
        onItemUpdated={handleItemUpdated}
      />

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            ¿Estás seguro de que quieres eliminar el item "{selectedItem?.descrip}"?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListProducts;