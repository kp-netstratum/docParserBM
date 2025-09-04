/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { KycDocList, KycForm } from "../forms/kycForm";

export const DashBoard = ({ SetDocs, setAppForm }: any) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-20 pt-20">
      <div className="flex flex-col gap-4">
        <div className="flex justify-center w-full text-3xl font-bold">
          DashBoard
        </div>
      </div>
      <div className="flex gap-4 w-full justify-center flex-wrap cursor-pointer">
        <div
          onClick={() => {
            SetDocs(KycDocList);
            setAppForm(KycForm);
            navigate("/docs");
          }}
          className="w-80 h-40 bg-slate-800 rounded-md flex justify-center items-center text-xl"
        >
          KYC Application
        </div>
        <div className="w-80 h-40 bg-slate-800 rounded-md flex justify-center items-center text-xl cursor-pointer">
          Passport Application
        </div>
      </div>
    </div>
  );
};
