import { CardBasic, InputGroup } from "../../components";
import Breadcrumbs from "../../components/Breadcrumbs";
import Layout from "../../layouts";
import RiderManagementSchedule from "./rider-management";
const breadcrumbs = [{ index: 1, href: '/nx-rider-managment', name: 'Nx Rider Management' }]
export default function NxRiderManagement() {
    return (
        <>
            <Layout>
                <Breadcrumbs title="Nx Rider Management" breadcrumbs={breadcrumbs} />

                <RiderManagementSchedule />
            </Layout>
        </>
    )
}