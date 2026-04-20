import { api } from "../../core/api";

export const getProducts = async () => {
  return await api("/products");
};

export const createProduct = async (product) => {
  return await api("/products", "POST", product);
};
