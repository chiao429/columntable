import "./App.css";
import ColumnTable from "./ColumnTable";

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">XML 表格轉換器</h1>
      <ColumnTable />
    </div>
  );
}

export default App;
