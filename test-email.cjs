const https = require('https');

const data = JSON.stringify({
    service_id: 'service_sxdo3kf',
    template_id: 'template_gk0ii8t',
    user_id: 'A_SOhLnMepCskV-Hv',
    template_params: {
        to_name: 'Johnel',
        to_email: 'johnelthebig@gmail.com',
        platform_name: 'NexusFinPro'
    }
});

const options = {
    hostname: 'api.emailjs.com',
    port: 443,
    path: '/api/v1.0/email/send',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
