import { useEffect, useState } from "react";
import {
  getReports,
  resolveReport,
  warnUser
} from "../services/sakithService";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);

  const load = async () => {
    const res = await getReports();
    setReports(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {reports.map((r) => (
        <div className="card" key={r.id}>
          <p>{r.reason}</p>
          <button onClick={() => resolveReport(r.id)}>Resolve</button>
          <button onClick={() => warnUser(r.targetId)}>Warn</button>
        </div>
      ))}
    </div>
  );
}