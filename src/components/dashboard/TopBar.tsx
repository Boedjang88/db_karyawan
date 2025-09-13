export default function Topbar() {
  return (
    <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Welcome</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Boedjang88</span>
        <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">
          Logout
        </button>
      </div>
    </header>
  );
}
