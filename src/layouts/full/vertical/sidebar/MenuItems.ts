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
    href: '/vendor-list'
  },
  {
    id: uniqueId(),
    title: 'Clientes',
    icon: "box-minimalistic-bold-duotone",
    href: '/customer-list'
  },
  {
    id: uniqueId(),
    title: 'Productos',
    icon: "box-minimalistic-bold-duotone",
    href: '/product-list'
  },
 
  {
    id: uniqueId(),
    title: 'Servicios',
    icon: "box-minimalistic-bold-duotone",
    href: '/services-list'
  },
  {
    id: uniqueId(),
    title: 'Proyectos',
    icon: "box-minimalistic-bold-duotone",
    href: '/projects-list'
  },
];

export default Menuitems;
