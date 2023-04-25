import '../styles/Dashboard.css'

const Dashboard = () => {
    return (
        <div className="Dashboard">
            <h1>How to use AREA ?</h1>
            <div className="Dashboard-container">
                <h2>🧩 Connect your applications in your <a href='/profile'>profile</a></h2>
                <h2>🤖 Create your first event <a href='/services'>service</a></h2>
                <h2>🤟 Create your first action <a href='/services'>service</a></h2>
            </div>
        </div>
    );
};

export default Dashboard;