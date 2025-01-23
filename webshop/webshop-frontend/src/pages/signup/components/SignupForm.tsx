import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { RegisterNewUserRequest } from '../../../models/RegisterNewUserRequest'
import { CSRFTokenHiddenInput } from '../../../shared/components/CSRFTokenHiddenInput'
import { signupActions } from '../actions/SignupActions'

interface SignupFormProps {}

type FormData = {
    username: string
    email: string
    password1: string
    password2: string
}

export const SignupForm: React.FunctionComponent<SignupFormProps> = ({}) => {
    const dispatch = useDispatch()
    const history = useHistory()

    const {
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
            username: '',
            email: '',
            password1: '',
            password2: '',
        },
    })

    const onSubmit = (data: RegisterNewUserRequest) => {
        alert(JSON.stringify(data))
        dispatch(signupActions.RegisterNewUser(data, history))
    }

    useEffect(() => {
        trigger()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
            <h1 className="text-xl mb-6">Signup</h1>
            <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
                <CSRFTokenHiddenInput />

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <div className="mt-1">
                        <input
                            {...register('email', { required: 'Email is required' })}
                            autoComplete="off"
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                        {errors.email && (
                            <p className="text-xs text-red-400 font-bold mt-1 font-mono">{errors.email.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username (display name)
                    </label>
                    <div className="mt-1">
                        <input
                            {...register('username', { required: 'Username is required' })}
                            id="username"
                            name="username"
                            type="username"
                            autoComplete="off"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                        {errors.username && (
                            <p className="text-xs text-red-400 font-bold mt-1 font-mono">{errors.username.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="password1" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="mt-1">
                        <input
                            {...register('password1', { required: 'Password is required' })}
                            id="password1"
                            name="password1"
                            type="password"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                        {errors.password1 && (
                            <p className="text-xs text-red-400 font-bold mt-1 font-mono">{errors.password1.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
                        Repeat Password
                    </label>
                    <div className="mt-1">
                        <input
                            {...register('password2', {
                                required: 'Password validation is required, type the same password again',
                            })}
                            id="password2"
                            name="password2"
                            type="password"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                        {errors.password2 && (
                            <p className="text-xs text-red-400 font-bold mt-1 font-mono">{errors.password2.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <button
                        disabled={!isValid}
                        type="submit"
                        className="disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-default w-full flex justify-center mt-10 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    )
}
