import { api } from "../../core/api";

export const getProducts = async () => {
  try {
    return await api("/products");
  } catch (err) {
    throw new Error(err.message);
  }
};
