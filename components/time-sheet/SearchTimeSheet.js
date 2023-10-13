import React from 'react';
import * as XLSX from 'xlsx';
import { useRouter } from "next/router";
import { CardBasic, InputGroup, InputSelectGroup, InputGroupDate } from "../../components";
import { renderOptions } from "../../helpers/utils";
import { MasterService } from "../../pages/api/master.service";
import { useEffect, useState } from "react";
import { EmployeeService } from "../../pages/api/employee.service";
import { BranchService } from "../../pages/api/branch.service";
import moment from 'moment';
export default function SearchTimeSheet({ handleSearch, handleReset, handleChange, searchParam, customerType, paymentStatus, operationsList }) {
    const router = useRouter();
    const [jobStatus, setJobStatus] = useState([])
    const [employeesOption, setEmployeesOption] = useState([])
    const [taskOption, setTaskption] = useState([])
    const [mainBranchOption, setMainBranchOption] = useState([])
    const [subBranchOption, setSubBranchOption] = useState([])

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
    const getConfig = async (configCategory) => {
        let paramquery = {
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
        await EmployeeService.getEmployeeList().then(res => {
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
    const exportToExcel = () => {
        const newArrayExport = operationsList.map((item, index) => {
            const newColumn = {
                'ลำดับ': index + 1,
                'วัน/เดือน/ปี': item.startDate ? moment(item.startDate).format('DD/MM/YYYY') : "",
                'พนักงาน': item.employee.firstName + ' ' + item.employee.lastName,
                'แปลงใหญ่': item.mainBranch.branchName,
                'แปลงย่อย': item.task.value1,
                'จำนวนงาน': item.taskAmount,
                'ค่าแรง': item.taskPaymentRate,
                'OT': item.otAmount && item.otRate ? `${item.otAmount} * ${item.otRate}` : `${item.otAmount || ''} ${item.otRate || ''}`,
                'ประเภทค่าแรง': item.wageType.value1,
                'หมายเหตุ': item.remark,
            };
            return newColumn;
        });

        var myFile = 'download.xlsx';
        var myWorkSheet = XLSX.utils.json_to_sheet(newArrayExport);
        var myWorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(myWorkBook, myWorkSheet, 'data');
        XLSX.writeFile(myWorkBook, myFile);
    }

    return (
        <>
            <div className="md:container md:mx-auto">

                <div className="flex justify-end w-full max-w-screen pt-4" aria-label="Breadcrumb">
                    {/* <div className="block justify-left w-full pt-4">
                        บันทึกการทำงาน
                    </div> */}
                    <button type="button"
                        onClick={exportToExcel}
                        className="flex justify-center inline-flex items-center rounded-md border border-purple-600 bg-white-600 px-6 py-1.5 text-xs font-medium shadow-sm hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2">
                        สร้างรายงาน
                    </button>
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

                        <InputGroupDate type="text" id="startDate" name="startDate" label="วัน/เดือน/ปี" onChange={handleChange} value={searchParam.startDate ? searchParam.startDate : ""} format="YYYY-MM-DD" />
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

