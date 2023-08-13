import { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import Breadcrumbs from "../../components/Breadcrumbs";
import Result from "../../components/job/result";
// import SearchTimeSheet from "../../components/time/SearchTimeSheet";
import { convertFilter } from "../../helpers/utils";
import Layout from "../../layouts";
import { JobService } from "../api/job.service";
import { MasterService } from "../api/master.service";
import SearchTimeSheet from "../../components/time-sheet/SearchTimeSheet";
import RusultTimeSheet from "../../components/time-sheet/RusultTimeSheet";
import { OperationsService } from "../api/operations.service";
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
const breadcrumbs = [{ index: 1, href: '/job', name: 'บันทึกการทำงาน' }]
export default function Job() {
    const [loading, setLoading] = useState(true)
    const [searchParam, setSearchParam] = useState(initial.search)
    const [jobList, setJobList] = useState(initial.jobList)
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [jobStatus, setJobStatus] = useState([])
    const [paymentStatus, setPaymentStatus] = useState([])
    const [customerType, setCustomerType] = useState([])
    useEffect(() => {
        async function fetchData() {
            await getJobList(searchParam);
            await getConfig('JOB_STATUS')
            await getConfig('CUSTOMER_TYPE')
            await getConfig('PAYMENT_STATUS')
        }
        fetchData();
    }, []);
    const handleReset = async () => {
        setSearchParam(initial.search)
        setJobList([])
    }
    const handleChange = (evt) => {
        const { name, value, checked, type } = evt.target;
        setSearchParam(data => ({ ...data, [name]: value }));
    }
    const handleSearch = async () => {
        getJobList(searchParam);
    }
    const getJobList = async (searchParam) => {
        setLoading(true)
        let param = convertFilter(searchParam)
        await OperationsService.getOperationsList(param).then(res => {
            if (res.data.resultCode === "20000") {
                setJobList(res.data.resultData.jobs)
                setTotal(res.data.resultData.total)
            } else {
                setJobList([])
            }
            setLoading(false)
        }).catch(err => {
            setLoading(false)
        })
    }
    const paginate = async (pageNumber) => {
        setCurrentPage(pageNumber);
        setSearchParam(data => ({ ...data, offset: pageNumber }));
        getJobList({ ...searchParam, offset: pageNumber })
    }
    const getConfig = async (configCategory) => {
        let paramquery = {
            configCategory: configCategory,
            configCode: '',
            status: ''
        }
        await MasterService.getConfig(paramquery).then(res => {
            if (res.data.resultCode === "20000") {
                if (configCategory === 'JOB_STATUS') setJobStatus(res.data.resultData.configs)
                if (configCategory === 'CUSTOMER_TYPE') setCustomerType(res.data.resultData.configs)
                if (configCategory === 'PAYMENT_STATUS') setPaymentStatus(res.data.resultData.configs)
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

                    {/* <Breadcrumbs title="บันทึกการทำงาน" breadcrumbs={breadcrumbs}></Breadcrumbs> */}
                    <SearchTimeSheet handleReset={handleReset} handleChange={handleChange} searchParam={searchParam} handleSearch={handleSearch} jobStatus={jobStatus} customerType={customerType} paymentStatus={paymentStatus}/>
                    <RusultTimeSheet jobList={jobList} total={total} paginate={paginate} currentPage={currentPage} />
                </LoadingOverlay>
            </Layout>
        </>
    )
}

