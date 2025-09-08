import { uniqueId } from 'lodash';

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}

const Menuitems: MenuitemsType[] = [
  {
    navlabel: true,
    subheader: 'Personal',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: 'layers-minimalistic-line-duotone',
    href: '/',
  },
  {
    navlabel: true,
    subheader: 'Utilidades',
  },
  {
    id: uniqueId(),
    title: 'Pedidos',
    icon: "box-minimalistic-bold-duotone",
    href: '/order-create',
    children: [
      {
        id: uniqueId(),
        title: 'Crear registro',
        icon: 'stop-circle-line-duotone',
        href: '/order-create',
      },
      {
        id: uniqueId(),
        title: 'Buscar registro',
        icon: 'stop-circle-line-duotone',
        href: '/order-list',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Compras',
    icon: "box-minimalistic-bold-duotone",
    href: '/order-create',
    children: [
      {
        id: uniqueId(),
        title: 'Crear registro',
        icon: 'stop-circle-line-duotone',
        href: '/order-create',
      },
      {
        id: uniqueId(),
        title: 'Buscar registro',
        icon: 'stop-circle-line-duotone',
        href: '/order-list',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Vendedores',
    icon: "box-minimalistic-bold-duotone",
    href: '/order-create',
    children: [
      {
        id: uniqueId(),
        title: 'Crear registro',
        icon: 'stop-circle-line-duotone',
        href: '/vendor-create',
      },
      {
        id: uniqueId(),
        title: 'Buscar registro',
        icon: 'stop-circle-line-duotone',
        href: '/vendor-list',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Clientes',
    icon: "box-minimalistic-bold-duotone",
    href: '/customer-create',
    children: [
      {
        id: uniqueId(),
        title: 'Crear',
        icon: 'stop-circle-line-duotone',
        href: '/customer-create',
      },
      {
        id: uniqueId(),
        title: 'Buscar',
        icon: 'stop-circle-line-duotone',
        href: '/customer-list',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Productos',
    icon: "box-minimalistic-bold-duotone",
    href: '/product-create',
    children: [
      {
        id: uniqueId(),
        title: 'Registrar',
        icon: 'stop-circle-line-duotone',
        href: '/product-create',
      },
      {
        id: uniqueId(),
        title: 'Buscar',
        icon: 'stop-circle-line-duotone',
        href: '/product-list',
      },
    ],
  },
 
  {
    id: uniqueId(),
    title: 'Servicios',
    icon: "box-minimalistic-bold-duotone",
    href: '/service-create',
    children: [
      {
        id: uniqueId(),
        title: 'Crear',
        icon: 'stop-circle-line-duotone',
        href: '/service-create',
      },
      {
        id: uniqueId(),
        title: 'Buscar',
        icon: 'stop-circle-line-duotone',
        href: '/service-list',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Proyectos',
    icon: "box-minimalistic-bold-duotone",
    href: '/order-create',
    children: [
      {
        id: uniqueId(),
        title: 'Crear',
        icon: 'stop-circle-line-duotone',
        href: '/order-create',
      },
      {
        id: uniqueId(),
        title: 'Buscar',
        icon: 'stop-circle-line-duotone',
        href: '/order-list',
      },
    ],
  },
];

export default Menuitems;
