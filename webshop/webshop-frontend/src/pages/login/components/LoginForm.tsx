import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { AuthenticationRequest } from '../../../models/AuthenticationRequest'
import { CSRFTokenHiddenInput } from '../../../shared/components/CSRFTokenHiddenInput'
import { authActions } from '../actions/AuthActions'

interface LoginFormProps {}

type FormData = {
    username: string
    password: string
}

export const LoginForm: React.FunctionComponent<LoginFormProps> = ({}) => {
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
            password: '',
        },
    })

    const onSubmit = (data: AuthenticationRequest) => {
        dispatch(authActions.LoginRequest(data))
    }

    useEffect(() => {
        trigger()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
            <h1 className="text-xl mb-6">Login</h1>
            <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
                <CSRFTokenHiddenInput />

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <div className="mt-1">
                        <input
                            {...register('username', { required: 'Username is required' })}
                            id="username"
                            name="username"
                            type="username"
                            autoComplete="username"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                        {errors.username && (
                            <p className="text-xs text-red-400 font-bold mt-1 font-mono">{errors.username.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="mt-1">
                        <input
                            {...register('password', { required: 'Password is required' })}
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                        {errors.password && (
                            <p className="text-xs text-red-400 font-bold mt-1 font-mono">{errors.password.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <button
                        disabled={!isValid}
                        type="submit"
                        className="disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-default w-full flex justify-center mt-10 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    )
}
