const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle wage calculation
app.post('/calculate-wage', (req, res) => {
    console.log(req.body);
    const { hoursWorked, hourlyRate } = req.body;

    console.log(hoursWorked, hourlyRate);

    // Ensure inputs are numbers
    if (isNaN(hoursWorked) || isNaN(hourlyRate)) {
        return res.status(400).send('Error: Please enter numeric values only.');
    }

    let regularPay = 0, overtimePay = 0, totalPay = 0;

    // Calculate wages

    /**
     * Pay calculation works as follows:	

1.	If the hours worked are 40 hours or less, there is no overtime.
2.	If the hours worked is over 40 hours but less than or equal to 50 hours, we pay 1.5 the hourly rate for excess hours (hours over 40).
3.	If the hours worked is over 50 hours but less than or equal to 60 hours, we pay 2.0 the hourly rate for excess hours (hours over 50).
4.	If the hours worked is over 60 hours, we pay 2.5 the hourly rate for excess hours (hours over 60).

     */

    let overtime40 = 0, overtime50 = 0, overtime60 = 0;

    if (hoursWorked <= 40) {
        regularPay = hoursWorked * hourlyRate;
    } else if (hoursWorked <= 50) {
        regularPay = 40 * hourlyRate;
        overtime40 = (hoursWorked - 40) * hourlyRate * 1.5;
        overtimePay = overtime40;
        // overtimePay = (hoursWorked - 40) * hourlyRate * 1.5;
    } else if (hoursWorked <= 60) {
        regularPay = 40 * hourlyRate;
        overtime40 = 10 * hourlyRate * 1.5;
        overtime50 = (hoursWorked - 50) * hourlyRate * 2.0;
        overtimePay = overtime40 + overtime50;
        // overtimePay = 10 * hourlyRate * 1.5 + (hoursWorked - 50) * hourlyRate * 2.0;
    } else {
        regularPay = 40 * hourlyRate;
        overtime40 = 10 * hourlyRate * 1.5;
        overtime50 = 10 * hourlyRate * 2.0;
        overtime60 = (hoursWorked - 60) * hourlyRate * 2.5;
        overtimePay = overtime40 + overtime50 + overtime60;
        // overtimePay = 10 * hourlyRate * 1.5 + 10 * hourlyRate * 2.0 + (hoursWorked - 60) * hourlyRate * 2.5;
    }

    totalPay = regularPay + overtimePay;

    console.log(regularPay, overtimePay, totalPay, overtime40, overtime50, overtime60);
    console.log(`Regular Pay: ${regularPay}`);
    console.log(`Overtime Pay: ${overtimePay}`);
    console.log(`Total Pay: ${totalPay}`);
    console.log(`Overtime 40: ${overtime40}`);
    console.log(`Overtime 50: ${overtime50}`);
    console.log(`Overtime 60: ${overtime60}`);

    //return result by sending JSON response
    res.json({ regularPay, overtimePay, totalPay, overtime40, overtime50, overtime60 });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
