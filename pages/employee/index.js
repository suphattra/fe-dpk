import { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import Breadcrumbs from "../../components/Breadcrumbs";
import Result from "../../components/employee/result";
import Search from "../../components/employee/search";
import Layout from "../../layouts";
import { EmployeeService } from "../api/employee.service";
const initial = {
    search: {
        employeeFullName: '',
        limit: 10,
        offset: 0
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
    const [paramSearch, setParamSearch] = useState({})


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
        getEmployeeList()
        setCurrentPage(1);
    }

    const paginate = async (pageNumber) => {
        setCurrentPage(pageNumber);
        setSearchParam(data => ({ ...data, offset: 10 * (pageNumber - 1) }));
        getEmployeeList({ ...paramSearch, offset: 10 * (pageNumber - 1) })
    }
    const handleSearch = async () => {
        searchParam.employeeFullName = searchParam.employeeFullName.trim()
        getEmployeeList(searchParam);
        setParamSearch(param)
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

    const onsort = async (sort, desc) => {
        setSearchParam(data => ({ ...data, sort: sort, desc: desc ? 'DESC' : 'ASC' }));
        getEmployeeList({ ...paramSearch, sort: sort, desc: desc ? 'DESC' : 'ASC' })
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
                <Result employeesList={employeesList} total={total} currentPage={currentPage} callBack={handleSearch} onSort={onsort} paginate={paginate}/>
            </LoadingOverlay>
        </Layout>
    )
}