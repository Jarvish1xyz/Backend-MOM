function SearchMeeting({ onSearch }) {
  return (
    <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">

      {/* Input */}
      <input
        type="text"
        placeholder="Search by Meeting ID (e.g. MOM-1023)"
        className="
          w-full sm:flex-1
          px-4 py-2 rounded-lg
          border border-sky-200
          focus:outline-none focus:ring-2 focus:ring-sky-400
          bg-white/80
          transition
        "
        onChange={(e) => onSearch(e.target.value)}
      />

      {/* Button */}
      <button
        className="
          px-6 py-2 rounded-lg
          bg-sky-600 text-white
          hover:bg-sky-700
          transition-colors duration-200
          shadow-sm
        "
      >
        Search
      </button>
    </div>
  );
}

export default SearchMeeting;
