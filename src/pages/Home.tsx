import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchApplications } from "../api";
import { IFormData } from "../types/general";

const Home = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState<IFormData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getApplications = async () => {
      try {
        const data = await fetchApplications();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    getApplications();
  }, []);

  console.log(applications);

  if (loading) return <p>Loading applications...</p>;

  return (
    <div>
      <h1>Submitted Applications</h1>
      <Link to="/apply">Apply for Insurance</Link>
      <button onClick={() => navigate("/apply")}>Apply Now</button>
    </div>
  );
};

export default Home;
