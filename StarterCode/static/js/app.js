// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize
function init() {

    // Select dropdown menu
    let dropDown = d3.select("#selDataset");

    // Get sample names and populate dropdown
    d3.json(url).then((data) => {

        // Sample names variable
        let names = data.names;

        // Add to dropdown
        names.forEach((id) => {

            //Console log it
            console.log(id);
            dropDown.append("option")
            .text(id)
            .property("value", id);
        });

        // Set first sample
        let sampleOne = names[0];

        // Console log it
        console.log(sampleOne);

        // Build Plots
        metaData(sampleOne);
        barChart(sampleOne);
        bubbleChart(sampleOne);

    });
};

//Populate metadata
function metaData(sample) {

    //Retrieve all data
    d3.json(url).then((data) => {
        let metadata = data.metadata;

        //Filter the sample's value
        let value = metadata.filter(result => result.id == sample);

        //Console log it
        console.log(value)

        // First index from array
        let valueData = value[0];

        // Clear metadata
        d3.select("#sample-metadata").html("");

        // Add each key/value to the panel
        Object.entries(valueData).forEach(([key, value]) => {

            //Console log it
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text('${key}: ${value');
        });
    });
};

// Build Bar chart
function barChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter sample value
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Console log it
        console.log(otu_ids, otu_labels, sample_values);

        // Find top 10 items in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Build the bubble chart
function bubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Function for updated samples
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    metaData(value);
    barChart(value);
    bubbleChart(value);
};

// Call the initialize function
init();
