import React, { useEffect, useRef, useState } from "react";
import Layout from "../../../layouts";
import { PencilSquareIcon, PlusIcon, PlusIcon as PlusIconMini, PrinterIcon, Squares2X2Icon as Squares2X2IconMini, XMarkIcon } from '@heroicons/react/20/solid'
import { InputGroup, InputGroupCurrency, InputGroupDate, InputGroupMask, InputRadioGroup, InputSelectGroup } from "../../../components";
import { JobService } from "../../api/job.service";
import { useRouter } from "next/router";
import { MasterService } from "../../api/master.service";
import LoadingOverlay from "react-loading-overlay";
import Script from 'next/script'
import moment from 'moment'
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { PaymentService } from "../../api/payment.service";
import { CustomerService } from "../../api/customer.service";
import { MapService } from "../../api/map.service";
import { NotifyService } from "../../api/notify.service";
import { DriverService } from "../../api/driver.service";
import { PackageService } from "../../api/package.service";

export default function CreateJob() {
    const [loading, setLoading] = useState(false)
    const handleLoadScript = () => {
    }
    return (
        <Layout>
            <Script src="https://cdn.omise.co/omise.js" onLoad={handleLoadScript} />
            <LoadingOverlay active={loading} className="h-[calc(100vh-4rem)]" spinner text='Loading...'
                styles={{
                    overlay: (base) => ({ ...base, background: 'rgba(215, 219, 227, 0.6)' }), spinner: (base) => ({ ...base, }),
                    wrapper: {
                        overflowY: loading ? 'scroll' : 'scroll'
                    }
                }}>
            </LoadingOverlay >
        </Layout >
    )
}
