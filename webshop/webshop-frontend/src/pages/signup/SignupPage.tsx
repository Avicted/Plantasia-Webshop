import { SignupForm } from "./components/SignupForm"

interface SignupPageProps {}

export const SignupPage: React.FunctionComponent<SignupPageProps> = ({ children }) => {
    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <SignupForm />
        </div>
    )
}
