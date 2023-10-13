import { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import { convertFilter } from "../../helpers/utils";
import Layout from "../../layouts";
import { MasterService } from "../api/master.service";
import SearchTimeSheet from "../../components/time-sheet/SearchTimeSheet";
import { OperationsService } from "../api/operations.service";
import ResultTimeSheet from "../../components/time-sheet/ResultTimeSheet";
import Breadcrumbs from "../../components/Breadcrumbs";
import moment from "moment";
LoadingOverlay.propTypes = undefined
const initial = {
    search: {
        startDate: '',// moment(new Date).format('YYYY-MM-DD'),
        endDate: '',
        // jobNo: '',
        // customerName: '',
        // recepientName: '',
        // employee: [],
        // task: [],
        desc: 'DESC',
        sort: 'updatedDate',
        limit: 10,
        offset: 0
    },
    jobList: []
}
export default function Job() {
    const [loading, setLoading] = useState(true)
    const [searchParam, setSearchParam] = useState(initial.search)
    const [operationsList, setOperationsList] = useState(initial.jobList)
    const [operationsListExcel, setOperationsListExcel] = useState(initial.jobList)
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const breadcrumbs = [{ index: 1, href: '/job', name: 'บันทึกการทำงาน' }]
    const [paramSearch, setParamSearch] = useState({})
    useEffect(() => {
        async function fetchData() {
            await getOperationsList(searchParam);
            await getOperationsListReport(searchParam);
        }
        fetchData();
    }, []);
    const handleReset = async () => {
        setSearchParam(initial.search)
        setOperationsList([])
        setOperationsListExcel([])
        setCurrentPage(1);
        getOperationsList(initial.search);
        getOperationsListReport(initial.search)
    }
    const handleChange = (evt) => {
        const { name, value, checked, type } = evt.target;
        if (name === "dates") {
            setSearchParam(data => ({ ...data, ...value }));
        } else {
            setSearchParam(data => ({ ...data, [name]: value }));
        }
    }
    const handleSearch = async () => {
        let param = {}
        console.log("searchParam", searchParam)
        if (searchParam.task) {
            let split = ""
            searchParam.task.map((ele) => {
                split += ele.value + '|'
            })
            param.task = split
        }
        if (searchParam.employee) {
            let split = ""
            searchParam.employee.map((ele) => {
                split += ele.value + '|'
            })
            param.employee = split
        }
        if (searchParam.operationStatus) {
            let split = ""
            searchParam.operationStatus.map((ele) => {
                split += ele.value + '|'
            })
            param.operationStatus = split
        }
        if (searchParam.mainBranch) {
            let split = ""
            searchParam.mainBranch.map((ele) => {
                split += ele.value + '|'
            })
            param.mainBranch = split
        }
        if (searchParam.subBranch) {
            let split = ""
            searchParam.subBranch.map((ele) => {
                split += ele.value + '|'
            })
            param.subBranch = split
        }

        if (searchParam.startDate) {
            param.startDate = searchParam.startDate
        }
        if (searchParam.endDate) {
            param.endDate = searchParam.endDate
        }
        setParamSearch(param)
        console.log(param)
        getOperationsList(param);
        getOperationsListReport(param)
    }
    const getOperationsList = async (searchParam) => {
        setLoading(true)
        let param = convertFilter(searchParam)
        await OperationsService.getOperationsList(param).then(res => {
            if (res.data.resultCode === 200) {
                setOperationsList(res.data.resultData)
                setTotal(res.data.total)
            } else {
                setOperationsList([])
            }
            setLoading(false)
        }).catch(err => {
            console.log("==> list job3")
            setLoading(false)
        })
    }
    const getOperationsListReport = async (searchParam) => {
        setLoading(true)
        let param = convertFilter(searchParam)
        param.limit = 100000
        await OperationsService.getOperationsList(param).then(res => {
            if (res.data.resultCode === 200) {
                setOperationsListExcel(res.data.resultData)
                setTotal(res.data.total)
            } else {
                setOperationsListExcel([])
            }
            setLoading(false)
        }).catch(err => {
            console.log("==> list job3")
            setLoading(false)
        })
    }
    const paginate = async (pageNumber) => {
        setCurrentPage(pageNumber);
        setSearchParam(data => ({ ...data, offset: 10 * (pageNumber - 1) }));
        getOperationsList({ ...paramSearch, offset: 10 * (pageNumber - 1) })
    }
    const onsort = async (sort, desc) => {
        setSearchParam(data => ({ ...data, sort: sort, desc: desc ? 'DESC' : 'ASC' }));
        getOperationsList({ ...paramSearch, sort: sort, desc: desc ? 'DESC' : 'ASC' })
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
                    <SearchTimeSheet handleReset={handleReset} handleChange={handleChange} searchParam={searchParam} handleSearch={handleSearch} operationsList={operationsListExcel} />
                    <ResultTimeSheet operationsList={operationsList} total={total} paginate={paginate} currentPage={currentPage} onSort={onsort} callBack={handleSearch} />
                </LoadingOverlay>
            </Layout>
        </>
    )
}

