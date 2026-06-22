// Simple test script to test animation rendering
const axios = require('axios');

async function testAnimation() {
    try {
        console.log('Testing animation API...');

        // You'll need to get a valid session token first
        // For now, let's just test if the endpoint responds
        const response = await axios.post('http://localhost:3001/api/animate', {
            prompt: 'Create a simple sine wave that moves across the screen'
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000
        });

        console.log('Response:', response.data);

        if (response.data.animationId) {
            console.log('Animation ID:', response.data.animationId);

            // Poll for status
            let status = 'pending';
            let attempts = 0;
            while (status !== 'completed' && status !== 'failed' && attempts < 20) {
                await new Promise(resolve => setTimeout(resolve, 2000));

                try {
                    const statusResponse = await axios.get(`http://localhost:3001/api/animate?id=${response.data.animationId}`);
                    status = statusResponse.data.status;
                    console.log(`Status (attempt ${attempts + 1}):`, status);

                    if (status === 'completed' || status === 'failed') {
                        console.log('Final result:', statusResponse.data);
                        break;
                    }
                } catch (err) {
                    console.log('Status check error:', err.message);
                }

                attempts++;
            }
        }

    } catch (error) {
        console.error('Test failed:', error.response?.data || error.message);
    }
}

testAnimation();
