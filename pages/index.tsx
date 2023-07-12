import { useEffect, useState } from "react";
import { CURRENCIES, DEFAULT_REFRESH_INTERVAL } from "@/utils/consts";
import RateCard from "@/components/RateCard";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rateInfo, setRateInfo] = useState<Record<string, any>>({});
  const [refreshInterval, setRefreshInterval] = useState<number>(
    DEFAULT_REFRESH_INTERVAL
  );
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setIsLoading(true);
    const response = await fetch(
      "https://api.coindesk.com/v1/bpi/currentprice.json"
    );
    const json = await response.json();
    setRateInfo(json.bpi);
    setIsLoading(false);
  };
  return (
    <div className="container mx-auto px-5">
      <h1 className="text-2xl font-bold lg:mt-12 mt-6 mb-8">
        Bitcoin Price Index
      </h1>

      <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-12 gap-2">
        {CURRENCIES.map(
          (currency) =>
            !!rateInfo[currency] && (
              <RateCard
                title="USD"
                total={rateInfo[currency].rate}
                isLoading={isLoading}
              />
            )
        )}
      </div>
    </div>
  );
}
