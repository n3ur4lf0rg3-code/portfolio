import { useEffect, useState } from "react";
import { getStats } from "./dashboard.service";
import { listenDashboard } from "./dashboard.socket";
import RevenueChart from "./RevenueChart";

<RevenueChart />

export default function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0 });

  useEffect(() => {
    const load = async () => {
      const data = await getStats();
      setStats(data);
    };

    load();

    listenDashboard((order) => {
      setStats((prev) => ({
        orders: prev.orders + 1,
        revenue: prev.revenue + order.total,
      }));
    });

  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      <div>
        <h3>Total Orders: {stats.orders}</h3>
        <h3>Total Revenue: ${stats.revenue}</h3>
      </div>
    </div>
  );
}
