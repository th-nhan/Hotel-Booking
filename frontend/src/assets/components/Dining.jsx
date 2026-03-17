import React from 'react'
import {  Utensils, GlassWater, ArrowUpRight, Calendar } from 'lucide-react';

const Dining = () => {
    return (
        <div id='dining' className=" mb-10 relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-body overflow-x-hidden antialiased">
            {/* Main Content */}
            <main className="flex-1 pt-16">
                {/* Menu Preview Section */}
                <section className="bg-[#1a1810] px-4 py-24 sm:px-10 relative overflow-hidden dark:bg-[#1a1810]">
                    {/* Background decorative elements */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>

                    <div className="mx-auto max-w-5xl relative z-10">
                        <div className="text-center mb-16">
                            <span className="text-primary font-display italic text-xl">Gastronomy</span>
                            <h2 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">Our Menu Preview</h2>
                            <div className="mx-auto mt-6 h-1 w-24 bg-primary rounded-full"></div>
                        </div>

                        <div className="grid gap-8">
                            {/* Menu Item 1 */}
                            <div className="group flex flex-col items-stretch overflow-hidden rounded-xl border border-primary/20 bg-[#F8F5F0] transition-all hover:border-primary/50 md:flex-row md:items-center  bg-white dark:bg-[#2a261a]">
                                <div className="h-64 md:h-auto md:w-2/5 md:min-h-[300px] relative overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDu3ouwWP5WneqapjMzLoi0AtihQuXWjGPyzeGAbKDE6f4DILSmcvbYaXCCdGs28foh4booN5fRfJkUy4CnlTlJH5xf1-1M21vA9pMq1HBbUqInQXKE4OopGujvH5uL5_ux47LA0Abg_uH271AnItF62Cjc6Oh4iq7_Oi8ZAjCA5IfhhEG7wk0eyVKAyn9nNfNRNrBxTzq4vZBZvahayIc5meLWetUOdJHJ26jPf1pcf3WCHByNMoUPRrqfbFobOF8XgN0oHLYlads")' }}
                                    ></div>
                                </div>
                                <div className="flex flex-1 flex-col justify-center p-8 md:p-10">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="rounded bg-primary/10 px-2 py-1 text-xs font-bold uppercase tracking-wider text-background-dark">Signature</span>
                                        <span className="font-display text-xl font-bold text-primary">$185</span>
                                    </div>
                                    <h3 className="mb-3 font-display text-3xl font-bold text-background-dark">Seasonal Degustation</h3>
                                    <p className="mb-6 text-slate-600 leading-relaxed font-light">
                                        A 7-course journey through modern European cuisine featuring locally sourced ingredients and avant-garde techniques.
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <button className="rounded-lg border border-background-dark/20 px-6 py-2.5 text-sm font-bold text-background-dark transition-colors hover:bg-background-dark hover:text-dark">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Item 2 (Smaller cards row) */}
                            <div className="grid gap-8 md:grid-cols-2">
                                <div className="flex flex-col rounded-xl border border-primary/20 bg-[#2a261a] p-6 hover:border-primary/40 transition-colors">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Utensils size={20} />
                                            </div>
                                            <h4 className="font-display text-xl font-bold text-white">À La Carte</h4>
                                        </div>
                                        <ArrowUpRight size={20} className="text-slate-500" />
                                    </div>
                                    <p className="text-slate-400 font-light mb-6 flex-grow">
                                        Select from our refined list of appetizers, mains, and desserts prepared to perfection.
                                    </p>
                                    <a className="text-primary text-sm font-bold hover:underline" href="#">Download PDF Menu</a>
                                </div>

                                <div className="flex flex-col rounded-xl border border-primary/20 bg-[#2a261a] p-6 hover:border-primary/40 transition-colors">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <GlassWater size={20} />
                                            </div>
                                            <h4 className="font-display text-xl font-bold text-white">Wine Pairing</h4>
                                        </div>
                                        <ArrowUpRight size={20} className="text-slate-500" />
                                    </div>
                                    <p className="text-slate-400 font-light mb-6 flex-grow">
                                        Expertly matched wines to elevate your dining experience, curated by our Head Sommelier.
                                    </p>
                                    <a className="text-primary text-sm font-bold hover:underline" href="#">View Wine List</a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-background-dark font-bold transition-transform hover:scale-105">
                                <Calendar size={20} />
                                <span className="ml-2">Reserve Your Experience</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>


        </div>
    )
}

export default Dining