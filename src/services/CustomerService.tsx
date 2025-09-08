import { Customer } from "src/models/Customer";
import API from ".";

export const getCustomers = () => API.get('/Cliente');
export const addCustomers = (customer: Customer) => API.post('/Cliente',customer);