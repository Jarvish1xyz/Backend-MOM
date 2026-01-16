function ParticipantInput({ value, onChange }) {
  return (
    <input
      type="email"
      placeholder="Participant Email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 mb-2 rounded-md bg-white bg-opacity-75"
    />
  );
}

export default ParticipantInput;
