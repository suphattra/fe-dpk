import { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import Breadcrumbs from "../../components/Breadcrumbs";
import Result from "../../components/driver/result";
import Search from "../../components/driver/search";
import { convertFilter } from "../../helpers/utils";
import Layout from "../../layouts";
import { DriverService } from "../api/driver.service";
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
    const [loading, setLoading] = useState(true)
    const [searchParam, setSearchParam] = useState(initial.search)
    const [driverList, setDriverList] = useState(initial.driverList)
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    useEffect(() => {
        async function fetchData() {
            getDriverList(searchParam);
        }
        fetchData();
    }, []);
    const getDriverList = async (searchParam) => {
        setDriverList([])
        setLoading(true)
        let param = convertFilter(searchParam)
        await DriverService.getDriverList(param).then(res => {
            if (res.data.resultCode === "20000") {
                setDriverList(res.data.resultData.drivers)
                setTotal(res.data.resultData.total)
            } else {
                setDriverList([])
            }
            setLoading(false)
        }).catch(err => {
            setLoading(false)
        })
    }
    const handleChange = (evt) => {

        const { name, value, checked, type } = evt.target;
        console.log(checked)
        console.log(value)
        setSearchParam(data => ({ ...data, [name]: value }));
    }
    const handleReset = async () => {
        setSearchParam(initial.search)
        setDriverList([])
    }
    const handleSearch = async () => {
        getDriverList(searchParam);
    }
    const paginate = async (pageNumber) => {
        setCurrentPage(pageNumber);
        setSearchParam(data => ({ ...data, offset: pageNumber }));
        getDriverList({ ...searchParam, offset: pageNumber })

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
                <Result driverList={driverList} total={total} paginate={paginate} currentPage={currentPage} callBack={handleSearch} />
            </LoadingOverlay>
        </Layout>
    )
}