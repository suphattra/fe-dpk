import Router, { useRouter } from "next/router";
import { renderOptions } from "../../helpers/utils";
import {
  CardBasic,
  InputGroup,
  InputGroupMultipleDate,
  InputSelectGroup,
  LableGroup,
} from "..";
import { useEffect, useState } from "react";
import { EmployeeService } from "../../pages/api/employee.service";
import { MasterService } from "../../pages/api/master.service";
import DownloadExcel from "../DownloadExcel";
import moment from "moment";

export default function SearchDisbursement({
  handleSearch,
  handleReset,
  handleChange,
  searchParam,
  employeesFinancialsListExcel,
  employeeCode
}) {
  useEffect(() => {
    async function fetchData() {
      await getEmployeeDetail(employeeCode);
      await getConfigList("FINANCIAL_TYPE");
    }
    fetchData();
  }, []);
  useEffect(() => {
    initExport();
  }, [employeesFinancialsListExcel]);
  const router = useRouter();
  const [nationalityOption, setNationaliyOption] = useState([]);
  const [roleOption, setRoleOption] = useState([]);
  const [typeOption, setTypeOption] = useState([]);
  const [financialTypeOption, setFinancialTypeOptionOption] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [employeeDetail, setEmployeeDetail] = useState({});
  const getEmployeeDetail = async (employeeCode) => {
    await EmployeeService.getEmployeeDetail(employeeCode)
      .then((res) => {
        if (res.data.resultCode === 200) {
          console.log(res.data.resultData);
          setEmployeeDetail(res.data.resultData[0]);
        } else {
          setEmployeeDetail({});
        }
      })
      .catch((err) => {
        console.log("==> list job3");
      });
  };
  const getConfigList = async (code) => {
    let param = {
      subType: code,
      status: 'Active',
      type: 'EMPLOYEE'
    };
    await MasterService.getConfig(param)
      .then((res) => {
        if (res.data.resultCode === 200) {
          console.log(res.data);
          if (code === "FINANCIAL_TYPE") setFinancialTypeOptionOption(res.data.resultData);
        } else {
          if (code === "FINANCIAL_TYPE") setFinancialTypeOptionOption([]);
        }
      })
      .catch((err) => { });
  };
  const initExport = async () => {
    const styleHeader = {
      fill: { fgColor: { rgb: "6aa84f" } },
      font: { bold: true },
      alignment: { horizontal: "center" },
    };
    const styleData = {
      font: { bold: false },
      alignment: { horizontal: "center" },
    };
    const column = [
      { title: "ลำดับ", style: styleHeader },
      { title: "วัน/เดือน/ปี", style: styleHeader },
      { title: "ประเภท", style: styleHeader },
      { title: "รายการ", style: styleHeader },
      { title: "จำนวนเงิน", style: styleHeader },
      { title: "ช่องทางการจ่ายเงิน", style: styleHeader },
      { title: "หมายเหตุ", style: styleHeader },
    ];
    let dataRecord = [];
    if (employeesFinancialsListExcel && employeesFinancialsListExcel.length > 0) {
      dataRecord = employeesFinancialsListExcel.map((item, index) => {
        return [
          { value: index + 1, style: styleData },
          { value: item.transactionDate ? moment(item.transactionDate).format('DD/MM/YYYY') : ""},
          { value: item.financialType?.value1, },
          { value: item.financialTopic?.value1 },
          { value: item.amount ? item.amount : "" },
          { value: item.financialType?.code === 'MD0089' ? item.paymentType?.value1 : "-" },
          { value: item.remark ? item.remark : "" },
        ];
      });
    }
    let multiDataSet = [];

    if (dataRecord.length > 0) {
      multiDataSet = [
        {
          columns: column,
          data: dataRecord,
        },
      ];
    }
    setReportData(multiDataSet);
  };

  return (
    <>
      <div className="md:container md:mx-auto">
        <div
          className="flex justify-end w-full max-w-screen pt-4"
          aria-label="Breadcrumb"
        >
          {/* {reportData.length > 0 && (
            <DownloadExcel
              reportData={reportData}
              name="สร้างรายงาน"
              filename={"รายงานการเบิกจ่ายเงิน_" + employeeDetail.firstName + ' ' + employeeDetail.lastName}
            />
          )} */}
          <button
            type="button"
            onClick={() => {
              Router.push("detail/employee-disbursement?employeeCode="+employeeDetail.employeeCode);
            }}
            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2"
          >
            สร้างบันทึก
          </button>
        </div>
        <CardBasic>
          <div className="flex justify-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
            <LableGroup label="ชื่อ-นามสกุล" value={employeeDetail?.firstName + ' ' + employeeDetail?.lastName} />
            <LableGroup label="ประเภท" value={employeeDetail?.employeeType?.value1} />
            <LableGroup label="ตำแหน่ง" value={employeeDetail?.employeeRole?.value1} />
          </div>
          <div className="flex justify-center grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
            <InputSelectGroup
              type="text"
              label="ประเภท"
              onChange={handleChange}
              value={searchParam.financialType}
              id="financialType"
              name="financialType"
              isSearchable
              placeholder="ทั้งหมด"
              options={renderOptions(financialTypeOption, "value1", "code")}
            />
            <InputGroupMultipleDate
              type="text"
              id="dates"
              name="dates"
              label="วัน/เดือน/ปี"
              onChange={handleChange}
              // value={[searchParam.startDate ? searchParam.startDate : "", searchParam.endDate ? searchParam.endDate : ""]}  
              startDate={searchParam.startDate ? searchParam.startDate : ""}
              endDate={searchParam.endDate ? searchParam.endDate : ""}
              format="YYYY-MM-DD"
            />
          </div>
          <div className="flex justify-center items-center overflow-y-auto p-4">
            <button
              type="button"
              className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
              onClick={handleReset}
            >
              ล้าง
            </button>
            <button
              type="button"
              className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2"
              onClick={handleSearch}
            >
              ค้นหา
            </button>
          </div>
        </CardBasic>
      </div>
    </>
  );
}
