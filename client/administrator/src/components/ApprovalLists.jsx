import React from 'react';
import { FaUsers, FaBus, FaCheckCircle } from 'react-icons/fa';

const ApprovalLists = ({ pendingManagers, pendingBuses, onSelect }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
            {/* Managers List */}
            <ListColumn 
                title="Manager Requests" 
                icon={<FaUsers className="text-slate-400" />} 
                count={pendingManagers.length} 
                colorClass="orange"
            >
                {pendingManagers.length === 0 ? <EmptyState msg="No pending managers" /> : pendingManagers.map(mgr => (
                    <ListItem 
                        key={mgr._id}
                        initial={mgr.organizationName.charAt(0)}
                        title={mgr.organizationName}
                        subtitle={mgr.operatorType}
                        colorClass="orange"
                        onClick={() => onSelect(mgr, 'manager')}
                    />
                ))}
            </ListColumn>

            {/* Buses List */}
            <ListColumn 
                title="Bus Verifications" 
                icon={<FaBus className="text-slate-400" />} 
                count={pendingBuses.length} 
                colorClass="red"
            >
                {pendingBuses.length === 0 ? <EmptyState msg="No pending buses" /> : pendingBuses.map(bus => (
                    <ListItem 
                        key={bus._id}
                        initial={<FaBus />}
                        title={bus.plateNumber}
                        subtitle={bus.route}
                        colorClass="red"
                        onClick={() => onSelect(bus, 'bus')}
                    />
                ))}
            </ListColumn>
        </div>
    );
};

const ListColumn = ({ title, icon, count, colorClass, children }) => (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center sticky top-0">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">{icon} {title}</h3>
            <span className={`bg-${colorClass}-100 text-${colorClass}-700 text-xs px-2.5 py-1 rounded-full font-bold`}>{count} New</span>
        </div>
        <div className="overflow-y-auto flex-1 p-3 space-y-2">{children}</div>
    </div>
);

const ListItem = ({ initial, title, subtitle, colorClass, onClick }) => (
    <div onClick={onClick} className="group p-4 rounded-2xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-all flex justify-between items-center">
        <div className="flex items-center gap-4">
            <div className={`h-10 w-10 bg-${colorClass}-100 text-${colorClass}-600 rounded-full flex items-center justify-center font-bold text-sm`}>
                {initial}
            </div>
            <div>
                <h4 className={`font-bold text-slate-800 text-sm group-hover:text-${colorClass}-600 transition-colors`}>{title}</h4>
                <div className="text-[10px] font-bold uppercase text-slate-400">{subtitle}</div>
            </div>
        </div>
        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded group-hover:bg-slate-800 group-hover:text-white transition-colors">Review</span>
    </div>
);

const EmptyState = ({ msg }) => (
    <div className="p-10 text-center text-slate-400 flex flex-col items-center justify-center h-full">
        <FaCheckCircle className="text-4xl mb-3 opacity-20" />
        <p className="text-sm font-bold">{msg}</p>
    </div>
);

export default ApprovalLists;