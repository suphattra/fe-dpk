import Router from "next/router";
import { renderOptions } from "../../helpers/utils";
import {
  CardBasic,
  InputGroup,
  InputGroupMultipleDate,
  InputSelectGroup,
} from "../../components";
import { useEffect, useState } from "react";
import { EmployeeService } from "../../pages/api/employee.service";
import { MasterService } from "../../pages/api/master.service";
import DownloadExcel from "../DownloadExcel";
import moment from "moment";
import ReportFinancialEmp from "./ReportFinancialEmp";

export default function Search({
  handleSearch,
  handleReset,
  handleChange,
  searchParam,
  employeesListExcel,
}) {
  useEffect(() => {
    async function fetchData() {
      await getConfigList("NATIONALITY");
      await getConfigList("TYPE");
      await getConfigList("ROLE");
    }
    fetchData();
  }, []);
  useEffect(() => {
    initExport();
  }, [employeesListExcel]);
  const [nationalityOption, setNationaliyOption] = useState([]);
  const [roleOption, setRoleOption] = useState([]);
  const [typeOption, setTypeOption] = useState([]);
  const [employeesOption, setEmployeesOption] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [openPopupReport, setOpenPopupReport] = useState(false);

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
          if (code === "TITLE") setTitleOption(res.data.resultData);
          // if (code === 'GENDER') setGenderOption(res.data.resultData)
          if (code === "NATIONALITY") setNationaliyOption(res.data.resultData);
          if (code === "TYPE") setTypeOption(res.data.resultData);
          if (code === "ROLE") setRoleOption(res.data.resultData);
        } else {
          if (code === "TITLE") setTitleOption([]);
          if (code === "GENDER") setGenderOption([]);
          if (code === "NATIONALITY") setNationaliyOption([]);
          if (code === "TYPE") setTypeOption([]);
          if (code === "ROLE") setRoleOption([]);
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
      { title: "ชื่อ-นามสกุล", style: styleHeader },
      { title: "ชื่อเล่น", style: styleHeader },
      { title: "เพศ", style: styleHeader },
      { title: "วันเกิด", style: styleHeader },
      { title: "สัญชาติ", style: styleHeader },
      { title: "เบอร์โทรติดต่อ", style: styleHeader },
      { title: "ประเภทพนักงาน", style: styleHeader },
      { title: "ตำแหน่งงาน", style: styleHeader },
      { title: "วันเริ่มงาน", style: styleHeader },
      { title: "วันสิ้นสุดงาน", style: styleHeader },
      { title: "หมายเหตุ", style: styleHeader },
    ];
    let dataRecord = [];
    if (employeesListExcel && employeesListExcel.length > 0) {
      dataRecord = employeesListExcel.map((item, index) => {
        return [
          { value: index + 1, style: styleData },
          { value: item.firstName + ' ' + item.lastName, },
          { value: item.nickName ? item.nickName : "", },
          { value: item.gender.value1 ? item.gender.value1 : "" },
          { value: item.birthDate ? moment(item.birthDate).format('DD/MM/YYYY') : "" },
          { value: item.nationality.value1 ? item.nationality.value1 : "" },
          { value: item.phoneContact1 ? item.phoneContact1 : "" },
          {
            value: item.employeeType.value1 ? item.employeeType.value1 : "",
            style: styleData,
          },
          {
            value: item.employeeRole.value1 ? item.employeeRole.value1 : "",
            style: styleData,
          },
          { value: item.startDate ? moment(item.startDate).format('DD/MM/YYYY') : "" },
          { value: item.endDate ? moment(item.endDate).format('DD/MM/YYYY') : "" },
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
  const onSetOpenModal = (value) => {
    // console.log(value)
    setOpenPopupReport(value);
  };
  return (
    <>
      <div className="md:container md:mx-auto">
        <div
          className="flex justify-end w-full max-w-screen pt-4"
          aria-label="Breadcrumb"
        >
          <button
            type="button"
            onClick={() => {
              setOpenPopupReport(true)
            }}
            className="flex justify-center inline-flex items-center rounded-md border border-purple-600 bg-white-600 px-6 py-1.5 text-xs font-medium shadow-sm hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2 disabled:text-gray-800 disabled:bg-gray-50 disabled:text-gray-500"
          >  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 48 48" className='mr-2'>
              <path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"></path><path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"></path><path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path><path fill="#17472a" d="M14 24.005H29V33.055H14z"></path><g><path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"></path><path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"></path><path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z"></path><path fill="#129652" d="M29 24.005H44V33.055H29z"></path></g><path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"></path>
            </svg>
            สร้างรายงานบันทึกเบิก-จ่าย
          </button>
          {reportData.length > 0 && (
            <DownloadExcel
              reportData={reportData}
              name="สร้างรายงาน"
              filename="รายงานข้อมูลพนักงาน"
            />
          )}
          <button
            type="button"
            onClick={() => {
              Router.push("employee/detail/employee-detail");
            }}
            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2"
          >
            เพิ่มพนักงาน
          </button>
        </div>
        <CardBasic>
          {/* <div className="flex justify-center"> */}
          <div className="flex justify-center grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
            {/* <div className="flex items-center justify-end"> */}
            <InputGroup
              type="text"
              id="employeeFullName"
              name="employeeFullName"
              label="ชื่อ-นามสกุล"
              onChange={handleChange}
              value={searchParam.employeeFullName}
            />
            <InputSelectGroup
              type="text"
              id="nationality"
              name="nationality"
              label="สัญชาติ"
              // isMulti
              isSearchable
              options={renderOptions(nationalityOption, "value1", "code")}
              value={searchParam.nationality}
              onChange={handleChange}
              placeholder="ทั้งหมด"
            />
          </div>
          {/* </div> */}
          {/* <div className="flex justify-center"> */}
          <div className="flex justify-center grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
            <InputSelectGroup
              type="text"
              label="ประเภทพนักงาน"
              onChange={handleChange}
              value={searchParam.employeeType}
              id="employeeType"
              name="employeeType"
              isSearchable
              placeholder="ทั้งหมด"
              options={renderOptions(typeOption, "value1", "code")}
            />
            <InputSelectGroup
              type="text"
              label="ตำแหน่งงาน"
              id="employeeRole"
              name="employeeRole"
              onChange={handleChange}
              isSearchable
              value={searchParam.employeeRole}
              placeholder="ทั้งหมด"
              options={renderOptions(roleOption, "value1", "code")}
            />
            {/* </div> */}
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

        {openPopupReport && <ReportFinancialEmp
          open={openPopupReport}
          setOpen={onSetOpenModal}>

        </ReportFinancialEmp>}
      </div>
    </>
  );
}
