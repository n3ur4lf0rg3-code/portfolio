import { api } from "../../core/api";

export const getStats = async () => {
  return await api("/dashboard");
};
