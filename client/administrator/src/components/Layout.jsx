import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    Map, 
    LogOut, 
    Menu, 
    X,
    ShieldCheck
} from 'lucide-react';

const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Fleet Managers', path: '/managers', icon: <Users size={20} /> },
        { name: 'Route Master', path: '/routes', icon: <Map size={20} /> },
    ];

    const handleLogout = () => {
        if(window.confirm("Disconnect from Admin Console?")) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminInfo');
            navigate('/');
        }
    };

    return (
        <div className="flex h-screen bg-dark-bg text-slate-200 font-sans">
            
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-dark-surface border-r border-dark-border transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
            `}>
                <div className="p-6 flex items-center gap-3 border-b border-dark-border">
                    <div className="bg-brand p-2 rounded-lg shadow-lg shadow-brand/20">
                        <ShieldCheck size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-wide text-white">BUS APP</h1>
                        <p className="text-[10px] text-brand-light font-mono uppercase tracking-widest">Command Center</p>
                    </div>
                </div>

                <nav className="mt-8 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                    isActive 
                                    ? 'bg-brand text-white shadow-lg shadow-brand/25' 
                                    : 'text-slate-400 hover:bg-dark-bg hover:text-white'
                                }`}
                            >
                                <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-brand-light'}`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium">{item.name}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-dark-border">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-dark-bg rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden relative">
                
                <header className="md:hidden h-16 bg-dark-surface border-b border-dark-border flex items-center justify-between px-4 z-40">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={20} className="text-brand" />
                        <span className="font-bold text-white">Admin Console</span>
                    </div>
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-dark-bg rounded-lg"
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <Outlet />
                </div>
            </main>

            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default Layout;