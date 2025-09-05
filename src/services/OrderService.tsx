import { OrdenPedido } from "src/models/OrdenPedido";
import API from ".";

export const getOrdenesPedido = () => API.get<OrdenPedido[]>('/OrdenPedido');
export const getOrdenPedidoById = (id: number) => API.get(`/OrdenPedido/${id}`);
export const createOrdenPedido = (orden: any) => API.post('/OrdenPedido', orden);
export const updateOrdenPedido = (id: number, orden: any) => API.put(`/OrdenPedido/${id}`, orden);
export const deleteOrdenPedido = (id: number) => API.delete(`/OrdenPedido/${id}`);
