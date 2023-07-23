import { CardBasic, InputGroup } from "../../components";
import Breadcrumbs from "../../components/Breadcrumbs";
import Layout from "../../layouts";
import RiderManagementSchedule from "./rider-management";
const breadcrumbs = [{ index: 1, href: '/calendar-schedule', name: 'DPK MANAGMENT SYSTEM' }]
export default function NxRiderManagement() {
    return (
        <>
            <Layout>
                <Breadcrumbs title="DPK MANAGMENT SYSTEM" breadcrumbs={breadcrumbs} />

                <RiderManagementSchedule />
            </Layout>
        </>
    )
}