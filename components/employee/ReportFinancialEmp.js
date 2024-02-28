import { Fragment, useState, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EmployeeService } from "../../pages/api/employee.service";
import { _resObjConfig, renderOptions } from "../../helpers/utils";
import DownloadExcel from "../DownloadExcel";
import InputSelectGroup from "../InputSelectGroup";
import InputGroupMultipleDate from "../InputGroupMultipleDate";
import { MasterService } from "../../pages/api/master.service";
import moment from "moment";

export default function ReportFinancialEmp(props) {
  const {
    open,
    setOpen,
    mode,
    _id,
    callbackLoad,
  } = props;
  const [searchParam, setSearchParam] = useState({});
  const [querySuccess, setQuerySuccess] = useState(false);
  const [errors, setErrors] = useState({
    startDate: false
  });
  const [reportData, setReportData] = useState([]);
  const [employeesFinancialsListExcel, setEmployeesFinancialsListExcel] = useState([])
  const [financialTypeOption, setFinancialTypeOptionOption] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await getConfigList("FINANCIAL_TYPE");
    }
    fetchData();
  }, []);

  const handleChange = (evt) => {
    const { name, value, checked, type } = evt.target;
    if (name === "dates") {
      setSearchParam(data => ({ ...data, ...value }));
      setErrors({ ...errors, startDate: false })
    } else {
      setSearchParam(data => ({ ...data, [name]: value }));
    }
  }
  const getEmployeeFinancialsList = async (employeeCode) => {
    if (!searchParam.startDate) {
      setErrors({ ...errors, startDate: true })
    } else {
      await EmployeeService.getEmployeeFinancialsReport(searchParam).then(async res => {
        if (res.data.resultCode === 200) {
          if (res.data.resultData.length <= 0) {
            setReportData([])
            setEmployeesFinancialsListExcel([])
            setQuerySuccess(true)
          } else {
            setEmployeesFinancialsListExcel(res.data.resultData)
            await initExport(res.data.resultData)
            setQuerySuccess(false)
          }
        } else {
          setEmployeesFinancialsListExcel([])
          setQuerySuccess(true)
        }
      }).catch(err => {
      })
    }

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
  const initExport = async (employeesFinancialsListExcel) => {
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
      { title: "พนักงาน", style: styleHeader },
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
          { value: item.transactionDate ? moment(item.transactionDate).format('DD/MM/YYYY') : "" },
          { value: item.employeeData.firstName + item.employeeData.lastName },
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
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto p-14">
          <div className="flex max-h-fit min-h-max h-full  items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="h-full relative transform  rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full md:w-6/12 lg:w-6/12 lg:max-w-screen-xl">
                {/* <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all md:w-6/12 lg:w-6/12 lg:max-w-screen-xl"> */}
                <div className="h-5/6 overflow-y-auto shadow-inner border rounded-md">
                  {/* <div className="flex justify-center grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4"> */}

                  <div className="flex justify-center grid grid-cols-1 p-2 gap-4 mb-4 pt-6">
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
                      required
                      invalid={
                        errors?.startDate ? errors?.startDate : false
                      }
                      // value={[searchParam.startDate ? searchParam.startDate : "", searchParam.endDate ? searchParam.endDate : ""]}  
                      startDate={searchParam.startDate ? searchParam.startDate : ""}
                      endDate={searchParam.endDate ? searchParam.endDate : ""}
                      format="YYYY-MM-DD"
                    />
                    <div className="flex justify-center pt-6">
                      <button
                        type="button"
                        className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                        onClick={() => {
                          setQuerySuccess(false)
                          setSearchParam({})
                          setReportData([])
                          setEmployeesFinancialsListExcel([])
                        }}
                      >
                        ล้างข้อมูล
                      </button>
                      <button
                        type="button"
                        className="flex justify-center inline-flex items-center rounded-md border border-transparent  bg-purple-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 mr-2"
                        onClick={() => {
                          getEmployeeFinancialsList();
                        }}
                      >
                        Generate รายงาน
                      </button>
                    </div>
                  </div>
                  <div className="pt-4">
                    {reportData.length > 0 && <div className="flex justify-center items-center">
                      <DownloadExcel
                        reportData={reportData}
                        name="สร้างรายงาน"
                        filename={"รายงานการเบิกจ่ายเงิน_" + moment(searchParam.startDate).format('DD-MM-YYYY') + '_' + moment(searchParam.endDate).format('DD-MM-YYYY')}
                      />

                    </div>}
                    {querySuccess &&
                      <div className="flex justify-center items-center">
                        <div
                          className="flex bg-blue-100 rounded-lg p-4 mb-4 text-sm text-blue-700 mt-2"
                          role="alert"
                        >
                          <svg
                            className="w-5 h-5 inline mr-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <div>ไม่พบข้อมูลรายงาน</div>
                        </div>

                      </div>}

                  </div>
                </div>
                <footer className="flex items-center justify-center">
                  <div className="flex justify-center items-center overflow-y-auto my-10">
                    <div className="flex justify-center items-center">
                      <button
                        type="button"
                        className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                </footer>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
