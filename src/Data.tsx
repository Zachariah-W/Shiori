import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
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
    <div className="w-layout mb-2 flex h-full min-h-52 flex-col items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-100 px-6 dark:border-neutral-700/50 dark:bg-neutral-800/50">
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
          <div className="w-layout flex h-80 flex-row items-center justify-between px-10">
            <div className="h-64 w-72 rounded-xl border-2 border-neutral-700 bg-graph p-2">
              <h2 className="py-3 text-center text-2xl font-bold">
                Top Countries
              </h2>
              <ol className="text-lg font-semibold">
                {topVists.slice(0, 5).map((data, index) => (
                  <li key={index}>
                    {data[0]}: {data[1]} times
                  </li>
                ))}
              </ol>
            </div>
            <div className="h-64 w-72 rounded-xl border-2 border-neutral-700 bg-graph p-2">
              <h2 className="py-3 text-center text-2xl font-bold">
                Advanced Stats
              </h2>
              <ul className="text-lg font-semibold">
                <li># of Countries Traveled: {countryVistNum.size}</li>
              </ul>
            </div>
          </div>

          <div className="w-layout h-fit rounded-lg px-10">
            <ChartContainer
              config={chartConfig}
              className="rounded-lg border-2 border-neutral-700"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transformedData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="Country"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="VisitCount" fill="#ff5722" radius={15} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Data;
