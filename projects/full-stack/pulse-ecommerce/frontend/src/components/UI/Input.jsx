export default function Input({ type = "text", onChange }) {
  return <input type={type} onChange={onChange} />;
}
