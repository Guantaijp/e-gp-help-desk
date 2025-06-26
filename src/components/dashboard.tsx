"use client"

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Welcome to the Dashboard</h1>
            <p className="text-gray-600">Here’s a quick overview of what’s happening today.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800">Active Users</h2>
                    <p className="text-3xl font-bold mt-2 text-blue-600">1,245</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800">New Messages</h2>
                    <p className="text-3xl font-bold mt-2 text-green-600">52</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800">Open Tickets</h2>
                    <p className="text-3xl font-bold mt-2 text-red-600">8</p>
                </div>
            </div>
        </div>
    )
}
