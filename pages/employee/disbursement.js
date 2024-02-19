import { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import Breadcrumbs from "../../components/Breadcrumbs";
import Result from "../../components/employee/result";
import Layout from "../../layouts";
import { EmployeeService } from "../api/employee.service";
import SearchDisbursement from "../../components/employee/searchDisbursement";
import { useRouter } from "next/router";
import ResultEmployeeFinancials from "../../components/employee/resultEmployeeFinancials";
const initial = {
    search: {
        financialType: '',
        limit: 10,
        offset: 0,
        startDate: '',
        endDate: ''
    },
    employeesFinancialsList: []
}
const breadcrumbs = [
    { index: 1, href: '/employee', name: 'ข้อมูลพนักงาน' },
    { index: 1, href: '/employee', name: 'บันทึกเบิก-จ่าย' }]
LoadingOverlay.propTypes = undefined
export default function Disbursement(props) {
    const router = useRouter();
    const employeeCode = router.query["employeeCode"];
    const [loading, setLoading] = useState(false)
    const [searchParam, setSearchParam] = useState(initial.search)
    const [employeesFinancialsList, setEmployeesFinancialsList] = useState(initial.employeesFinancialsList)
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [employeesFinancialsListExcel, setEmployeesFinancialsListExcel] = useState(initial.employeesList)


    useEffect(() => {
        async function fetchData() {
            setSearchParam(data => ({ ...data, employeeCode: employeeCode }));
            await getEmployeeFinancialsList({...initial.search,employeeCode :employeeCode})
            // await getEmployeeFinancialsListReport({...initial.search,employeeCode :employeeCode})
        }
        fetchData();
    }, []);

    const handleChange = (evt) => {
        const { name, value, checked, type } = evt.target;
        if (name === "dates") {
            setSearchParam(data => ({ ...data, ...value }));
        } else {
            setSearchParam(data => ({ ...data, [name]: value }));
        }
    }
    const handleReset = async () => {
        setSearchParam(initial.search)
        getEmployeeFinancialsList({...initial.search,employeeCode :employeeCode})
        // getEmployeeFinancialsListReport({...initial.search,employeeCode :employeeCode})
        setCurrentPage(1);
    }

    const paginate = async (pageNumber) => {
        setCurrentPage(pageNumber);
        setSearchParam(data => ({ ...data, offset: 10 * (pageNumber - 1) }));
        getEmployeeFinancialsList({ ...searchParam, offset: 10 * (pageNumber - 1) })
    }
    const handleSearch = async () => {
        getEmployeeFinancialsList({...searchParam,employeeCode :employeeCode});
        // getEmployeeFinancialsListReport({...searchParam,employeeCode :employeeCode})
    }

    const getEmployeeFinancialsList = async (searchParam) => {

        await EmployeeService.getEmployeeFinancialsList(searchParam).then(res => {
            if (res.data.resultCode === 200) {
                setEmployeesFinancialsList(res.data.resultData)
                setTotal(res.data.total)
            } else {
                setEmployeesList([])
            }
        }).catch(err => {
        })
    }

    const getEmployeeFinancialsListReport = async (searchParam) => {

        await EmployeeService.getEmployeeFinancialsList(searchParam).then(res => {
            if (res.data.resultCode === 200) {
                setEmployeesFinancialsListExcel(res.data.resultData)
            } else {
                setEmployeesFinancialsListExcel([])
            }
        }).catch(err => {
        })
    }

    const onsort = async (sort, desc) => {
        setSearchParam(data => ({ ...data, sort: sort, desc: desc ? 'DESC' : 'ASC' }));
        getEmployeeFinancialsList({ ...searchParam, sort: sort, desc: desc ? 'DESC' : 'ASC' })
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
                <SearchDisbursement employeeCode={employeeCode} searchParam={searchParam} handleChange={handleChange} handleSearch={handleSearch} handleReset={handleReset} employeesFinancialsListExcel={employeesFinancialsListExcel} />
                <ResultEmployeeFinancials employeesFinancialsList={employeesFinancialsList} total={total} currentPage={currentPage} callBack={handleSearch} onSort={onsort} paginate={paginate} />
            </LoadingOverlay>
        </Layout>
    )
}