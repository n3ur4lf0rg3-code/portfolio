import { api } from "../../core/api";

export const getRevenueChart = async () => {
  return await api("/dashboard/revenue");
};
