import React from 'react';
import ReactExport from 'react-data-export';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

export default function DownloadExcel({ reportData, name, filename }) {
  return (
    <div>
      <ExcelFile
        element={

          <button type="button"
            disabled={reportData.length <= 0 ? true : false}
            className="flex justify-center inline-flex items-center rounded-md border border-purple-600 bg-white-600 px-6 py-1.5 text-xs font-medium shadow-sm hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2">
            {name}
          </button>
        }
        filename={filename}
      >
        <ExcelSheet dataSet={reportData} name={filename} />
      </ExcelFile>
    </div>
  );
}
