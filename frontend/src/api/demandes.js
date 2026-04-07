import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const fetchDemandes = () => axios.get(`${API}/demandes`);
export const createDemande = (payload) => axios.post(`${API}/demandes`, payload);
export const updateDemande = (id, payload) => axios.put(`${API}/demandes/${id}`, payload);
export const deleteDemande = (id) => axios.delete(`${API}/demandes/${id}`);
export const sendDemande = (id, serviceId) => axios.post(`${API}/demandes/${id}/send`, { service_id: serviceId });
export const respondToDemande = (id, payload) => axios.post(`${API}/demandes/${id}/respond`, payload);
export const fetchWorkflowServices = () => axios.get(`${API}/workflow/services`);
