import { LoginForm } from './components/LoginForm'

interface LoginPageProps {}

export const LoginPage: React.FunctionComponent<LoginPageProps> = ({}) => {
    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <LoginForm />
        </div>
    )
}
