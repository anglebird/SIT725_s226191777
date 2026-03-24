$(document).ready(function () {

    $('.materialboxed').materialbox();
    // when the button is clicked
    $('#calculateBtn').click(function () {

        // get height and weight input values
        const height = $('#height').val();
        const weight = $('#weight').val();

        // check if inputs are empty
        if (!height || !weight) {
            alert("Please enter both height and weight");
            return;
        }

        // call backend BMI API
        fetch(`/calculate-bmi?height=${height}&weight=${weight}`)
            .then(response => response.json())
            .then(data => {

                // if there is an error from server
                if (data.error) {
                    $('#result').text(data.error);
                    $('#status').text("");
                } else {
                    // display BMI result
                    $('#result').text(`Your BMI is ${data.bmi}`);
                    $('#status').text(`Status: ${data.status}`);
                }
            })
            .catch(error => {
                // if request fails
                console.error(error);
                $('#result').text("Error calculating BMI");
            });
    });

});