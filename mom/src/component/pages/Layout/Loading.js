function Loading() {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
                <div className="relative flex items-center justify-center">
                    {/* Outer spinning ring */}
                    <div className="w-20 h-20 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>

                    {/* Inner pulsing logo point */}
                    <div className="absolute w-4 h-4 bg-blue-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>

                    {/* Decorative ping effect */}
                    <div className="absolute w-16 h-16 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                </div>

                <div className="mt-8 text-center">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Synchronizing</h3>
                    <div className="flex justify-center gap-1 mt-2">
                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Loading;