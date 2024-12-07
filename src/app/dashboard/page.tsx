import { useAuth } from '@clerk/nextjs';

export default function Dashboard() {
    // const { user } = useAuth();

    return (
        <div>
            <h1>User Dashboard</h1>
            {/* <p>Welcome, {user.firstName}!</p> */}
        </div>
    );
}
