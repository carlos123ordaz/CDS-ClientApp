import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Breadcrumbs,
  Link,
  Skeleton,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent
} from '@mui/lab';
import {
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Business as BusinessIcon,
  LocalShipping as ShippingIcon,
  Assignment as AssignmentIcon,
  AccountBalance as AccountBalanceIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Factory as FactoryIcon,
  QrCode as QrCodeIcon,
  Scale as ScaleIcon,
  Public as PublicIcon,
  Anchor as AnchorIcon,
  FlightTakeoff as FlightIcon,
  Warehouse as WarehouseIcon,
  PictureAsPdf as PdfIcon,
  CloudUpload as UploadIcon,
  FileDownload as FileDownloadIcon,
  Attachment as AttachmentIcon
} from '@mui/icons-material';

// Interfaces basadas en tu esquema de BD
interface OrdenCompraDetallada {
  // Tabla OrdenCompra
  OCID: number;
  TipoOC: string;
  NumeroOC: string;
  FechaOC: string;
  FormaPagoID: number | null;
  MonedaID: number | null;
  MontoTotal: number | null;
  EstadoID: number | null;
  FecCreacion: string;
  FecModificacion: string;
  ProveedorID: number;
  RSocialProveedor: string;

  // Relaciones
  FormaPago?: {
    FormaPagoID: number;
    Descrip: string;
    CategoriaID: number;
    Categoria?: {
      CFPID: number;
      Nombre: string;
      NCorto: string;
    };
  };
  Moneda?: {
    MdaID: number;
    Codigo: string;
    Nombre: string;
    Estado: boolean;
  };
  Estado?: {
    EstadoID: number;
    Codigo: string;
    Descrip: string;
    SubEstadoId: number;
  };
  Proveedor?: {
    EmpresaID: number;
    TipoDocumento: string;
    NumDoc: string;
    RazonSocial: string;
    TipoCliente: string;
    Industria: string;
    Sector: string;
    Zona: string;
    Pais: string;
    FecCreacion: string;
    Estado: boolean;
  };

  // Detalles de la orden
  Detalles?: OrdenCompraDetalle[];

  // Órdenes de pedido relacionadas (tabla OrdenCompraPedidos)
  OrdenesPedido?: OrdenPedidoRelacionada[];
}

interface OrdenCompraDetalle {
  // Tabla OrdenCompraDetalle
  OCDetalleID: number;
  OCID: number;
  ItemID: number | null;
  ItemOC: string | null;
  ItemOP: string | null;
  Cantidad: number | null;
  MdaID: number | null;
  PrecioCompraUnitario1: number | null;
  PrecioCompraUnitario2: number | null;
  TipoCambioUSD: number | null;
  TiempoEntregaSemanas: number | null;
  NumCotizacionProveedor: string | null;
  FecOfrecida: string | null;
  NumConfirmProveedor: string | null;
  FecProveedorInicial: string | null;
  FecProveedorAct1: string | null;
  FecProveedorAct2: string | null;
  FecProveedorAct3: string | null;
  FecProveedorAct4: string | null;
  OperadorLogisticoID: number | null;
  FecInvoice: string | null;
  NumInvoice: string | null;
  NumItemInvoice: string | null;
  PaisEmbarque: string | null;
  CiudadEmbarque: string | null;
  PaisOrigen: string | null;
  NumDocTransporte: string | null;
  ETA: string | null;
  PesoBrutoKgs: number | null;
  FleteUSD: number | null;
  Nota1: string | null;
  Nota2: string | null;
  Nota3: string | null;
  Nota4: string | null;
  TipoEmbarque: string;
  IncotermID: number;
  TipoEmbarqueID: number;
  GImportacionID: number;
  EstadoID: number;

  // Relaciones
  Item?: {
    ItemID: number;
    TipoItem: string;
    CodigoERP: string | null;
    CodCom: string | null;
    Descrip: string | null;
    ModeloTraduc: string | null;
    DescripTraduc: string | null;
    MaterialTraduc: string | null;
    UsoTraduc: string | null;
    CodSunat: string | null;
    FecCreacion: string;
    MarcaID: number;
    Estado: boolean;
    UnidadMedidaID: number;
    SSClaseID: number;
    Marca?: {
      MarcaID: number;
      Ruc: string;
      Codigo: string;
      Nombre: string;
      Descrip: string;
      NCorto: string;
    };
    UnidadMedida?: {
      UnidadMedidaID: number;
      Codigo: string;
      Descrip: string;
    };
  };
  Moneda?: {
    MdaID: number;
    Codigo: string;
    Nombre: string;
  };
  Estado?: {
    EstadoID: number;
    Codigo: string;
    Descrip: string;
  };
  OperadorLogistico?: {
    OperadorID: number;
    Nombre: string;
    Estado: boolean;
  };
  Incoterm?: {
    IncotermID: number;
    Codigo: string;
    Descrip: string;
    Estado: boolean;
  };
  TipoEmbarqueObj?: {
    TipoEmbarqueID: number;
    Nombre: string;
    Estado: boolean;
  };
  GrupoImportacion?: {
    GImportacionID: number;
    Anio: number;
    NCorrelativo: string;
    Descrip: string;
    NGuia: string;
    PagoAduana: boolean;
    ETA: string;
    DescuentoAduana: boolean;
    ProveedorID: number;
  };

  // Control de almacén (tabla AlmacenControl)
  AlmacenControl?: {
    AlmacenControlID: number;
    CorrelativoOPCI: string | null;
    OCNumero: string | null;
    ItemOC: string | null;
    ItemOP: string | null;
    CodCom: string | null;
    ItemID: number | null;
    Cantidad: number | null;
    GrupoImport: string | null;
    AlmacenID: number | null;
    StatusAlmacen1EstadoID: number | null;
    StatusAlmacen2EstadoID: number | null;
    Ib_ConfAlm: boolean;
    MotivoConfAlm: string | null;
    Ib_ConfSrv: boolean;
    MotivoConfSrv: string | null;
    FecRecep: string | null;
    FecMercaderiaRevisada: string | null;
    DistritoDespacho: string | null;
    GuiaRemision: string | null;
    FecDespacho: string | null;
    ERP_Inta_Entrada: string | null;
    ERP_Inta_Salida: string | null;
    Nota1: string | null;
    Nota2: string | null;
    Nota3: string | null;
    FecCreacion: string;
    FecModific: string;
    OCDetalleID: number;
    Almacen?: {
      AlmacenID: number;
      Codigo: string;
      Nombre: string | null;
      Direccion: string;
      Estado: boolean;
      NCorto: string;
      Telefono: string;
      Observ: string;
    };
  };
}

interface OrdenPedidoRelacionada {
  // Tabla OrdenPedido via OrdenCompraPedidos
  OPCIID: number;
  CorrelativoOPCI: string;
  FecRecepcion: string;
  FecInicio: string | null;
  FecProcesamiento: string | null;
  NumeroOP: string | null;
  MdaID: number;
  MontoTotalSinIGV: number | null;
  NumReferClt: string | null;
  FormaPagoID: number | null;
  VdrPrincipalID: number | null;
  VdrSecundarioID: number | null;
  LiderID: number | null;
  UBrutaCoti: number | null;
  Ib_ComisionCompartida: boolean;
  EstadoID: number | null;
  ClienteID: number;
  CltProveedorID: number;
  CltFinalID: number;

  // Clientes relacionados
  Cliente?: {
    EmpresaID: number;
    RazonSocial: string | null;
    TipoDocumento: string | null;
    NumDoc: string | null;
    TipoCliente: string | null;
    Industria: string | null;
    Sector: string | null;
    Pais: string | null;
  };
  ClienteProveedor?: {
    EmpresaID: number;
    RazonSocial: string | null;
  };
  ClienteFinal?: {
    EmpresaID: number;
    RazonSocial: string | null;
  };

  // Usuarios
  VendedorPrincipal?: {
    UsuarioID: number;
    Nombre: string | null;
    Apellido: string | null;
    EsLider: boolean;
  };
  Lider?: {
    UsuarioID: number;
    Nombre: string | null;
    Apellido: string | null;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const OrdenCompraDetalle = () => {
  const [ordenCompra, setOrdenCompra] = useState<OrdenCompraDetallada | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  // Simular ID de orden desde URL
  const ordenId = 1; // En una app real, esto vendría de useParams() o props

  useEffect(() => {
    fetchOrdenCompraDetalle();
  }, []);

  const fetchOrdenCompraDetalle = async () => {
    setLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockData: OrdenCompraDetallada = {
        OCID: 1,
        TipoOC: "IMPORTACION",
        NumeroOC: "OC-2025-001",
        FechaOC: "2025-09-10T10:30:00.000Z",
        FormaPagoID: 1,
        MonedaID: 2,
        MontoTotal: 75320.50,
        EstadoID: 2,
        FecCreacion: "2025-09-10T10:30:00.000Z",
        FecModificacion: "2025-09-15T14:22:00.000Z",
        ProveedorID: 1001,
        RSocialProveedor: "SCHNEIDER ELECTRIC PERU S.A.",

        FormaPago: {
          FormaPagoID: 1,
          Descrip: "30 días después de la recepción",
          CategoriaID: 1,
          Categoria: {
            CFPID: 1,
            Nombre: "Crédito",
            NCorto: "CRE"
          }
        },

        Moneda: {
          MdaID: 2,
          Codigo: "USD",
          Nombre: "Dólares Americanos",
          Estado: true
        },

        Estado: {
          EstadoID: 2,
          Codigo: "APR",
          Descrip: "APROBADO",
          SubEstadoId: 1
        },

        Proveedor: {
          EmpresaID: 1001,
          TipoDocumento: "RUC",
          NumDoc: "20298765432",
          RazonSocial: "SCHNEIDER ELECTRIC PERU S.A.",
          TipoCliente: "PROVEEDOR_INTERNACIONAL",
          Industria: "Equipos Eléctricos",
          Sector: "Industrial",
          Zona: "Lima Metropolitana",
          Pais: "Perú",
          FecCreacion: "2020-05-15T00:00:00.000Z",
          Estado: true
        },

        Detalles: [
          {
            OCDetalleID: 1,
            OCID: 1,
            ItemID: 101,
            ItemOC: "OC-001",
            ItemOP: "OP-001",
            Cantidad: 25,
            MdaID: 2,
            PrecioCompraUnitario1: 1250.75,
            PrecioCompraUnitario2: 1250.75,
            TipoCambioUSD: 3.75,
            TiempoEntregaSemanas: 8,
            NumCotizacionProveedor: "COT-SE-2025-0156",
            FecOfrecida: "2025-09-05T00:00:00.000Z",
            NumConfirmProveedor: "CONF-SE-789",
            FecProveedorInicial: "2025-09-12T00:00:00.000Z",
            FecProveedorAct1: "2025-09-15T00:00:00.000Z",
            FecProveedorAct2: null,
            FecProveedorAct3: null,
            FecProveedorAct4: null,
            OperadorLogisticoID: 5,
            FecInvoice: "2025-09-20T00:00:00.000Z",
            NumInvoice: "INV-SE-4523",
            NumItemInvoice: "ITM-001",
            PaisEmbarque: "Francia",
            CiudadEmbarque: "Le Havre",
            PaisOrigen: "Francia",
            NumDocTransporte: "MAEU-123456789",
            ETA: "2025-11-15T00:00:00.000Z",
            PesoBrutoKgs: 850.5,
            FleteUSD: 2500.00,
            Nota1: "Requiere certificación CE",
            Nota2: "Embalaje especial para transporte marítimo",
            Nota3: null,
            Nota4: null,
            TipoEmbarque: "MARITIMO",
            IncotermID: 3,
            TipoEmbarqueID: 1,
            GImportacionID: 1,
            EstadoID: 3,

            Item: {
              ItemID: 101,
              TipoItem: "PRODUCTO",
              CodigoERP: "ERP-SE-001",
              CodCom: "COM-SE-001",
              Descrip: "Variador de frecuencia 75kW, 380-480V, IP20",
              ModeloTraduc: "ATV950C75N4",
              DescripTraduc: "Variable Frequency Drive 75kW, 380-480V, IP20",
              MaterialTraduc: "Metal enclosure with plastic front panel",
              UsoTraduc: "For industrial motor control applications",
              CodSunat: "85044088",
              FecCreacion: "2024-01-15T00:00:00.000Z",
              MarcaID: 15,
              Estado: true,
              UnidadMedidaID: 1,
              SSClaseID: 1,
              Marca: {
                MarcaID: 15,
                Ruc: "20100047218",
                Codigo: "SE",
                Nombre: "Schneider Electric",
                Descrip: "Schneider Electric Industrial Automation",
                NCorto: "SE"
              },
              UnidadMedida: {
                UnidadMedidaID: 1,
                Codigo: "UND",
                Descrip: "Unidad"
              }
            },

            Moneda: {
              MdaID: 2,
              Codigo: "USD",
              Nombre: "Dólares Americanos"
            },

            Estado: {
              EstadoID: 3,
              Codigo: "TRA",
              Descrip: "EN_TRANSITO"
            },

            OperadorLogistico: {
              OperadorID: 5,
              Nombre: "MAERSK LINE",
              Estado: true
            },

            Incoterm: {
              IncotermID: 3,
              Codigo: "CIF",
              Descrip: "Cost, Insurance and Freight",
              Estado: true
            },

            TipoEmbarqueObj: {
              TipoEmbarqueID: 1,
              Nombre: "MARITIMO",
              Estado: true
            },

            GrupoImportacion: {
              GImportacionID: 1,
              Anio: 2025,
              NCorrelativo: "IMP-2025-001",
              Descrip: "Equipos eléctricos industriales",
              NGuia: "GI-2025-001",
              PagoAduana: false,
              ETA: "2025-11-15T00:00:00.000Z",
              DescuentoAduana: false,
              ProveedorID: 1001
            },

            AlmacenControl: {
              AlmacenControlID: 1,
              CorrelativoOPCI: "OP-2025-0028",
              OCNumero: "OC-2025-001",
              ItemOC: "OC-001",
              ItemOP: "OP-001",
              CodCom: "COM-SE-001",
              ItemID: 101,
              Cantidad: 25,
              GrupoImport: "IMP-2025-001",
              AlmacenID: 1,
              StatusAlmacen1EstadoID: 2,
              StatusAlmacen2EstadoID: 1,
              Ib_ConfAlm: false,
              MotivoConfAlm: null,
              Ib_ConfSrv: true,
              MotivoConfSrv: null,
              FecRecep: "2025-11-20T08:30:00.000Z",
              FecMercaderiaRevisada: null,
              DistritoDespacho: "Lima",
              GuiaRemision: "GR-2025-0045",
              FecDespacho: null,
              ERP_Inta_Entrada: "ENT-2025-001",
              ERP_Inta_Salida: null,
              Nota1: "Verificar voltaje antes de instalación",
              Nota2: null,
              Nota3: null,
              FecCreacion: "2025-11-20T08:30:00.000Z",
              FecModific: "2025-11-20T08:30:00.000Z",
              OCDetalleID: 1,
              Almacen: {
                AlmacenID: 1,
                Codigo: "ALM-001",
                Nombre: "Almacén Principal Lima",
                Direccion: "Av. Industrial 1250, Lima",
                Estado: true,
                NCorto: "APL",
                Telefono: "+51-1-234-5678",
                Observ: "Almacén principal con capacidad para equipos industriales"
              }
            }
          },
          {
            OCDetalleID: 2,
            OCID: 1,
            ItemID: 102,
            ItemOC: "OC-002",
            ItemOP: "OP-002",
            Cantidad: 10,
            MdaID: 2,
            PrecioCompraUnitario1: 850.25,
            PrecioCompraUnitario2: 850.25,
            TipoCambioUSD: 3.75,
            TiempoEntregaSemanas: 8,
            NumCotizacionProveedor: "COT-SE-2025-0157",
            FecOfrecida: "2025-09-05T00:00:00.000Z",
            NumConfirmProveedor: "CONF-SE-790",
            FecProveedorInicial: "2025-09-12T00:00:00.000Z",
            FecProveedorAct1: "2025-09-15T00:00:00.000Z",
            FecProveedorAct2: null,
            FecProveedorAct3: null,
            FecProveedorAct4: null,
            OperadorLogisticoID: 5,
            FecInvoice: "2025-09-20T00:00:00.000Z",
            NumInvoice: "INV-SE-4523",
            NumItemInvoice: "ITM-002",
            PaisEmbarque: "Francia",
            CiudadEmbarque: "Le Havre",
            PaisOrigen: "Francia",
            NumDocTransporte: "MAEU-123456789",
            ETA: "2025-11-15T00:00:00.000Z",
            PesoBrutoKgs: 125.8,
            FleteUSD: 800.00,
            Nota1: "Verificar bobina 24VDC",
            Nota2: null,
            Nota3: null,
            Nota4: null,
            TipoEmbarque: "MARITIMO",
            IncotermID: 3,
            TipoEmbarqueID: 1,
            GImportacionID: 1,
            EstadoID: 3,

            Item: {
              ItemID: 102,
              TipoItem: "PRODUCTO",
              CodigoERP: "ERP-SE-002",
              CodCom: "COM-SE-002",
              Descrip: "Contactor 3P+1NA 25A 24VDC",
              ModeloTraduc: "LC1D25BD",
              DescripTraduc: "3P+1NO Contactor 25A 24VDC",
              MaterialTraduc: "Thermoplastic housing",
              UsoTraduc: "For motor control and switching applications",
              CodSunat: "85364900",
              FecCreacion: "2024-01-15T00:00:00.000Z",
              MarcaID: 15,
              Estado: true,
              UnidadMedidaID: 1,
              SSClaseID: 2,
              Marca: {
                MarcaID: 15,
                Ruc: "20100047218",
                Codigo: "SE",
                Nombre: "Schneider Electric",
                Descrip: "Schneider Electric Industrial Automation",
                NCorto: "SE"
              },
              UnidadMedida: {
                UnidadMedidaID: 1,
                Codigo: "UND",
                Descrip: "Unidad"
              }
            },

            Estado: {
              EstadoID: 3,
              Codigo: "TRA",
              Descrip: "EN_TRANSITO"
            },

            OperadorLogistico: {
              OperadorID: 5,
              Nombre: "MAERSK LINE",
              Estado: true
            },

            Incoterm: {
              IncotermID: 3,
              Codigo: "CIF",
              Descrip: "Cost, Insurance and Freight",
              Estado: true
            }
          }
        ],

        OrdenesPedido: [
          {
            OPCIID: 103,
            CorrelativoOPCI: "OP-2025-0028",
            FecRecepcion: "2025-08-25T14:30:00.000Z",
            FecInicio: "2025-08-26T09:00:00.000Z",
            FecProcesamiento: "2025-08-30T16:30:00.000Z",
            NumeroOP: "OP-MIN-2025-0028",
            MdaID: 1,
            MontoTotalSinIGV: 85650.00,
            NumReferClt: "REQ-MINERA-2025-045",
            FormaPagoID: 1,
            VdrPrincipalID: 5,
            VdrSecundarioID: null,
            LiderID: 2,
            UBrutaCoti: 1.25,
            Ib_ComisionCompartida: false,
            EstadoID: 4,
            ClienteID: 2001,
            CltProveedorID: 2001,
            CltFinalID: 2001,
            Cliente: {
              EmpresaID: 2001,
              RazonSocial: "MINERA YANACOCHA S.R.L.",
              TipoDocumento: "RUC",
              NumDoc: "20389230497",
              TipoCliente: "CLIENTE_FINAL",
              Industria: "Minería",
              Sector: "Extractivo",
              Pais: "Perú"
            },
            VendedorPrincipal: {
              UsuarioID: 5,
              Nombre: "Carlos",
              Apellido: "Rodriguez",
              EsLider: false
            },
            Lider: {
              UsuarioID: 2,
              Nombre: "Ana",
              Apellido: "Martinez",
              // EsLider: true
            }
          }
        ]
      };

      setOrdenCompra(mockData);
    } catch (error) {
      console.error("Error al cargar orden de compra:", error);
      setError('Error al cargar los detalles de la orden de compra');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      // Aquí enviarías la nota al backend
      console.log('Nueva nota:', noteText);
      setNoteText('');
      setDialogOpen(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearMoneda = (monto: number, moneda: string = 'USD') => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 2
    }).format(monto);
  };

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
      'PENDIENTE': 'warning',
      'APROBADO': 'success',
      'RECHAZADO': 'error',
      'EN_PROCESO': 'info',
      'EN_TRANSITO': 'primary',
      'COMPLETADO': 'success',
      'CANCELADO': 'error'
    };
    return colores[estado] || 'default';
  };

  const getEstadoIcon = (estado: string) => {
    const iconos: Record<string, React.ReactElement> = {
      'PENDIENTE': <ScheduleIcon />,
      'APROBADO': <CheckCircleIcon />,
      'RECHAZADO': <ErrorIcon />,
      'EN_PROCESO': <InfoIcon />,
      'EN_TRANSITO': <ShippingIcon />,
      'COMPLETADO': <CheckCircleIcon />,
      'CANCELADO': <ErrorIcon />
    };
    return iconos[estado] || <InfoIcon />;
  };

  const getTipoOCColor = (tipo: string) => {
    return tipo === 'NACIONAL' ? 'info' : 'secondary';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Skeleton variant="rectangular" width="100%" height={60} />
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="rectangular" width="100%" height={400} />
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={fetchOrdenCompraDetalle}>
            Reintentar
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!ordenCompra) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          No se encontraron datos para esta orden de compra.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} color="primary">
            Orden de Compra {ordenCompra.NumeroOC}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Creada el {formatearFecha(ordenCompra.FecCreacion)} •
            Última modificación: {formatearFecha(ordenCompra.FecModificacion)}
          </Typography>
        </Box>
        <Box>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Imprimir orden">
              <IconButton color="primary" size="large">
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Descargar PDF">
              <IconButton color="primary" size="large">
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => window.location.href = `/compras-editar/${ordenCompra.OCID}`}
              size="large"
            >
              Editar Orden
            </Button>
          </Stack>
        </Box>
      </Stack>

      {/* Información principal en card destacado */}
      <Card elevation={3} sx={{ mb: 3, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12., md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  fontSize: '2rem'
                }}>
                  {getEstadoIcon(ordenCompra.Estado?.Descrip || '')}
                </Avatar>
                <Chip
                  label={ordenCompra.Estado?.Descrip || 'Sin estado'}
                  color={getEstadoColor(ordenCompra.Estado?.Descrip || '')}

                  sx={{ mb: 2, fontWeight: 'bold', fontSize: '1rem' }}
                />
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                  {formatearMoneda(ordenCompra.MontoTotal || 0, ordenCompra.Moneda?.Codigo)}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Monto Total de la Orden
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 9 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3, sm: 6 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <FactoryIcon sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Tipo de Orden
                    </Typography>
                    <Chip
                      label={ordenCompra.TipoOC}
                      color={getTipoOCColor(ordenCompra.TipoOC)}
                      size="medium"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 3, sm: 6 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CalendarIcon sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Fecha de Orden
                    </Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {new Date(ordenCompra.FechaOC).toLocaleDateString('es-PE')}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 3, sm: 6 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <AccountBalanceIcon sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Forma de Pago
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {ordenCompra.FormaPago?.Categoria?.Nombre}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {ordenCompra.FormaPago?.Descrip}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 3, sm: 6 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <MoneyIcon sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Moneda
                    </Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {ordenCompra.Moneda?.Codigo}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {ordenCompra.Moneda?.Nombre}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs principales */}
      <Card elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.100' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="orden compra tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InventoryIcon fontSize="small" />
                  <span>Detalles de Items</span>
                  <Badge badgeContent={ordenCompra.Detalles?.length || 0} color="primary" />
                </Box>
              }
              id="tab-0"
              aria-controls="tabpanel-0"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon fontSize="small" />
                  <span>Proveedor</span>
                </Box>
              }
              id="tab-1"
              aria-controls="tabpanel-1"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShippingIcon fontSize="small" />
                  <span>Logística & Seguimiento</span>
                </Box>
              }
              id="tab-2"
              aria-controls="tabpanel-2"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentIcon fontSize="small" />
                  <span>Órdenes Relacionadas</span>
                  <Badge badgeContent={ordenCompra.OrdenesPedido?.length || 0} color="secondary" />
                </Box>
              }
              id="tab-3"
              aria-controls="tabpanel-3"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarehouseIcon fontSize="small" />
                  <span>Control de Almacén</span>
                </Box>
              }
              id="tab-4"
              aria-controls="tabpanel-4"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon fontSize="small" />
                  <span>Documentos</span>
                </Box>
              }
              id="tab-5"
              aria-controls="tabpanel-5"
            />
          </Tabs>
        </Box>

        {/* Tab Panel 0 - Detalles de Items */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Item / Código</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Precio Unit.</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>ETA</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordenCompra.Detalles?.map((detalle, index) => (
                  <TableRow key={detalle.OCDetalleID} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {detalle.Item?.CodCom || detalle.ItemOC}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ERP: {detalle.Item?.CodigoERP}
                        </Typography>
                        <br />
                        <Chip
                          label={detalle.Item?.Marca?.Nombre}
                          size="small"
                          color="info"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ maxWidth: 350 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {detalle.Item?.Descrip}
                        </Typography>
                        {detalle.Item?.ModeloTraduc && (
                          <Typography variant="caption" color="text.secondary">
                            Modelo: {detalle.Item.ModeloTraduc}
                          </Typography>
                        )}
                        {detalle.Item?.DescripTraduc && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            EN: {detalle.Item.DescripTraduc}
                          </Typography>
                        )}
                        {detalle.Item?.CodSunat && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            SUNAT: {detalle.Item.CodSunat}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        {detalle.Cantidad}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {detalle.Item?.UnidadMedida?.Codigo}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        {formatearMoneda(detalle.PrecioCompraUnitario1 || 0, ordenCompra.Moneda?.Codigo)}
                      </Typography>
                      {detalle.TipoCambioUSD && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          TC: {detalle.TipoCambioUSD.toFixed(3)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight="bold" color="success.main">
                        {formatearMoneda(
                          (detalle.Cantidad || 0) * (detalle.PrecioCompraUnitario1 || 0),
                          ordenCompra.Moneda?.Codigo
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={detalle.Estado?.Descrip || 'Sin estado'}
                        color={getEstadoColor(detalle.Estado?.Descrip || '')}
                        size="small"
                        icon={getEstadoIcon(detalle.Estado?.Descrip || '')}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {detalle.ETA ? (
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {new Date(detalle.ETA).toLocaleDateString('es-PE')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {detalle.TiempoEntregaSemanas} semanas
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No definida
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver detalles completos">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => setDialogOpen(true)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Fila de totales */}
                <TableRow sx={{ bgcolor: 'primary.50', '& td': { fontWeight: 'bold' } }}>
                  <TableCell colSpan={4} align="right">
                    <Typography variant="h6" fontWeight="bold">
                      TOTAL ORDEN:
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {formatearMoneda(ordenCompra.MontoTotal || 0, ordenCompra.Moneda?.Codigo)}
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab Panel 1 - Proveedor */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card variant="outlined" elevation={1}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                    <BusinessIcon />
                    Información del Proveedor
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                          <BusinessIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h5" fontWeight="bold" color="primary">
                            {ordenCompra.Proveedor?.RazonSocial}
                          </Typography>
                          <Chip
                            label={ordenCompra.Proveedor?.TipoCliente?.replace('_', ' ')}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <QrCodeIcon fontSize="small" />
                            Documento de Identidad
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {ordenCompra.Proveedor?.TipoDocumento}: {ordenCompra.Proveedor?.NumDoc}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FactoryIcon fontSize="small" />
                            Industria
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {ordenCompra.Proveedor?.Industria}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationIcon fontSize="small" />
                            Ubicación
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {ordenCompra.Proveedor?.Zona}, {ordenCompra.Proveedor?.Pais}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Sector
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {ordenCompra.Proveedor?.Sector}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarIcon fontSize="small" />
                            Cliente desde
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {new Date(ordenCompra.Proveedor?.FecCreacion || '').toLocaleDateString('es-PE')}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Estado
                          </Typography>
                          <Chip
                            label={ordenCompra.Proveedor?.Estado ? "Activo" : "Inactivo"}
                            color={ordenCompra.Proveedor?.Estado ? "success" : "error"}
                            size="small"
                          />
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={2}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Acciones Rápidas
                    </Typography>

                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <EmailIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Enviar Email"
                          secondary="Contactar al proveedor"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PhoneIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Contacto Telefónico"
                          secondary="Llamar al proveedor"
                        />
                      </ListItem>
                      <ListItem >
                        <ListItemIcon>
                          <VisibilityIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Ver Historial"
                          secondary="Órdenes anteriores"
                        />
                      </ListItem>
                      <ListItem >
                        <ListItemIcon>
                          <AssignmentIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Evaluar Proveedor"
                          secondary="Calificación y métricas"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={2} >
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card variant="outlined" elevation={1}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                    <ShippingIcon />
                    Timeline de la Orden
                  </Typography>

                  <Timeline>
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot color="success">
                          <CheckCircleIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Card variant="outlined" sx={{ p: 2, mb: 1 }}>
                          <Typography variant="h6" component="span" color="primary">
                            Orden Creada
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            {formatearFecha(ordenCompra.FecCreacion)}
                          </Typography>
                          <Typography variant="body2">
                            Orden de compra generada y enviada al proveedor
                          </Typography>
                        </Card>
                      </TimelineContent>
                    </TimelineItem>

                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot color="success">
                          <CheckCircleIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Card variant="outlined" sx={{ p: 2, mb: 1 }}>
                          <Typography variant="h6" component="span" color="primary">
                            Orden Confirmada
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            {formatearFecha(ordenCompra.FecModificacion)}
                          </Typography>
                          <Typography variant="body2">
                            Confirmación recibida: {ordenCompra.Detalles?.[0]?.NumConfirmProveedor}
                          </Typography>
                        </Card>
                      </TimelineContent>
                    </TimelineItem>

                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot color="info">
                          <ShippingIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Card variant="outlined" sx={{ p: 2, mb: 1, bgcolor: 'info.50' }}>
                          <Typography variant="h6" component="span" color="info.main">
                            En Tránsito
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            Actual
                          </Typography>
                          <Typography variant="body2">
                            Embarque desde {ordenCompra.Detalles?.[0]?.CiudadEmbarque}, {ordenCompra.Detalles?.[0]?.PaisEmbarque}
                          </Typography>
                          <Typography variant="body2" color="info.main" fontWeight="medium">
                            Operador: {ordenCompra.Detalles?.[0]?.OperadorLogistico?.Nombre}
                          </Typography>
                          <Typography variant="body2">
                            Documento transporte: {ordenCompra.Detalles?.[0]?.NumDocTransporte}
                          </Typography>
                        </Card>
                      </TimelineContent>
                    </TimelineItem>

                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot color="warning">
                          <ScheduleIcon />
                        </TimelineDot>
                      </TimelineSeparator>
                      <TimelineContent>
                        <Card variant="outlined" sx={{ p: 2, bgcolor: 'warning.50' }}>
                          <Typography variant="h6" component="span" color="warning.main">
                            Llegada Estimada
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            {ordenCompra.Detalles?.[0]?.ETA ?
                              new Date(ordenCompra.Detalles[0].ETA).toLocaleDateString('es-PE') :
                              'No definida'
                            }
                          </Typography>
                          <Typography variant="body2">
                            Llegada esperada al puerto del Callao
                          </Typography>
                        </Card>
                      </TimelineContent>
                    </TimelineItem>
                  </Timeline>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={2}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                      <AnchorIcon />
                      Información de Embarque
                    </Typography>

                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ShippingIcon fontSize="small" />
                          Tipo de Embarque
                        </Typography>
                        <Chip
                          label={ordenCompra.Detalles?.[0]?.TipoEmbarqueObj?.Nombre || ordenCompra.Detalles?.[0]?.TipoEmbarque}
                          color="info"
                          size="small"
                          icon={<ShippingIcon />}
                        />
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Incoterm
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {ordenCompra.Detalles?.[0]?.Incoterm?.Codigo} - {ordenCompra.Detalles?.[0]?.Incoterm?.Descrip}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ScaleIcon fontSize="small" />
                          Peso Total
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {ordenCompra.Detalles?.reduce((total, det) => total + (det.PesoBrutoKgs || 0), 0).toFixed(2)} kg
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <MoneyIcon fontSize="small" />
                          Costo de Flete
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="success.main">
                          {formatearMoneda(
                            ordenCompra.Detalles?.reduce((total, det) => total + (det.FleteUSD || 0), 0) || 0,
                            'USD'
                          )}
                        </Typography>
                      </Box>

                      <Divider />

                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PublicIcon fontSize="small" />
                          Puerto de Origen
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {ordenCompra.Detalles?.[0]?.CiudadEmbarque}, {ordenCompra.Detalles?.[0]?.PaisEmbarque}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          País de Origen
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {ordenCompra.Detalles?.[0]?.PaisOrigen}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                      <FlightIcon />
                      Grupo de Importación
                    </Typography>

                    {ordenCompra.Detalles?.[0]?.GrupoImportacion && (
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Correlativo
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {ordenCompra.Detalles[0].GrupoImportacion.NCorrelativo}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Descripción
                          </Typography>
                          <Typography variant="body1">
                            {ordenCompra.Detalles[0].GrupoImportacion.Descrip}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Guía
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {ordenCompra.Detalles[0].GrupoImportacion.NGuia}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={ordenCompra.Detalles[0].GrupoImportacion.PagoAduana ? "Aduana Pagada" : "Pendiente Aduana"}
                            color={ordenCompra.Detalles[0].GrupoImportacion.PagoAduana ? "success" : "warning"}
                            size="small"
                          />
                          <Chip
                            label={ordenCompra.Detalles[0].GrupoImportacion.DescuentoAduana ? "Con Descuento" : "Sin Descuento"}
                            color={ordenCompra.Detalles[0].GrupoImportacion.DescuentoAduana ? "info" : "default"}
                            size="small"
                          />
                        </Box>
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab Panel 3 - Órdenes Relacionadas */}
        <TabPanel value={tabValue} index={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                <AssignmentIcon />
                Órdenes de Pedido Relacionadas
              </Typography>

              {ordenCompra.OrdenesPedido && ordenCompra.OrdenesPedido.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.100' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Correlativo</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha Recepción</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Referencia Cliente</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Vendedor</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Monto Sin IGV</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ordenCompra.OrdenesPedido.map((orden) => (
                        <TableRow key={orden.OPCIID} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {orden.CorrelativoOPCI}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              OP: {orden.NumeroOP || 'No asignado'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {orden.Cliente?.RazonSocial}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {orden.Cliente?.TipoDocumento}: {orden.Cliente?.NumDoc}
                              </Typography>
                              <br />
                              <Typography variant="caption" color="text.secondary">
                                {orden.Cliente?.Industria} • {orden.Cliente?.Pais}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(orden.FecRecepcion).toLocaleDateString('es-PE')}
                            </Typography>
                            {orden.FecInicio && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                Inicio: {new Date(orden.FecInicio).toLocaleDateString('es-PE')}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {orden.NumReferClt || 'No definida'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {orden.VendedorPrincipal && (
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {orden.VendedorPrincipal.Nombre} {orden.VendedorPrincipal.Apellido}
                                </Typography>
                                {orden.Lider && (
                                  <Typography variant="caption" color="text.secondary">
                                    Líder: {orden.Lider.Nombre} {orden.Lider.Apellido}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body1" fontWeight="bold" color="success.main">
                              {formatearMoneda(orden.MontoTotalSinIGV || 0, 'PEN')}
                            </Typography>
                            {orden.UBrutaCoti && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                U.Bruta: {orden.UBrutaCoti.toFixed(2)}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label="Procesando"
                              color="info"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Ver orden de pedido completa">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => window.location.href = `/pedidos/${orden.OPCIID}`}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    No hay órdenes de pedido relacionadas con esta orden de compra.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        {/* Tab Panel 4 - Control de Almacén */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                    <WarehouseIcon />
                    Control de Almacén por Item
                  </Typography>

                  {ordenCompra.Detalles?.map((detalle, index) => (
                    detalle.AlmacenControl && (
                      <Card key={detalle.OCDetalleID} variant="outlined" sx={{ mb: 2, bgcolor: 'grey.50' }}>
                        <CardContent>
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, md: 6 }}>
                              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                {detalle.Item?.CodCom} - {detalle.Item?.Descrip}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Cantidad: {detalle.AlmacenControl.Cantidad} {detalle.Item?.UnidadMedida?.Codigo}
                              </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Chip
                                  label={detalle.AlmacenControl.Ib_ConfAlm ? "Almacén Confirmado" : "Pendiente Almacén"}
                                  color={detalle.AlmacenControl.Ib_ConfAlm ? "success" : "warning"}
                                  size="small"
                                  icon={detalle.AlmacenControl.Ib_ConfAlm ? <CheckCircleIcon /> : <ScheduleIcon />}
                                />
                                <Chip
                                  label={detalle.AlmacenControl.Ib_ConfSrv ? "Servicio Confirmado" : "Pendiente Servicio"}
                                  color={detalle.AlmacenControl.Ib_ConfSrv ? "success" : "warning"}
                                  size="small"
                                  icon={detalle.AlmacenControl.Ib_ConfSrv ? <CheckCircleIcon /> : <ScheduleIcon />}
                                />
                              </Stack>
                            </Grid>
                          </Grid>

                          <Divider sx={{ my: 2 }} />

                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 3, sm: 6 }}>
                              <Typography variant="caption" color="text.secondary">
                                Almacén Destino
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {detalle.AlmacenControl.Almacen?.Nombre}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {detalle.AlmacenControl.Almacen?.Codigo}
                              </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, md: 3, sm: 6 }}>
                              <Typography variant="caption" color="text.secondary">
                                Fecha Recepción
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {detalle.AlmacenControl.FecRecep ?
                                  new Date(detalle.AlmacenControl.FecRecep).toLocaleDateString('es-PE') :
                                  'Pendiente'
                                }
                              </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, md: 3, sm: 6 }}>
                              <Typography variant="caption" color="text.secondary">
                                Guía de Remisión
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {detalle.AlmacenControl.GuiaRemision || 'No asignada'}
                              </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, md: 3, sm: 6 }}>
                              <Typography variant="caption" color="text.secondary">
                                Distrito Despacho
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {detalle.AlmacenControl.DistritoDespacho || 'No definido'}
                              </Typography>
                            </Grid>
                          </Grid>

                          {detalle.AlmacenControl.Nota1 && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <InfoIcon fontSize="small" />
                                Nota del Almacén:
                              </Typography>
                              <Typography variant="body2">
                                {detalle.AlmacenControl.Nota1}
                              </Typography>
                            </Box>
                          )}

                          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button size="small" startIcon={<EditIcon />}>
                              Actualizar Estado
                            </Button>
                            <Button size="small" startIcon={<DescriptionIcon />}>
                              Ver Documento
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    )
                  )) || (
                      <Alert severity="info">
                        No hay información de control de almacén disponible para esta orden.
                      </Alert>
                    )}
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={2}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                      Resumen de Almacén
                    </Typography>

                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Items Recibidos
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={60}
                          sx={{ my: 1 }}
                          color="success"
                        />
                        <Typography variant="caption" color="text.secondary">
                          1 de 2 items recibidos (60%)
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Confirmaciones Pendientes
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="warning.main">
                          1 almacén
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Servicios Confirmados
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="success.main">
                          2 de 2
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>
                      Almacenes Involucrados
                    </Typography>

                    {ordenCompra.Detalles?.filter(d => d.AlmacenControl?.Almacen).map((detalle, idx) => (
                      <Box key={idx} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {detalle.AlmacenControl?.Almacen?.Nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {detalle.AlmacenControl?.Almacen?.Direccion}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          Tel: {detalle.AlmacenControl?.Almacen?.Telefono}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                      Acciones Rápidas
                    </Typography>

                    <Stack spacing={1}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        color="success"
                      >
                        Confirmar Recepción
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<DescriptionIcon />}
                      >
                        Generar Guía
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<EditIcon />}
                      >
                        Actualizar Estados
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab Panel 5 - Documentos - CORREGIDO */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3} sx={{ p: 1 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                    <DescriptionIcon />
                    Documentos de la Orden
                  </Typography>

                  <TableContainer component={Paper} elevation={0}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                          <TableCell sx={{ fontWeight: 'bold' }}>Tipo de Documento</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Número/Referencia</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Orden de Compra */}
                        <TableRow hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PdfIcon color="error" />
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  Orden de Compra
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Documento principal
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {ordenCompra.NumeroOC}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(ordenCompra.FechaOC).toLocaleDateString('es-PE')}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip label="Disponible" color="success" size="small" />
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title="Descargar">
                                <IconButton size="small" color="primary">
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Ver">
                                <IconButton size="small" color="info">
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>

                        {/* Cotización del Proveedor */}
                        <TableRow hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DescriptionIcon color="info" />
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  Cotización Proveedor
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Cotización original
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {ordenCompra.Detalles?.[0]?.NumCotizacionProveedor || 'No disponible'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {ordenCompra.Detalles?.[0]?.FecOfrecida ?
                                new Date(ordenCompra.Detalles[0].FecOfrecida).toLocaleDateString('es-PE') :
                                'No definida'
                              }
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={ordenCompra.Detalles?.[0]?.NumCotizacionProveedor ? "Disponible" : "Pendiente"}
                              color={ordenCompra.Detalles?.[0]?.NumCotizacionProveedor ? "success" : "warning"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              {ordenCompra.Detalles?.[0]?.NumCotizacionProveedor ? (
                                <>
                                  <Tooltip title="Descargar">
                                    <IconButton size="small" color="primary">
                                      <DownloadIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Ver">
                                    <IconButton size="small" color="info">
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : (
                                <Tooltip title="Subir documento">
                                  <IconButton size="small" color="secondary">
                                    <UploadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>

                        {/* Factura del Proveedor */}
                        <TableRow hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AttachmentIcon color="success" />
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  Factura Proveedor
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Invoice comercial
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {ordenCompra.Detalles?.[0]?.NumInvoice || 'No disponible'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {ordenCompra.Detalles?.[0]?.FecInvoice ?
                                new Date(ordenCompra.Detalles[0].FecInvoice).toLocaleDateString('es-PE') :
                                'No definida'
                              }
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={ordenCompra.Detalles?.[0]?.NumInvoice ? "Disponible" : "Pendiente"}
                              color={ordenCompra.Detalles?.[0]?.NumInvoice ? "success" : "warning"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              {ordenCompra.Detalles?.[0]?.NumInvoice ? (
                                <>
                                  <Tooltip title="Descargar">
                                    <IconButton size="small" color="primary">
                                      <DownloadIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Ver">
                                    <IconButton size="small" color="info">
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : (
                                <Tooltip title="Subir documento">
                                  <IconButton size="small" color="secondary">
                                    <UploadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>

                        {/* Documento de Transporte */}
                        <TableRow hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <ShippingIcon color="primary" />
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  Documento Transporte
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  B/L o guía aérea
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {ordenCompra.Detalles?.[0]?.NumDocTransporte || 'No disponible'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              Variable según embarque
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={ordenCompra.Detalles?.[0]?.NumDocTransporte ? "Disponible" : "Pendiente"}
                              color={ordenCompra.Detalles?.[0]?.NumDocTransporte ? "success" : "warning"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              {ordenCompra.Detalles?.[0]?.NumDocTransporte ? (
                                <>
                                  <Tooltip title="Descargar">
                                    <IconButton size="small" color="primary">
                                      <DownloadIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Ver">
                                    <IconButton size="small" color="info">
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : (
                                <Tooltip title="Subir documento">
                                  <IconButton size="small" color="secondary">
                                    <UploadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>

                        {/* Guía de Remisión */}
                        <TableRow hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <FileDownloadIcon color="warning" />
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  Guía de Remisión
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Documento de despacho
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {ordenCompra.Detalles?.[0]?.AlmacenControl?.GuiaRemision || 'No generada'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {ordenCompra.Detalles?.[0]?.AlmacenControl?.FecDespacho ?
                                new Date(ordenCompra.Detalles[0].AlmacenControl.FecDespacho).toLocaleDateString('es-PE') :
                                'Pendiente'
                              }
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={ordenCompra.Detalles?.[0]?.AlmacenControl?.GuiaRemision ? "Disponible" : "Pendiente"}
                              color={ordenCompra.Detalles?.[0]?.AlmacenControl?.GuiaRemision ? "success" : "warning"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              {ordenCompra.Detalles?.[0]?.AlmacenControl?.GuiaRemision ? (
                                <>
                                  <Tooltip title="Descargar">
                                    <IconButton size="small" color="primary">
                                      <DownloadIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Ver">
                                    <IconButton size="small" color="info">
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : (
                                <Button size="small" variant="contained" color="primary" startIcon={<DescriptionIcon />}>
                                  Generar
                                </Button>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>

                        {/* Confirmación del Proveedor */}
                        <TableRow hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckCircleIcon color="success" />
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  Confirmación Proveedor
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Documento de confirmación
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {ordenCompra.Detalles?.[0]?.NumConfirmProveedor || 'No disponible'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {ordenCompra.Detalles?.[0]?.FecProveedorInicial ?
                                new Date(ordenCompra.Detalles[0].FecProveedorInicial).toLocaleDateString('es-PE') :
                                'No definida'
                              }
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={ordenCompra.Detalles?.[0]?.NumConfirmProveedor ? "Disponible" : "Pendiente"}
                              color={ordenCompra.Detalles?.[0]?.NumConfirmProveedor ? "success" : "warning"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              {ordenCompra.Detalles?.[0]?.NumConfirmProveedor ? (
                                <>
                                  <Tooltip title="Descargar">
                                    <IconButton size="small" color="primary">
                                      <DownloadIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Ver">
                                    <IconButton size="small" color="info">
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : (
                                <Tooltip title="Solicitar confirmación">
                                  <IconButton size="small" color="secondary">
                                    <EmailIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<UploadIcon />}
                      color="primary"
                    >
                      Subir Documento
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<DescriptionIcon />}
                    >
                      Generar Reporte
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<EmailIcon />}
                    >
                      Enviar por Email
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      color="success"
                    >
                      Descargar Todo (ZIP)
                    </Button>
                  </Box>

                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={2}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                      Notas y Observaciones
                    </Typography>

                    <Stack spacing={2}>
                      {ordenCompra.Detalles?.map((detalle, index) => (
                        <Box key={detalle.OCDetalleID}>
                          {detalle.Nota1 && (
                            <Box sx={{ mb: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <InfoIcon fontSize="small" />
                                Nota Item {index + 1}:
                              </Typography>
                              <Typography variant="body2">
                                {detalle.Nota1}
                              </Typography>
                            </Box>
                          )}
                          {detalle.Nota2 && (
                            <Box sx={{ mb: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <WarningIcon fontSize="small" />
                                Nota Adicional:
                              </Typography>
                              <Typography variant="body2">
                                {detalle.Nota2}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )) || (
                          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                            No hay notas registradas para esta orden
                          </Typography>
                        )}

                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<DescriptionIcon />}
                        onClick={() => setDialogOpen(true)}
                      >
                        Agregar Nota
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                      Estado de Documentos
                    </Typography>

                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">
                          Orden de Compra
                        </Typography>
                        <Chip label="Disponible" color="success" size="small" />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">
                          Factura Proveedor
                        </Typography>
                        <Chip
                          label={ordenCompra.Detalles?.[0]?.NumInvoice ? "Disponible" : "Pendiente"}
                          color={ordenCompra.Detalles?.[0]?.NumInvoice ? "success" : "warning"}
                          size="small"
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">
                          Guía de Remisión
                        </Typography>
                        <Chip
                          label={ordenCompra.Detalles?.[0]?.AlmacenControl?.GuiaRemision ? "Disponible" : "Pendiente"}
                          color={ordenCompra.Detalles?.[0]?.AlmacenControl?.GuiaRemision ? "success" : "warning"}
                          size="small"
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">
                          Documento Transporte
                        </Typography>
                        <Chip
                          label={ordenCompra.Detalles?.[0]?.NumDocTransporte ? "Disponible" : "Pendiente"}
                          color={ordenCompra.Detalles?.[0]?.NumDocTransporte ? "success" : "warning"}
                          size="small"
                        />
                      </Box>

                      <Divider />

                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Progreso General de Documentos
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={67}
                          sx={{ mt: 1, mb: 1 }}
                          color="info"
                        />
                        <Typography variant="caption" color="text.secondary">
                          4 de 6 documentos disponibles (67%)
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                      Historial de Versiones
                    </Typography>

                    <Stack spacing={1}>
                      <Box sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1, fontSize: '0.875rem' }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date().toLocaleDateString('es-PE')} • Usuario: Admin
                        </Typography>
                        <Typography variant="body2" fontSize="0.8rem">
                          Orden de compra actualizada con nueva fecha de entrega
                        </Typography>
                      </Box>

                      <Box sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1, fontSize: '0.875rem' }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatearFecha(ordenCompra.FecModificacion)} • Sistema
                        </Typography>
                        <Typography variant="body2" fontSize="0.8rem">
                          Confirmación del proveedor recibida automáticamente
                        </Typography>
                      </Box>

                      <Box sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1, fontSize: '0.875rem' }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatearFecha(ordenCompra.FecCreacion)} • Carlos R.
                        </Typography>
                        <Typography variant="body2" fontSize="0.8rem">
                          Orden de compra creada y enviada al proveedor
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Dialog para agregar notas */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionIcon color="primary" />
          Agregar Nota a la Orden
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Agregue una nota o comentario adicional a la orden de compra {ordenCompra.NumeroOC}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Nota o Comentario"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Escriba su nota aquí..."
            helperText="Esta nota será visible para todos los usuarios con acceso a la orden"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleAddNote}
            variant="contained"
            disabled={!noteText.trim()}
            startIcon={<DescriptionIcon />}
          >
            Guardar Nota
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdenCompraDetalle;