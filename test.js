fetch('http://localhost:5000/api/auth/forgotpassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@test.com' })
}).then(res => res.text()).then(console.log).catch(console.error);
