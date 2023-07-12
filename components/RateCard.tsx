import React from "react";
import Spinner from "./Spinner";

interface RateCardProp {
  total: number;
  title: string;
  isLoading: boolean;
}

const RateCard = ({ total, title, isLoading }: RateCardProp) => {
  return (
    <div className="mb-6 lg:mb-0 w-full bg-[#191C22] text-white border-[#1D222C] border-[1px] rounded-[5px] px-7 pt-7 pb-4">
      <h6 className="text-[#68749C] font-[600] mb-2 text-[16px]">{title}</h6>

      {isLoading ? (
        <div className="my-5">
          <Spinner />
        </div>
      ) : (
        <p className="text-[#C6DFFF] font-[600] text-[24px]  mb-5">
          {total.toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default RateCard;
