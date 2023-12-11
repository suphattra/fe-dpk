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

  const getConfigList = async (code) => {
    let param = {
      subType: code,
      status: 'Active'
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
      .catch((err) => {});
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
      { title: "สัญชาติ", style: styleHeader },
      { title: "ประเภทพนักงาน", style: styleHeader },
      { title: "ตำแหน่ง", style: styleHeader },
      { title: "เบอร์โทรติดต่อ1", style: styleHeader },
      { title: "เบอร์โทรติดต่อ2", style: styleHeader },
      { title: "หมายเหตุ", style: styleHeader },
    ];
    let dataRecord = [];
    if (employeesListExcel && employeesListExcel.length > 0) {
      dataRecord = employeesListExcel.map((item, index) => {
        return [
          { value: index + 1, style: styleData },
          { value: item.firstName + ' ' + item.lastName, },
          {
            value: item.nickName ? item.nickName : "",
          },
          { value: item.gender.value1 ? item.gender.value1 : "" },
          { value: item.nationality.value1 ? item.nationality.value1 : "" },
          {
            value: item.employeeType.value1 ? item.employeeType.value1 : "",
            style: styleData,
          },
          {
            value: item.employeeRole.value1 ? item.employeeRole.value1 : "",
            style: styleData,
          },
          { value: item.phoneContact1 ? item.phoneContact1 : "" },
         
          { value: item.phoneContact2 ? item.phoneContact2 : "" },

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
          {reportData.length > 0 && (
            <DownloadExcel
              reportData={reportData}
              name="สร้างรายงาน"
              filename="รายงานพนักงาน"
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
      </div>
    </>
  );
}
