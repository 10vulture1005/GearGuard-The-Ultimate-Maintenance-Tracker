const API_URL = 'http://localhost:5000';

async function run() {
  try {
    // 1. Signup
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'password123';
    console.log(`Creating user: ${email}`);
    
    let res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name: 'Test User' })
    });
    if (!res.ok) throw new Error(`Signup failed: ${res.statusText}`);

    // 2. Login
    console.log('Logging in...');
    res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const loginData = await res.json();
    const token = loginData.token;
    console.log('Got token:', token ? 'Yes' : 'No');

    // 3. Create Request
    console.log('Creating request...');
    res = await fetch(`${API_URL}/maintenance/create`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            subject: 'Test Maintenance',
            maintenanceType: 'Corrective',
            maintenanceFor: 'Equipment'
        })
    });
    const createData = await res.json();
    const requestId = createData._id;
    console.log(`Created request ID: ${requestId}`);

    // 4. Update Request
    console.log('Updating request...');
    res = await fetch(`${API_URL}/maintenance/update/${requestId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            subject: 'Updated Subject'
        })
    });
    
    if (res.ok) {
        console.log('Update SUCCESS');
    } else {
        const errData = await res.json();
        console.log('Update FAILED:', errData);
    }

  } catch (error) {
    console.error('Script Error:', error);
  }
}

run();
