import { useEffect, useState } from "react";

export const Preview = ({ fileData }: any) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (fileData) {
      const url = URL.createObjectURL(fileData);
      setFileUrl(url);

      // Clean up the object URL when component unmounts or fileData changes
      return () => URL.revokeObjectURL(url);
    } else {
      setFileUrl(null);
    }
  }, [fileData]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="p-4 flex items-center justify-center w-full h-full overflow-auto">
        {fileUrl && (
          <iframe
            src={fileUrl}
            title="File Preview"
            className="w-[90vw] h-[80vh]"
            frameBorder="0"
          />
        )}
      </div>
    </div>
  );
};
