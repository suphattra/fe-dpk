import LoadingOverlay from "react-loading-overlay";
import Layout from "../../layouts";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useState } from "react";
import Search from "../../components/branches/search";

const breadcrumbs = [{ index: 1, href: '/branches', name: 'ข้อมูลสาขา' }]
const initial = {
    search: {
        name: '',
        limit: 10,
        offset: 1
    },
    branchList: []
}
export default function Branches() {
    const [loading, setLoading] = useState(false)
    const [searchParam, setSearchParam] = useState(initial.search)
    const [branchList, setBranchList] = useState(initial.branchList)
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
        //get list
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
                <Breadcrumbs title="ข้อมูลสาขา" breadcrumbs={breadcrumbs} handleChange={handleChange} handleSearch={handleSearch} handleReset={handleReset}/>
                <Search searchParam={searchParam} />
            </LoadingOverlay>
        </Layout>
    )
}