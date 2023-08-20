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
        limit: 10,
        offset: 1
    },
    employeesList: []
}
const breadcrumbs = [{ index: 1, href: '/driver', name: 'ข้อมูลพนักงาน' }]
LoadingOverlay.propTypes = undefined
export default function Driver() {
    const [loading, setLoading] = useState(false)
    const [searchParam, setSearchParam] = useState(initial.search)
    const [employeesList, setEmployeesList] = useState(initial.employeesList)
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    useEffect(() => {
        async function fetchData() {
            getEmployeeList()
        }
        fetchData();
    }, []);
    
    const handleChange = (evt) => {
        const { name, value, checked, type } = evt.target;
        setSearchParam(data => ({ ...data, [name]: value }));
    }
    const handleReset = async () => {
        setSearchParam(initial.search)
        setEmployeesList([])
    }
    const handleSearch = async () => {
        getEmployeeList(searchParam);
    }

    const getEmployeeList = async (searchParam) => {
        await EmployeeService.getEmployeeList(searchParam).then(res => {
            if (res.data.resultCode === 200) {
                setEmployeesList(res.data.resultData)
            } else {
                setEmployeesList([])
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
                <Result employeesList={employeesList}  total={total}  currentPage={currentPage} callBack={handleSearch} />
            </LoadingOverlay>
        </Layout>
    )
}