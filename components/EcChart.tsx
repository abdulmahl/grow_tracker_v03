"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface EcReading {
  timestamp: string;
  ec: number;
  ph: number;
}

export default function EcChart({ readings }: { readings: EcReading[] }) {
  const data = {
    labels: readings.map((r) => new Date(r.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: "EC (µS/cm)",
        data: readings.map((r) => r.ec),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        yAxisID: "y-ec",
      },
      {
        label: "pH Level",
        data: readings.map((r) => r.ph),
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.2)",
        yAxisID: "y-ph",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      "y-ec": {
        type: "linear" as const,
        position: "left" as const,
        title: { display: true, text: "EC (µS/cm)" },
      },
      "y-ph": {
        type: "linear" as const,
        position: "right" as const,
        title: { display: true, text: "pH" },
      },
    },
  };

  return <Line data={data} options={options} />;
}
