import { ExclamationIcon, InformationCircleIcon } from '@heroicons/react/solid'
import { useSelector } from 'react-redux'
import { AppState } from '../../../framework/store/rootReducer'
import { User } from '../../../models/User'

interface ProfileSettingsProps {}

export const ProfileSettings: React.FunctionComponent<ProfileSettingsProps> = ({}) => {
    const user: User | undefined = useSelector((state: AppState) => state.auth.user)

    return (
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <form action="#" method="POST">
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Profile</h3>

                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            This information will be displayed <b>publicly</b> so be careful what you
                                            share.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <input
                                    disabled
                                    type="text"
                                    name="username"
                                    value={user?.username}
                                    id="username"
                                    autoComplete="given-name"
                                    className="text-gray-500 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <input
                                    disabled
                                    type="text"
                                    name="email-address"
                                    value={user?.email}
                                    id="email-address"
                                    autoComplete="email"
                                    className="text-gray-500 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
