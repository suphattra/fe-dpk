/* This example requires Tailwind CSS v2.0+ */
import { useState } from 'react'
import { Switch } from '@headlessui/react'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function SwitchGroup({ checkValue, value, onChange, onClick }) {
    const [enabled, setEnabled] = useState(checkValue)
    const onchangeSwitch = (e) => {
        onChange(e)
        setEnabled(!enabled)
        // setEnabled(checkValue)
    }
    return (
        <Switch.Group as="div" className="">
            <Switch
                checked={enabled}
                // onChange={onchangeSwitch}
                // onChange={setEnabled}
                onChange={(e) => onchangeSwitch(e)}
                onClick={onClick}
                value={value}
                className={classNames(
                    enabled ? 'bg-lime-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-24 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2'
                )}
            >
                <span
                    aria-hidden="true"
                    style={{ transform: enabled ? 'translateX(4.5rem)' : 'translateX(0rem)' }}
                    className={classNames(
                        // enabled ? 'translate-x-20' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                />
                <Switch.Label as="span" className="mx-1">
                    <span className={classNames(enabled ? 'text-white' : 'text-gray-900', "text-xs font-medium")}>{enabled ? 'ACTIVE' : 'INACTIVE'}</span>
                </Switch.Label>
            </Switch>

        </Switch.Group>
    )
}
