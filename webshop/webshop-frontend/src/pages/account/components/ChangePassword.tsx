import { InformationCircleIcon } from '@heroicons/react/solid'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { ChangePasswordRequest } from '../../../models/ChangePasswordRequest'
import { CSRFTokenHiddenInput } from '../../../shared/components/CSRFTokenHiddenInput'
import { accountActions } from '../actions/AccountActions'

interface ChangePasswordProps {}

type FormData = {
    oldPassword: string
    newPassword: string
}

export const ChangePassword: React.FunctionComponent<ChangePasswordProps> = ({}) => {
    const dispatch = useDispatch()

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors, isValid },
        trigger,
    } = useForm<FormData>({
        mode: 'all',
        reValidateMode: 'onChange',
        criteriaMode: 'firstError',
        shouldFocusError: true,
        shouldUnregister: false,
        defaultValues: {
            oldPassword: '',
            newPassword: '',
        },
    })

    const onSubmit = (data: ChangePasswordRequest) => {
        alert(JSON.stringify(data))
        dispatch(accountActions.ChangePassword(data))
        reset()
    }

    useEffect(() => {
        trigger()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <form onSubmit={handleSubmit(onSubmit)}>
                <CSRFTokenHiddenInput />

                <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
                            <div className="rounded-md bg-blue-50 p-4 mt-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3 flex-1 md:flex md:justify-between">
                                        <p className="text-sm text-blue-700">
                                            Remember to use a password manager for your passwords
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-6 gap-6 mt-8">
                                <div className="col-span-6 sm:col-span-3">
                                    <label
                                        htmlFor="current-password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Current Password
                                    </label>
                                    <input
                                        {...register('oldPassword', { required: 'The current password is required' })}
                                        type="password"
                                        name="oldPassword"
                                        id="oldPassword"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                    />
                                    {errors.oldPassword && (
                                        <p className="text-xs text-red-400 font-bold mt-1 font-mono">
                                            {errors.oldPassword.message}
                                        </p>
                                    )}
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <input
                                        {...register('newPassword', { required: 'A new password is required' })}
                                        type="password"
                                        name="newPassword"
                                        id="newPassword"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                    />
                                    {errors.newPassword && (
                                        <p className="text-xs text-red-400 font-bold mt-1 font-mono">
                                            {errors.newPassword.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="px- py-3 text-right">
                            <button
                                disabled={!isValid}
                                type="submit"
                                className="disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-default bg-pink-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
