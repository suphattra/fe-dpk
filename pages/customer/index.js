import { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import Breadcrumbs from "../../components/Breadcrumbs";
import { convertFilter } from "../../helpers/utils";
import Layout from "../../layouts";
import { CustomerService } from "../api/customer.service";
import Result from "../../components/customer/result";
import Search from "../../components/customer/search";
LoadingOverlay.propTypes = undefined
const breadcrumbs = [{ index: 1, href: '/customer', name: 'customer' }]
const initial = {
    search: {
        name: '',
        status: '',
        phone: '',
        customerType: '',
        customerId: '',
        limit: 10,
        offset: 1
    },
    customerList: []
}
export default function Customer() {
    const [loading, setLoading] = useState(true)
    const [searchParam, setSearchParam] = useState(initial.search)
    const [customerList, setCustomerList] = useState(initial.customerList)
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        async function fetchData() {
            getCustomerList(searchParam);
        }
        fetchData();
    }, []);

    const getCustomerList = async (searchParam) => {
        setLoading(true)
        setCustomerList([])
        let param = convertFilter(searchParam)
        await CustomerService.getCustomerList(param).then(res => {
            if (res.data.resultCode === "20000") {
                setCustomerList(res.data.resultData.customers)
                setTotal(res.data.resultData.total)
            } else {
                setCustomerList([])
            }
            setLoading(false)
        }).catch(err => {
            setLoading(false)
        })
    }
    const handleReset = async () => {
        setSearchParam(initial.search)
        setCustomerList([])
    }
    const handleChange = (evt) => {
        const { name, value, checked, type } = evt.target;
        setSearchParam(data => ({ ...data, [name]: value }));
    }
    const handleSearch = async () => {
        getCustomerList(searchParam);
    }
    const paginate = async (pageNumber) => {
        setCurrentPage(pageNumber);
        setSearchParam(data => ({ ...data, offset: pageNumber }));
        getCustomerList({ ...searchParam, offset: pageNumber })

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
                <Breadcrumbs title="Customer" breadcrumbs={breadcrumbs}>
                </Breadcrumbs>
                <Search handleReset={handleReset} handleChange={handleChange} searchParam={searchParam} handleSearch={handleSearch} />
                <Result customerList={customerList} total={total} paginate={paginate} currentPage={currentPage} callBack={handleSearch} />
            </LoadingOverlay>
        </Layout>

    )
}