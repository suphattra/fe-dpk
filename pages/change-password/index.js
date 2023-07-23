import { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import { CardBasic, InputGroup } from "../../components";
import Breadcrumbs from "../../components/Breadcrumbs";
import Layout from "../../layouts";
import * as yup from "yup"
import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers"
LoadingOverlay.propTypes = undefined
const breadcrumbs = [{ index: 1, href: '/change-password', name: 'change password' }]
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
}
export default function ChangePassword() {
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState(false)
    // const schema = yup.object().shape({
    //     currentPassword: yup.string().required("Please enter your current password"),
    //     newPassword: yup
    //         .string()
    //         .notOneOf([yup.ref("currentPassword")], "Please provide new password")
    //         .min(6, "Please enter at least 6 characters")
    //         .required("Please provide your new password"),
    //     confirmPassword: yup
    //         .string()
    //         .min(6, "Please enter at least 6 characters")
    //         .oneOf([yup.ref("newPassword")], "Your password not match")
    //         .required("Please repeat your new password")
    // })
    // const { control, handleSubmit, errors, setError } = useForm({
    //     resolver: yupResolver(schema),
    //     defaultValues: {
    //         currentPassword: "",
    //         newPassword: "",
    //         confirmPassword: ""
    //     }
    // })
    useEffect(() => {
    }, []);

    const handleChange = () => {

    }
    return (
        <Layout>
            <LoadingOverlay active={loading} className="h-[calc(100vh-4rem)]" spinner text='Loading...'
                styles={{ overlay: (base) => ({ ...base, background: 'rgba(215, 219, 227, 0.6)' }), spinner: (base) => ({ ...base, }) }}>
                <Breadcrumbs title="Customer" breadcrumbs={breadcrumbs}  >
                </Breadcrumbs>
                <div className="md:container md:mx-auto">
                    <CardBasic title="Change Password">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                            <InputGroup type="text" id="password" name="password" label="password:" onChange={(e) => setPassword(e.target.value)} value={password} />
                            <InputGroup type="text" id="password" name="password" label="password:" onChange={(e) => setPassword(e.target.value)} value={password} />
                        </div>
                    </CardBasic>
                </div>
            </LoadingOverlay>
        </Layout>

    )
}