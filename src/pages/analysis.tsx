import { Analyzer } from "../components/analyzer";
import { Preview } from "../components/preview";

export const Analysis = ({ data, fileData }: any) => {
  return (
    data ? (
      <div className=" space-y-10 flex h-[100vh] sm:flex-row flex-col bg-gradient-to-br from-[#0f172a] to-[#1e293b] overflow-auto">
        <div className="w-1/2 flex items-center justify-center h-full m-0">
          <Preview fileData={fileData} />
        </div>
        <div className="w-1/2">
          <Analyzer data={data} />
        </div>
      </div>
    ) : (
      <div className="h-full flex flex-col gap-3 items-center justify-center p-6 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
        <h2 className="text-2xl font-bold text-center text-white">
          No analysis data available.
        </h2>
        <div onClick={() => window.location.href = "/"} className="text-white cursor-pointer bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Home</div>
      </div>
    )
  );
};
