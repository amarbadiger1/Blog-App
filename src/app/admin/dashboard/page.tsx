import { useAuth } from '@clerk/nextjs';

export default function AdminDashboard() {
    // const { user } = useAuth();

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {/* <p>Welcome, Admin {user.firstName}!</p> */}
        </div>
    );
}
