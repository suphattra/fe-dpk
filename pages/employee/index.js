import { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import Breadcrumbs from "../../components/Breadcrumbs";
import Result from "../../components/employee/result";
import Search from "../../components/employee/search";
import Layout from "../../layouts";
import { EmployeeService } from "../api/employee.service";
const initial = {
    search: {
        name: '',
        status: '',
        phone: '',
        driverType: '',
        driverId: '',
        jobType: '',
        limit: 10,
        offset: 1
    },
    driverList: []
}
const breadcrumbs = [{ index: 1, href: '/driver', name: 'ข้อมูลพนักงาน' }]
LoadingOverlay.propTypes = undefined
export default function Driver() {
    const [loading, setLoading] = useState(false)
    const [searchParam, setSearchParam] = useState(initial.search)
    const [employeesOption, setEmployeesOption] = useState(initial.driverList)
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    useEffect(() => {
        async function fetchData() {
            getEmployeeList()
        }
        fetchData();
    }, []);
  
    
    const handleChange = (e, index, name) => {
        let obj = {}
        if (name === 'wageType' || name === 'operationStatus' || name === 'task') {
            let _option = []
            switch (name) {
                case "wageType":
                    _option = wageType
                    break;
                case "operationStatus":
                    _option = operationStatus
                    break;
                case "task":
                    _option = taskOption
                    break;
                default:
            }
            obj = _resObjConfig(e.target.value, _option)
            onChange({ target: { name: name, value: obj } }, index, name)
        }
        if (name === 'employee') {
            obj = employeesOption.find((ele => { return ele.employeeCode === e.target.value }))
            if (!isEmpty(obj)) {
                let emp = {
                    _id: obj._id,
                    employeeCode: obj.employeeCode,
                    title: obj.title,
                    firstName: obj.firstName,
                    lastName: obj.lastName,
                    nickName: obj.nickName,
                    gender: obj.gender,
                }
                onChange({ target: { name: name, value: emp } }, index, name)
            }

        }
    }
    const handleReset = async () => {
        setSearchParam(initial.search)
        setDriverList([])
    }
    const handleSearch = async () => {
        getDriverList(searchParam);
    }

    const getEmployeeList = async () => {
        setEmployeesOption([])
        await EmployeeService.getEmployeeList().then(res => {
            if (res.data.resultCode === 200) {
                setEmployeesOption(res.data.resultData)
            } else {
                setEmployeesOption([])
            }
        }).catch(err => {
        })
    }
    return (
        <Layout>
            <LoadingOverlay active={loading} className="h-[calc(100vh-4rem)]" spinner text='Loading...'
                styles={{
                    overlay: (base) => ({ ...base, background: 'rgba(215, 219, 227, 0.6)' }), spinner: (base) => ({ ...base, }),
                    wrapper: {
                        overflowY: loading ? 'scroll' : 'scroll'
                    }
                }}>
                <Breadcrumbs title="ข้อมูลพนักงาน" breadcrumbs={breadcrumbs} />
                <Search searchParam={searchParam} handleChange={handleChange} handleSearch={handleSearch} handleReset={handleReset} />
                <Result employeesOption={employeesOption}  total={total}  currentPage={currentPage} callBack={handleSearch} />
            </LoadingOverlay>
        </Layout>
    )
}