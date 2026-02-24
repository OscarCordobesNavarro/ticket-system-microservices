import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AccountSidebar from './AccountSidebar';

interface AccountLayoutProps {
    children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
    return (
        <div className="bg-surface text-slate-800 font-sans antialiased min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <AccountSidebar />
                    <div className="flex-1 space-y-6">
                        {children}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AccountLayout;
