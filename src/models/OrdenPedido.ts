export interface OrdenPedido {
  IdOpci: number;
  IdFp?: number;
  IdClt?: number;
  IdVdr?: number;
  IdOpd?: number;
  FecRecep?: string;
  FecInicio?: string;
  FecProcVi?: string;
  RSocialClt?: string;
  NumOp?: string;
  IdMda?: number;
  TotalSinIgv?: number;
  NumRefCliente?: string;
  IbCltFin?: string;
  IbCltPrv?: string;
  IbVdr1?: string;
  IbVdr2?: string;
  IbLider?: string;
  UbrutaCoti?: string;
  ComisionCompartida?: boolean;
  Estado?: boolean;
  FormaPago?: any;
  Cliente?: any;
  Vendedor?: any;
  Moneda?: any;
  OrdenPedidoDetalles?: any[];
}