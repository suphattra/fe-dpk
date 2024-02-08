import React from 'react';
import { useRouter } from "next/router";
import { CardBasic, InputGroup, InputSelectGroup, InputGroupDate, InputGroupMultipleDate } from "../../components";
import { convertFilter, renderOptions } from "../../helpers/utils";
import { MasterService } from "../../pages/api/master.service";
import { useEffect, useState } from "react";
import { EmployeeService } from "../../pages/api/employee.service";
import { BranchService } from "../../pages/api/branch.service";
import moment from 'moment';
import DownloadExcel from '../DownloadExcel';
import ReactExport from 'react-data-export';
import { NotifyService } from '../../pages/api/notify.service';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
export default function SearchTimeSheet({ handleSearch, handleReset, handleChange, searchParam, customerType, paymentStatus, operationsList }) {
    const router = useRouter();
    const [jobStatus, setJobStatus] = useState([])
    const [employeesOption, setEmployeesOption] = useState([])
    const [taskOption, setTaskption] = useState([])
    const [mainBranchOption, setMainBranchOption] = useState([])
    const [subBranchOption, setSubBranchOption] = useState([])
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            await getConfig('OPERATION_STATUS')
            await getConfig('TASK')
            await getEmployeeList()
            await getMainBranchList()
            await getSubBranchList()

        }
        fetchData();
    }, []);
    useEffect(() => {
        initExport()
    }, [operationsList]);
    const getConfig = async (configCategory) => {
        let paramquery = {
            status: 'Active',
            subType: configCategory,
        }
        await MasterService.getConfig(paramquery).then(res => {
            if (res.data.resultCode === 200) {
                if (configCategory === 'OPERATION_STATUS') setJobStatus(res.data.resultData)
                if (configCategory === 'TASK') setTaskption(res.data.resultData)
            } else {
                setJobStatus([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const getEmployeeList = async () => {
        await EmployeeService.getEmployeeList({ status: 'Active', limit: 10000 }).then(res => {
            if (res.data.resultCode === 200) {
                setEmployeesOption(res.data.resultData)
            } else {
                setEmployeesOption([])
            }
        }).catch(err => {
        })
    }

    const getMainBranchList = async () => {
        let param = {
            status: 'Active',
            branchType: 'MD0014'
        }
        await BranchService.getBranchList(param).then(res => {
            if (res.data.resultCode === 200) {
                setMainBranchOption(res.data.resultData)
            } else {
                setMainBranchOption([])
            }
        }).catch(err => {
        })
    }
    const getSubBranchList = async () => {
        let param = {
            status: 'Active',
            branchType: 'MD0015'
        }
        await BranchService.getBranchList(param).then(res => {
            if (res.data.resultCode === 200) {
                setSubBranchOption(res.data.resultData)
            } else {
                setSubBranchOption([])
            }
        }).catch(err => {
        })
    }
    const initExport = async () => {
        const styleHeader = { fill: { fgColor: { rgb: '6aa84f' } }, font: { bold: true }, alignment: { horizontal: 'center' } };
        const styleData = { font: { bold: false }, alignment: { horizontal: 'center' } };
        const column = [
            { title: 'ลำดับ', style: styleHeader },
            { title: 'วัน/เดือน/ปี', style: styleHeader },
            { title: 'พนักงาน', style: styleHeader },
            { title: 'แปลงใหญ่', style: styleHeader },
            { title: 'แปลงย่อย', style: styleHeader },
            { title: 'งาน', style: styleHeader },
            { title: 'จำนวนงาน', style: styleHeader },
            { title: 'ค่าแรง', style: styleHeader },
            { title: 'OT', style: styleHeader },
            { title: 'รวมเงิน OT', style: styleHeader },
            { title: 'ประเภทค่าแรง', style: styleHeader },
            { title: 'หมายเหตุ', style: styleHeader },
        ];
        let dataRecord = [];
        if (operationsList && operationsList.length > 0) {
            dataRecord = operationsList.map((item, index) => {
                return [
                    { value: index + 1, style: styleData },
                    { value: item.startDate ? moment(item.startDate).format('DD/MM/YYYY') : '' },
                    { value: item.employee.firstName + ' ' + item.employee.lastName, },
                    { value: item.mainBranch.branchName ? item.mainBranch.branchName : '' },
                    { value: item.subBranch.branchName ? item.subBranch.branchName : '' },
                    { value: item.task.value1 ? item.task.value1 : '' },
                    { value: item.taskAmount ? item.taskAmount : '', style: styleData },
                    { value: item.taskPaymentRate ? item.taskPaymentRate : '', style: styleData },
                    { value: item.otAmount && item.otRate ? `${item.otAmount} * ${item.otRate}` : `${item.otAmount || ''} ${item.otRate || ''}`, style: styleData },
                    { value: item.otTotal ? item.otTotal : '', style: styleData },
                    { value: item.wageType.value1 ? item.wageType.value1 : '' },
                    { value: item.remark ? item.remark : '' },
                ]
            })
        }
        let multiDataSet = [];

        if (dataRecord.length > 0) {
            multiDataSet = [
                {
                    columns: column,
                    data: dataRecord,
                },
            ]
        }
        setReportData(multiDataSet);
    }
    const exportReport = async () => {
        NotifyService.error("กรุณาระบุวันที่ ที่ต้องการสร้างการงานและกดปุ่มค้นหาอีกครั้ง")
    }
    return (
        <>
            <div className="md:container md:mx-auto">

                <div className="flex justify-end w-full max-w-screen pt-4" aria-label="Breadcrumb">
                    <div>
                        {reportData.length > 0 && <ExcelFile
                            element={
                                <button type="button" className="flex justify-center inline-flex items-center rounded-md border border-purple-600 bg-white-600 px-6 py-1.5 text-xs font-medium shadow-sm hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2 disabled:text-gray-800 disabled:bg-gray-100 disabled:text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 48 48" className='mr-2'>
                                        <path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"></path><path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"></path><path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path><path fill="#17472a" d="M14 24.005H29V33.055H14z"></path><g><path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"></path><path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"></path><path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z"></path><path fill="#129652" d="M29 24.005H44V33.055H29z"></path></g><path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"></path>
                                    </svg>
                                    สร้างรายงาน
                                </button>
                            }
                            filename="รายงานบันทึกการทำงาน"
                        >
                            <ExcelSheet dataSet={reportData} name={"รายงานบันทึกการทำงาน"} />
                        </ExcelFile>}
                        {reportData.length <= 0 && <button type="button"
                            onClick={() => exportReport()}
                            className="flex justify-center inline-flex items-center rounded-md border border-purple-600 bg-white-600 px-6 py-1.5 text-xs font-medium shadow-sm hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2 disabled:text-gray-800 disabled:bg-gray-100 disabled:text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 48 48" className='mr-2'>
                                <path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"></path><path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"></path><path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path><path fill="#17472a" d="M14 24.005H29V33.055H14z"></path><g><path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"></path><path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"></path><path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z"></path><path fill="#129652" d="M29 24.005H44V33.055H29z"></path></g><path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"></path>
                            </svg>
                            สร้างรายงาน
                        </button>
                        }
                    </div>
                    {/* {reportData.length > 0 && <DownloadExcel reportData={reportData} name="สร้างรายงาน" filename="รายงานบันทึกการทำงาน" />} */}
                    <button type="button"
                        onClick={() => { router.push('operations/calendar-schedule'); }}
                        className="flex justify-center inline-flex items-center rounded-md border border-purple-600 bg-white-600 px-6 py-1.5 text-xs font-medium  shadow-sm hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2">
                        ตารางงาน
                    </button>
                    <button type="button"
                        onClick={() => { router.push('operations/detail'); }}
                        className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2">
                        สร้างบันทึก
                    </button>
                </div>
                <CardBasic >
                    <div className="flex justify-center grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-4">

                        <InputSelectGroup type="text" id="mainBranch" name="mainBranch" label="แปลงใหญ่"
                            options={renderOptions(mainBranchOption, "branchName", "branchCode")}
                            value={searchParam.mainBranch}
                            placeholder="ทั้งหมด"
                            onChange={handleChange}
                            isMulti
                        />
                        <InputSelectGroup type="text" id="subBranch" name="subBranch" label="แปลงย่อย"
                            options={renderOptions(subBranchOption, "branchName", "branchCode")}
                            value={searchParam.subBranch}
                            onChange={handleChange}
                            placeholder="ทั้งหมด"
                            isMulti
                        />
                        <InputSelectGroup type="text" id="operationStatus" name="operationStatus" label="สถานะงาน"
                            options={renderOptions(jobStatus, "value1", "code")}
                            isMulti
                            placeholder="ทั้งหมด"
                            isSearchable
                            value={searchParam.operationStatus}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
                        <InputSelectGroup type="text" id="employee" name="employee" label="พนักงาน"
                            isMulti
                            isSearchable
                            options={renderOptions(employeesOption, "firstName", "employeeCode", "lastName")}
                            value={searchParam.employee}
                            onChange={handleChange}
                            placeholder="ทั้งหมด"
                        />
                        <InputSelectGroup type="text" id="task" name="task" label="งาน"
                            options={renderOptions(taskOption, "value1", "code")}
                            isMulti
                            isSearchable
                            value={searchParam.task}
                            placeholder="ทั้งหมด"
                            onChange={handleChange}
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
                        {/* <InputGroupDate type="text" id="startDate" name="startDate" label="วัน/เดือน/ปี" onChange={handleChange} value={searchParam.startDate ? searchParam.startDate : ""} format="YYYY-MM-DD" /> */}
                    </div>
                    <div className="flex justify-center items-center overflow-y-auto p-4" >
                        <button type="button"
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                            onClick={handleReset}>
                            ล้าง
                        </button>
                        <button type="button"
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={handleSearch}>
                            ค้นหา
                        </button>
                    </div>
                </CardBasic>
            </div>
        </>
    )
}

