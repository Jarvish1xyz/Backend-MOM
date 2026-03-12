import React, { createContext, useState, useContext } from 'react';

const NoticeContext = createContext();

export const NoticeProvider = ({ children }) => {
    const [notice, setNotice] = useState({ show: false, msg: "", type: "info" });
    const [modal, setModal] = useState({ 
        show: false, 
        title: "", 
        onConfirm: null, 
        type: "danger" // 'danger' for delete, 'primary' for update
    });

    const triggerNotice = (msg, type = "info") => {
        setNotice({ show: true, msg, type });
        setTimeout(() => setNotice({ show: false, msg: "", type: "info" }), 4000);
    };

    // Updated to accept 'type' (danger or primary)
    const triggerConfirm = (title, onConfirmAction, type = "danger") => {
        setModal({
            show: true,
            title,
            type,
            onConfirm: () => {
                onConfirmAction();
                setModal({ show: false, title: "", onConfirm: null, type: "danger" });
            }
        });
    };

    return (
        <NoticeContext.Provider value={{ triggerNotice, triggerConfirm }}>
            {children}

            {/* 1. SLIDING TOASTS (Success, Warning, Error) */}
            {notice.show && (
                <div className={`fixed top-6 right-6 z-[999] flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-2xl animate-slide-in
                    ${notice.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' :
                    notice.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                    notice.type === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                    'border-blue-200 bg-blue-50 text-blue-700'}`}>

                    <div className="flex flex-col">
                        <p className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-0.5">{notice.type}</p>
                        <p className="text-sm font-bold">{notice.msg}</p>
                    </div>

                    <button onClick={() => setNotice({ ...notice, show: false })} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            )}

            {/* 2. APPEARING MODAL (Delete or Update Confirmation) */}
            {modal.show && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full mx-4 border border-slate-100 animate-modal-pop">
                        
                        {/* Dynamic Icon Wrapper */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 animate-bounce 
                            ${modal.type === 'primary' ? 'bg-blue-50' : 'bg-red-50'}`}>
                            
                            {modal.type === 'primary' ? (
                                // Blue Sync Icon for Updates
                                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            ) : (
                                // Red Trash Icon for Deletions
                                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            )}
                        </div>

                        <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                            {modal.type === 'primary' ? 'Confirm Update?' : 'Are you sure?'}
                        </h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                            {modal.title}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setModal({ ...modal, show: false })}
                                className="flex-1 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={modal.onConfirm}
                                className={`flex-1 px-4 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg transition-all 
                                    ${modal.type === 'primary' 
                                        ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' 
                                        : 'bg-red-500 hover:bg-red-600 shadow-red-200'}`}
                            >
                                {modal.type === 'primary' ? 'Save' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </NoticeContext.Provider>
    );
};

export const useNotice = () => useContext(NoticeContext);