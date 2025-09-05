import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    Paper,
    IconButton,
    Avatar,
    Chip,
    Alert,
    Breadcrumbs,
    Link,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fab,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Checkbox,
    Menu,
    ListItemIcon,
    ListItemText,
    Divider,
    Badge,
    Tooltip,
    Stack,
} from '@mui/material';
import {
    Inventory as InventoryIcon,
    Add as AddIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Download as DownloadIcon,
    Upload as UploadIcon,
    Home as HomeIcon,
    NavigateNext as NavigateNextIcon,
    Category as CategoryIcon,
    QrCode as QrCodeIcon,
    LocalOffer as TagIcon,
    Clear as ClearIcon,
    Refresh as RefreshIcon,
    Print as PrintIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Interface para productos
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
    bbssSunat: string;
    estado: 'ACTIVO' | 'INACTIVO' | 'DESCONTINUADO' | 'EN_DESARROLLO';
    fechaCreacion: string;
    fechaModificacion: string;
}

// Datos de ejemplo
const productosEjemplo: Product[] = [
    {
        id: '1',
        codERP: 'ANT-VEN-123456',
        marca: 'ANTICIPEL',
        codComercial: 'COD-001',
        descripcion: 'Detector de gases industriales modelo XRT-500 con calibración automática',
        unidadMedida: 'UND',
        clase: 'VENTA',
        subClase: 'ELECTRONICO',
        subSubClase: 'NUEVO',
        bbssSunat: 'USD',
        estado: 'ACTIVO',
        fechaCreacion: '2024-01-15',
        fechaModificacion: '2024-01-20',
    },
    {
        id: '2',
        codERP: 'CRE-SER-789012',
        marca: 'CREDITO',
        codComercial: 'COD-002',
        descripcion: 'Servicio de mantenimiento preventivo para equipos de detección',
        unidadMedida: 'UND',
        clase: 'SERVICIO',
        subClase: 'MECANICO',
        subSubClase: 'GARANTIA',
        bbssSunat: 'PEN',
        estado: 'ACTIVO',
        fechaCreacion: '2024-01-10',
        fechaModificacion: '2024-01-18',
    },
    {
        id: '3',
        codERP: 'EFE-PRO-345678',
        marca: 'EFECTIVO',
        codComercial: 'COD-003',
        descripcion: 'Proyecto de instalación de sistema de monitoreo ambiental',
        unidadMedida: 'UND',
        clase: 'PROYECTO',
        subClase: 'ELECTRONICO',
        subSubClase: 'STOCK',
        bbssSunat: 'USD',
        estado: 'EN_DESARROLLO',
        fechaCreacion: '2024-01-05',
        fechaModificacion: '2024-01-22',
    },
    {
        id: '4',
        codERP: 'LET-IMP-901234',
        marca: 'LETRA',
        codComercial: 'COD-004',
        descripcion: 'Importación de sensores de presión alta precisión',
        unidadMedida: 'UND',
        clase: 'IMPORTACION',
        subClase: 'QUIMICO',
        subSubClase: 'BACKORDER',
        bbssSunat: 'EUR',
        estado: 'ACTIVO',
        fechaCreacion: '2024-01-12',
        fechaModificacion: '2024-01-25',
    },
    {
        id: '5',
        codERP: 'OTR-EXP-567890',
        marca: 'OTROS',
        codComercial: 'COD-005',
        descripcion: 'Equipo refurbished para exportación - Analizador de gases',
        unidadMedida: 'UND',
        clase: 'EXPORTACION',
        subClase: 'ELECTRONICO',
        subSubClase: 'REFURBISHED',
        bbssSunat: 'USD',
        estado: 'DESCONTINUADO',
        fechaCreacion: '2024-01-08',
        fechaModificacion: '2024-01-15',
    },
];

const ProductList = () => {
    const navigate = useNavigate();
    
    // Estados principales
    const [productos, setProductos] = React.useState<Product[]>(productosEjemplo);
    const [filteredProductos, setFilteredProductos] = React.useState<Product[]>(productosEjemplo);
    const [loading, setLoading] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filterEstado, setFilterEstado] = React.useState('');
    const [filterClase, setFilterClase] = React.useState('');
    const [filterMarca, setFilterMarca] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [selected, setSelected] = React.useState<string[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState({ 
        open: false, 
        message: '', 
        severity: 'success' as 'success' | 'error' | 'warning' | 'info' 
    });

    // Opciones para filtros
    const estados = ['ACTIVO', 'INACTIVO', 'DESCONTINUADO', 'EN_DESARROLLO'];
    const clases = ['VENTA', 'SERVICIO', 'PROYECTO', 'IMPORTACION', 'EXPORTACION'];
    const marcas = ['ANTICIPEL', 'CREDITO', 'EFECTIVO', 'LETRA', 'OTROS'];

    // Filtrar productos
    React.useEffect(() => {
        let filtered = productos.filter(producto => {
            const matchesSearch = searchTerm === '' || 
                producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.codERP.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.codComercial.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesEstado = filterEstado === '' || producto.estado === filterEstado;
            const matchesClase = filterClase === '' || producto.clase === filterClase;
            const matchesMarca = filterMarca === '' || producto.marca === filterMarca;

            return matchesSearch && matchesEstado && matchesClase && matchesMarca;
        });

        setFilteredProductos(filtered);
        setPage(0);
    }, [searchTerm, filterEstado, filterClase, filterMarca, productos]);

    // Manejar selección
    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = filteredProductos.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    // Manejar acciones
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, producto: Product) => {
        setAnchorEl(event.currentTarget);
        setSelectedProduct(producto);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedProduct(null);
    };

    const handleViewProduct = () => {
        setDetailDialogOpen(true);
        handleMenuClose();
    };

    const handleEditProduct = () => {
        if (selectedProduct) {
            navigate(`/productos/editar/${selectedProduct.id}`);
        }
        handleMenuClose();
    };

    const handleDeleteProduct = () => {
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const confirmDelete = () => {
        if (selectedProduct) {
            setProductos(productos.filter(p => p.id !== selectedProduct.id));
            setSnackbar({
                open: true,
                message: 'Producto eliminado correctamente',
                severity: 'success'
            });
        }
        setDeleteDialogOpen(false);
        setSelectedProduct(null);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterEstado('');
        setFilterClase('');
        setFilterMarca('');
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'ACTIVO': return 'success';
            case 'INACTIVO': return 'error';
            case 'DESCONTINUADO': return 'warning';
            case 'EN_DESARROLLO': return 'info';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
            {/* Breadcrumbs */}
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                sx={{ mb: 3 }}
            >
                <Link
                    underline="hover"
                    color="inherit"
                    href="#"
                    onClick={() => navigate('/')}
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Inicio
                </Link>
                <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <InventoryIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Productos
                </Typography>
            </Breadcrumbs>

            {/* Header */}
            <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)' }}>
                <CardContent sx={{ color: 'white', pb: '16px !important' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Gestión de Productos
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                {filteredProductos.length} productos encontrados
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

            {/* Controles y filtros */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        {/* Búsqueda */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Filtros */}
                        <Grid size={{ xs: 12, md: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={filterEstado}
                                    label="Estado"
                                    onChange={(e) => setFilterEstado(e.target.value)}
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    {estados.map(estado => (
                                        <MenuItem key={estado} value={estado}>{estado}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Clase</InputLabel>
                                <Select
                                    value={filterClase}
                                    label="Clase"
                                    onChange={(e) => setFilterClase(e.target.value)}
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    {clases.map(clase => (
                                        <MenuItem key={clase} value={clase}>{clase}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Marca</InputLabel>
                                <Select
                                    value={filterMarca}
                                    label="Marca"
                                    onChange={(e) => setFilterMarca(e.target.value)}
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    {marcas.map(marca => (
                                        <MenuItem key={marca} value={marca}>{marca}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Botones de acción */}
                        <Grid size={{ xs: 12, md: 2 }}>
                            <Stack direction="row" spacing={1}>
                                <Tooltip title="Limpiar filtros">
                                    <IconButton onClick={clearFilters} size="small">
                                        <ClearIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Actualizar">
                                    <IconButton onClick={() => setLoading(true)} size="small">
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Exportar">
                                    <IconButton size="small">
                                        <DownloadIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* Acciones masivas */}
                    {selected.length > 0 && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    {selected.length} productos seleccionados
                                </Typography>
                                <Button size="small" startIcon={<DeleteIcon />} color="error">
                                    Eliminar seleccionados
                                </Button>
                                <Button size="small" startIcon={<DownloadIcon />}>
                                    Exportar seleccionados
                                </Button>
                            </Stack>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Tabla de productos */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        indeterminate={selected.length > 0 && selected.length < filteredProductos.length}
                                        checked={filteredProductos.length > 0 && selected.length === filteredProductos.length}
                                        onChange={handleSelectAllClick}
                                    />
                                </TableCell>
                                <TableCell>Código ERP</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Marca</TableCell>
                                <TableCell>Clase</TableCell>
                                <TableCell>Sub-Clase</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Fecha Creación</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProductos
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((producto) => {
                                    const isItemSelected = isSelected(producto.id);
                                    return (
                                        <TableRow
                                            hover
                                            key={producto.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    onClick={(event) => handleClick(event, producto.id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <QrCodeIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                        {producto.codERP}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ maxWidth: 200 }}>
                                                    {producto.descripcion.length > 60 
                                                        ? `${producto.descripcion.substring(0, 60)}...` 
                                                        : producto.descripcion
                                                    }
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {producto.codComercial}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={producto.marca} 
                                                    size="small" 
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>{producto.clase}</TableCell>
                                            <TableCell>{producto.subClase}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={producto.estado}
                                                    color={getEstadoColor(producto.estado) as any}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {new Date(producto.fechaCreacion).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handleMenuClick(e, producto)}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Paginación */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filteredProductos.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
            </Card>

            {/* Botón flotante para agregar */}
            <Fab
                color="primary"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                }}
                onClick={() => navigate('/productos/crear')}
            >
                <AddIcon />
            </Fab>

            {/* Menú contextual */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleViewProduct}>
                    <ListItemIcon>
                        <ViewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Ver detalles</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleEditProduct}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Editar</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleDeleteProduct} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Eliminar</ListItemText>
                </MenuItem>
            </Menu>

            {/* Diálogo de confirmación de eliminación */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Está seguro que desea eliminar el producto "{selectedProduct?.descripcion}"?
                        Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de detalles del producto */}
            <Dialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <InventoryIcon sx={{ mr: 1 }} />
                        Detalles del Producto
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedProduct && (
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}>
                                        <InventoryIcon fontSize="large" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6">{selectedProduct.descripcion}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedProduct.codERP} | {selectedProduct.codComercial}
                                        </Typography>
                                        <Chip
                                            label={selectedProduct.estado}
                                            color={getEstadoColor(selectedProduct.estado) as any}
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2"><strong>Marca:</strong> {selectedProduct.marca}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2"><strong>Unidad:</strong> {selectedProduct.unidadMedida}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2"><strong>Clase:</strong> {selectedProduct.clase}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2"><strong>Sub-Clase:</strong> {selectedProduct.subClase}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2"><strong>Sub-Sub-Clase:</strong> {selectedProduct.subSubClase}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2"><strong>BBSS SUNAT:</strong> {selectedProduct.bbssSunat}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2"><strong>Fecha Creación:</strong> {new Date(selectedProduct.fechaCreacion).toLocaleDateString()}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2"><strong>Última Modificación:</strong> {new Date(selectedProduct.fechaModificacion).toLocaleDateString()}</Typography>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailDialogOpen(false)}>
                        Cerrar
                    </Button>
                    <Button onClick={handleEditProduct} variant="contained">
                        Editar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para notificaciones */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert 
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProductList;