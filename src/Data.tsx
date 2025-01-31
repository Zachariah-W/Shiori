import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const Data = () => {
  const [countryVistNum, setCountryVistNum] = useState<Map<string, number>>(
    new Map(),
  );
  const [topVists, setTopVisits] = useState<[string, number][]>([]);
  const [chartConfig, setChartConfig] = useState({});
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    const tripsRef = collection(
      db,
      "users",
      `${auth.currentUser?.uid}`,
      "trips",
    );
    const tripsSnap = await getDocs(tripsRef);
    const tempVistNumMap: Map<string, number> = new Map();

    if (!tripsSnap.empty) {
      tripsSnap.forEach((trip) => {
        const country = trip.data().country;
        tempVistNumMap.set(country, (tempVistNumMap.get(country) || 0) + 1);
      });

      setCountryVistNum(tempVistNumMap);
      const tempTopVistMap = Array.from(tempVistNumMap.entries()).sort(
        (a, b) => b[1] - a[1],
      );
      setTopVisits(tempTopVistMap);

      const tempChartConfig = {
        visitNum: {
          label: "Visited #",
          color: "#ff5722",
        },
      } satisfies ChartConfig;
      setChartConfig(tempChartConfig);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const transformedData = Array.from(countryVistNum.entries()).map(
    ([country, count]) => ({
      Country: country,
      VisitCount: count,
    }),
  );

  return (
    <div className="w-layout">
      {loading ? (
        <h2 className="text-center text-lg font-medium text-neutral-500">
          Loading trips...
        </h2>
      ) : countryVistNum.size === 0 ? (
        <h2 className="text-center text-lg font-medium text-neutral-500">
          No trips yet
        </h2>
      ) : (
        <>
          <div className="w-layout grid grid-cols-3 gap-4">
            <section className="col-span-2">
              <h2 className="p-4">Trip Statistics</h2>
              <div className="h-fit w-full overflow-clip rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <ChartContainer config={chartConfig} className="min-h-10">
                  <ResponsiveContainer>
                    <BarChart
                      data={transformedData}
                      layout="vertical"
                      className="-mr-12"
                    >
                      <CartesianGrid horizontal={false} />
                      <YAxis
                        dataKey="Country"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="VisitCount" fill="#ff5722" radius={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </section>
            <section>
              <h2 className="p-4">Top Countries</h2>
              <ol className="list-inside list-decimal px-4">
                {topVists.slice(0, 5).map(([countryName, count], index) => (
                  <li key={index}>
                    {countryName}: {count} times
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default Data;
