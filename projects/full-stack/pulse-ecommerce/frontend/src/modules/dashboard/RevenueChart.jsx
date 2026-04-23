import { useEffect, useState } from "react";
import { getRevenueChart } from "./chart.service";
import { listenChart } from "./chart.socket";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function RevenueChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await getRevenueChart();

      const formatted = res.map((d) => ({
        date: d.date,
        revenue: parseFloat(d.revenue),
      }));

      setData(formatted);
    };

    load();

    listenChart((update) => {
      const day = update.date.split("T")[0];

      setData((prev) => {
        const exists = prev.find((d) => d.date === day);

        if (exists) {
          return prev.map((d) =>
            d.date === day
              ? { ...d, revenue: d.revenue + update.total }
              : d
          );
        }

        return [...prev, { date: day, revenue: update.total }];
      });
    });

  }, []);

  return (
    <div>
      <h3>Revenue Over Time</h3>

      <LineChart width={500} height={300} data={data}>
        <CartesianGrid />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" />
      </LineChart>
    </div>
  );
}
