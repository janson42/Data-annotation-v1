// Global variables to store the data from the CSV file
let csvData = [];
let currentIndex = 0;

// Function to load CSV data from the file input
function loadCSVData() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a CSV file.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const contents = e.target.result;
        csvData = parseCSV(contents);
        currentIndex = 0;
        displayImage();
    };

    reader.readAsText(file);
}

// Function to jump to a specific row in the CSV data
function jumpToRow() {
    const rowNumberInput = document.getElementById('rowNumber');
    const row = parseInt(rowNumberInput.value);

    if (isNaN(row) || row < 1 || row > csvData.length) {
        alert('Please enter a valid row number.');
        return;
    }

    currentIndex = row - 1;
    displayImage();
}

// Function to parse the CSV content
function parseCSV(content) {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');

    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const record = {};
        for (let j = 0; j < headers.length; j++) {
            record[headers[j]] = values[j];
        }
        data.push(record);
    }

    return data;
}

// Function to display images and data
function displayImage() {
    const image1 = document.getElementById('image1');
    const image2 = document.getElementById('image2');

    if (currentIndex < csvData.length) {
        const image1Url = csvData[currentIndex]['original_image_url'];
        const image2Url = csvData[currentIndex]['aigc_image_url'];

        image1.src = image1Url;
        image2.src = image2Url;

//        const pass = document.getElementById('pass');
//        pass.value = csvData[currentIndex]['pass'] || '0';
//
//        const gsb = document.getElementById('gsb');
//        gsb.value = csvData[currentIndex]['GSB'] || 'G';
        updateOptions(csvData[currentIndex]);
    }
}

// Function to navigate to the previous image
function prevImage() {
    if (currentIndex > 0) {
        currentIndex--;
        displayImage();
    }
}

// Function to navigate to the next image
function nextImage() {
    if (currentIndex < csvData.length - 1) {
        currentIndex++;
        displayImage();
    }
}

//// Function to handle changes in the pass and GSB select options
//function handleSelectChange() {
//    const pass = document.getElementById('pass').value;
//    const gsb = document.getElementById('gsb').value;
//
//    csvData[currentIndex]['pass'] = pass;
//    csvData[currentIndex]['GSB'] = gsb;
//}

function updateOptions(rowData) {
    const pass0Button = document.getElementById('pass0');
    const pass1Button = document.getElementById('pass1');
    const gsButton = document.getElementById('gs');
    const sbButton = document.getElementById('sb');
    const bbButton = document.getElementById('bb');

    pass0Button.classList.remove('selected');
    pass1Button.classList.remove('selected');
    gsButton.classList.remove('selected');
    sbButton.classList.remove('selected');
    bbButton.classList.remove('selected');

    const passValue = rowData['pass'];
    const gsbValue = rowData['GSB'];
    if (passValue === "0") {
        pass0Button.classList.add('selected');
    } else if (passValue === "1") {
        pass1Button.classList.add('selected');
    }
    if (gsbValue === "G") {
        gsButton.classList.add('selected');
    } else if (gsbValue === "S") {
        sbButton.classList.add('selected');
    } else if (gsbValue === "B") {
        bbButton.classList.add('selected');
    }

//    // Set the button text to show the values
//    pass0Button.textContent = "0";
//    pass1Button.textContent = "1";
//    gsButton.textContent = "Good";
//    sbButton.textContent = "Same";
//    bbButton.textContent = "Bad";

}


function togglePass(value) {
    csvData[currentIndex]['pass'] = value.toString();
    updateOptions(csvData[currentIndex]);
}

function toggleGSB(value) {
    csvData[currentIndex]['GSB'] = value;
    updateOptions(csvData[currentIndex]);
}

// Function to save the annotated data to a new file and download
function saveCSVData() {
    if (csvData.length === 0) {
        alert('Please load CSV data first.');
        return;
    }

    const csvContent = convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'annotated_data.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    document.getElementById('message').innerText = 'Data saved and downloaded successfully.';
}

// Function to convert data to CSV format
function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const rows = data.map(record => headers.map(header => record[header]).join(','));
    return [headers.join(','), ...rows].join('\n');
}

// Add event listener to the pass and GSB select options
document.getElementById('pass').addEventListener('change', handleSelectChange);
document.getElementById('gsb').addEventListener('change', handleSelectChange);
