import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Submitted Applications</h1>
      <Link to="/apply">Apply for Insurance</Link>
      <button onClick={() => navigate("/apply")}>Apply Now</button>
    </div>
  );
};

export default Home;
