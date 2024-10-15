// Function to initialize the page
function init() {
  let selector = d3.select("#selDataset");
  
  // Fetch the JSON data and populate the dropdown
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      let sampleNames = data.names;

      // Populate the select options with sample names
      sampleNames.forEach((sample) => {
          selector.append("option").text(sample).property("value", sample);
      });

      // Use the first sample from the list to build the initial charts and metadata
      let firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
  });
}

// Function to build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      let metadata = data.metadata;
      
      // Filter metadata for the selected sample number
      let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];

      // Select the panel with id `#sample-metadata`
      let panel = d3.select("#sample-metadata");

      // Clear any existing metadata
      panel.html("");

      // Append new tags for each key-value in the metadata
      Object.entries(result).forEach(([key, value]) => {
          panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  });
}

// Function to build charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      let samples = data.samples;

      // Filter the samples for the selected sample number
      let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];

      let otu_ids = result.otu_ids;
      let otu_labels = result.otu_labels;
      let sample_values = result.sample_values;

      // Build the Bubble Chart
      let bubbleLayout = {
          title: "Bacteria Cultures Per Sample",
          margin: { t: 0 },
          hovermode: "closest",
          xaxis: { title: "OTU ID" },
          margin: { t: 30 }
      };

      let bubbleData = [
          {
              x: otu_ids,
              y: sample_values,
              text: otu_labels,
              mode: "markers",
              marker: {
                  size: sample_values,
                  color: otu_ids,
                  colorscale: "Earth"
              }
          }
      ];

      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

      // Build the Bar Chart
      let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      let barData = [
          {
              y: yticks,
              x: sample_values.slice(0, 10).reverse(),
              text: otu_labels.slice(0, 10).reverse(),
              type: "bar",
              orientation: "h"
          }
      ];

      let barLayout = {
          title: "Top 10 Bacteria Cultures Found",
          margin: { t: 30, l: 150 }
      };

      Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to handle change in the dropdown
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();