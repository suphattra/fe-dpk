import { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import { convertFilter } from "../../helpers/utils";
import Layout from "../../layouts";
import { MasterService } from "../api/master.service";
import SearchTimeSheet from "../../components/time-sheet/SearchTimeSheet";
import { OperationsService } from "../api/operations.service";
import ResultTimeSheet from "../../components/time-sheet/ResultTimeSheet";
import Breadcrumbs from "../../components/Breadcrumbs";
LoadingOverlay.propTypes = undefined
const initial = {
    search: {
        // jobId: '',
        // jobNo: '',
        // customerName: '',
        // recepientName: '',
        // status: '',
        // shipmentDate: '',
        limit: 10,
        offset: 1
    },
    jobList: []
}
export default function Job() {
    const [loading, setLoading] = useState(true)
    const [searchParam, setSearchParam] = useState(initial.search)
    const [operationsList, setOperationsList] = useState(initial.jobList)
    console.log("job ==>",operationsList,initial.jobList)
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [jobStatus, setJobStatus] = useState([])
    const [paymentStatus, setPaymentStatus] = useState([])
    const [customerType, setCustomerType] = useState([])
    const breadcrumbs = [{ index: 1, href: '/job', name: 'บันทึกการทำงาน' }]
    useEffect(() => {
        async function fetchData() {
            await getOperationsList(searchParam);
            // await getConfig('JOB_STATUS')
            // await getConfig('CUSTOMER_TYPE')
            // await getConfig('PAYMENT_STATUS')
        }
        fetchData();
    }, []);
    const handleReset = async () => {
        setSearchParam(initial.search)
        setOperationsList([])
    }
    const handleChange = (evt) => {
        const { name, value, checked, type } = evt.target;
        setSearchParam(data => ({ ...data, [name]: value }));
    }
    const handleSearch = async () => {
        getOperationsList(searchParam);
    }
    const getOperationsList = async (searchParam) => {
        setLoading(true)
        let param = convertFilter(searchParam)
        await OperationsService.getOperationsList(param).then(res => {
            if (res.data.responseCode === 200) {
                setOperationsList(res.data.data)
                // setTotal(res.data.resultData.total)
                console.log("==> list job",res.data.operationCode)
            } else {
                setOperationsList([])
                console.log("==> list job2",res.data.data,res.data.responseMessage,res.data.responseCode)
            }
            setLoading(false)
        }).catch(err => {
            console.log("==> list job3")
            setLoading(false)
        })
    }
    const paginate = async (pageNumber) => {
        setCurrentPage(pageNumber);
        setSearchParam(data => ({ ...data, offset: pageNumber }));
        getOperationsList({ ...searchParam, offset: pageNumber })
    }
    const getConfig = async (configCategory) => {
        let paramquery = {
            configCategory: configCategory,
            configCode: '',
            status: ''
        }
        await MasterService.getConfig(paramquery).then(res => {
            if (res.data.resultCode === "20000") {
                // if (configCategory === 'JOB_STATUS') setJobStatus(res.data.resultData.configs)
                // if (configCategory === 'CUSTOMER_TYPE') setCustomerType(res.data.resultData.configs)
                // if (configCategory === 'PAYMENT_STATUS') setPaymentStatus(res.data.resultData.configs)
            } else {
                setJobStatus([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    return (
        <>
            <Layout>
                <LoadingOverlay active={loading} className="h-[calc(100vh-4rem)]" spinner text='Loading...'
                    styles={{
                        overlay: (base) => ({ ...base, background: 'rgba(215, 219, 227, 0.6)' }), spinner: (base) => ({ ...base, }),
                        wrapper: {
                            overflowY: loading ? 'scroll' : 'scroll'
                        }
                    }}>

                    <Breadcrumbs title="บันทึกการทำงาน" breadcrumbs={breadcrumbs}></Breadcrumbs>
                    <SearchTimeSheet handleReset={handleReset} handleChange={handleChange} searchParam={searchParam} handleSearch={handleSearch} jobStatus={jobStatus} customerType={customerType} paymentStatus={paymentStatus}/>
                    <ResultTimeSheet operationsList={operationsList} total={total} paginate={paginate} currentPage={currentPage} />
                </LoadingOverlay>
            </Layout>
        </>
    )
}

