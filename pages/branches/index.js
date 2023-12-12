import LoadingOverlay from "react-loading-overlay";
import Layout from "../../layouts";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useState } from "react";
import Search from "../../components/branches/search";
import { BranchService } from "../api/branch.service";
import { convertFilter } from "../../helpers/utils";
import { useEffect } from "react";
import ResultBranch from "../../components/branches/ResultBranch";

const breadcrumbs = [{ index: 1, href: '/branches', name: 'ข้อมูลสาขา' }]
const initial = {
    search: {
        name: '',
        limit: 10,
        offset: 1,
        status: 'Active',
    },
    branchList: []
}
export default function Branches() {
    const [loading, setLoading] = useState(false)
    const [searchParam, setSearchParam] = useState(initial.search)
    const [branchList, setBranchList] = useState(initial.branchList)
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    useEffect(() => {
        async function fetchData() {
            await getBranchList(searchParam);
        }
        fetchData();
    }, []);
    const handleChange = (evt) => {

        const { name, value, checked, type } = evt.target;
        console.log(checked)
        console.log(value)
        setSearchParam(data => ({ ...data, [name]: value }));
    }
    const handleReset = async () => {
        setSearchParam(initial.search)
        setBranchList([])
    }
    const handleSearch = async () => {
        getBranchList(searchParam);
    }
    const getBranchList = async (searchParam) => {
        setLoading(true)
        let param = convertFilter(searchParam)
        await BranchService.getBranchList(param).then(res => {
            if (res.data.resultCode === 200) {
                setBranchList(res.data.resultData)
                setTotal(res.data.total)
            } else {
                setBranchList([])
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
        getBranchList({ status: 'Active', offset: 10 * (pageNumber - 1) })
    }
    const onsort = async (sort, desc) => {
        setSearchParam(data => ({ ...data, sort: sort, desc: desc ? 'DESC' : 'ASC' }));
        getBranchList({ status: 'Active', sort: sort, desc: desc ? 'DESC' : 'ASC' })
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
                <Breadcrumbs title="ข้อมูลสาขา" breadcrumbs={breadcrumbs} handleChange={handleChange} handleSearch={handleSearch} handleReset={handleReset} />
                <Search searchParam={searchParam} />
                <ResultBranch branchList={branchList} total={total} paginate={paginate} currentPage={currentPage} onSort={onsort} callBack={handleSearch} />
            </LoadingOverlay>
        </Layout>
    )
}