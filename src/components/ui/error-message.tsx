interface ErrorMessageProps {
    message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <div className="text-red-500 text-xl">⚠️</div>
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    )
}
