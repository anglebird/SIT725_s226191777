$(document).ready(function () {

    // Initialize Materialize image zoom effect
    $('.materialboxed').materialbox();

    // Handle BMI calculation button click
    $('#calculateBtn').click(function () {

        // Get input values for height and weight
        const height = $('#height').val();
        const weight = $('#weight').val();

        // Validate input values
        if (!height || !weight || height <= 0 || weight <= 0) {
            $('#result').text("Please enter valid height and weight");
            $('#status').text("");
            return;
        }

        // Send POST request to backend API to calculate BMI
        fetch('/api/calculate-bmi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                height: height,
                weight: weight
            })
        })
        .then(response => response.json())
        .then(data => {

            console.log(data); // Debugging output

            // Display BMI result if successful
            if (data.statusCode === 200) {
                $('#result').text(`Your BMI is ${data.data.bmi}`);
                $('#status').text(`Status: ${data.data.status}`);
            } else {
                $('#result').text(data.message || "Error calculating BMI");
                $('#status').text("");
            }
        })
        .catch(error => {
            console.error(error);
            $('#result').text("Server error");
            $('#status').text("");
        });
    });

    // Handle history button click to fetch BMI records
    $('#historyBtn').click(function () {
        fetch('/api/bmi-records')
            .then(response => response.json())
            .then(data => {

                const historyList = $('#historyList');
                historyList.empty();

                // Check if there are no records
                if (!data.data || data.data.length === 0) {
                    historyList.append('<li class="collection-item">No records found.</li>');
                    return;
                }

                // Display each BMI record in the list
                data.data.forEach(record => {
                    historyList.append(`
                        <li class="collection-item">
                            Height: ${record.height} cm,
                            Weight: ${record.weight} kg,
                            BMI: ${record.bmi},
                            Status: ${record.status}
                        </li>
                    `);
                });
            })
            .catch(error => {
                console.error(error);
                $('#historyList').html('<li class="collection-item">Error loading history.</li>');
            });
    });

});