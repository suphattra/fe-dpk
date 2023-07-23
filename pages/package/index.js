import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import Layout from "../../layouts";
import LoadingOverlay from "react-loading-overlay";
import { PackageService } from "../api/package.service";
import { convertFilter } from "../../helpers/utils";
import Result from "../../components/package/result";
import Search from "../../components/package/search";
import moment from 'moment'
LoadingOverlay.propTypes = undefined
const breadcrumbs = [{ index: 1, href: '/package', name: 'package' }]
const initial = {
    search: {
        effectiveDate: moment(new Date).format('YYYY-MM-DD'),
        name: '',
        status: "new,consumed",//,Depleted
        phone: '',
        customerType: '',
        customerId: '',
        limit: 10,
        offset: 1
    },
    packageList: []
}
export default function Package() {
    const [loading, setLoading] = useState(true)
    const [searchParam, setSearchParam] = useState(initial.search)
    const [packageList, setPackageList] = useState(initial.packageList)
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    useEffect(() => {
        async function fetchData() {
            getPackageList(searchParam);
        }
        fetchData();
    }, []);
    const handleReset = async () => {
        setSearchParam(initial.search)
        // setPackageList([])
        getPackageList(initial.search);
    }
    const getPackageList = async (searchParam) => {
        setLoading(true)
        let param = convertFilter(searchParam)
        await PackageService.getPackageList(param).then(res => {
            if (res.data.resultCode === "20000") {
                setPackageList(res.data.resultData.packages)
                setTotal(res.data.resultData.total)
            } else {
                setPackageList([])
            }
            setLoading(false)
        }).catch(err => {
            setLoading(false)
        })
    }
    const handleChange = (evt) => {
        const { name, value, checked, type } = evt.target;
        setSearchParam(data => ({ ...data, [name]: value }));
    }
    const handleSearch = async () => {
        getPackageList(searchParam);
    }
    const paginate = async (pageNumber) => {
        setCurrentPage(pageNumber);
        setSearchParam(data => ({ ...data, offset: pageNumber }));
        getPackageList({ ...searchParam, offset: pageNumber })

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
                <Breadcrumbs title="Package" breadcrumbs={breadcrumbs} >
                </Breadcrumbs>
                <Search handleReset={handleReset} handleChange={handleChange} searchParam={searchParam} handleSearch={handleSearch} />
                <Result packageList={packageList} total={total} paginate={paginate} currentPage={currentPage} callBack={handleSearch} searchParam={searchParam}/>
            </LoadingOverlay>
        </Layout>
    )
}