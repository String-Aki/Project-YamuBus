import React from 'react';

const Dashboard = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">System Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Pending Requests</h3>
                    <p className="text-3xl font-bold text-slate-800 mt-2">12</p>
                    <div className="mt-4 text-xs text-green-600 bg-green-50 inline-block px-2 py-1 rounded">
                        Requires Attention
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Buses</h3>
                    <p className="text-3xl font-bold text-slate-800 mt-2">145</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Active Routes</h3>
                    <p className="text-3xl font-bold text-slate-800 mt-2">8</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;