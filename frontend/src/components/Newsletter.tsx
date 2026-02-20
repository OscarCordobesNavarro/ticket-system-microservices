import React from 'react';

const Newsletter: React.FC = () => {
    return (
        <section className="bg-navy-dark rounded-lg p-8 md:p-12 border border-slate-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-navy-dark to-slate-900"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Never miss an event.</h2>
                    <p className="text-slate-300 max-w-md font-normal">
                        Get notified about exclusive presales and new event announcements directly to your inbox.
                    </p>
                </div>
                <div className="flex w-full md:w-auto max-w-md gap-2">
                    <input
                        className="flex-1 bg-white/10 border-slate-600 focus:border-white focus:ring-0 rounded px-4 py-3 text-white placeholder-slate-400"
                        placeholder="Enter your email"
                        type="email"
                    />
                    <button className="bg-white text-navy-dark hover:bg-slate-100 font-bold px-6 py-3 rounded transition-colors whitespace-nowrap">
                        Sign Up
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
