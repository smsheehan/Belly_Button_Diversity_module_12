function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples
    // **next line is code for deliverable 3 gauge
    var metadataArray = data.metadata
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterSamples = samplesArray.filter(samplesObj => samplesObj.id == sample)
    // **next line is code for deliverable 3 gauge
    var filterMetadataSamples = metadataArray.filter(metaSamplesObj => metaSamplesObj.id == sample)
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filterSamples[0]
    console.log(firstSample);
    // **next line is code for deliverable 3 gauge
    var firstMetadataSample = filterMetadataSamples[0]
    console.log(firstMetadataSample)
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = firstSample.otu_ids
    var otuLabel = firstSample.otu_labels
    var sampleValue = firstSample.sample_values
    console.log(otuID);
    console.log(otuLabel);
    console.log(sampleValue);
    var wfreq = firstMetadataSample.wfreq;
    console.log(wfreq);
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    //SMS note:  need to turn this into a string, otherwise y-axis will be based on otuID number!
    let yticks = otuID.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse()
    console.log(yticks)
   
    // 8. Create the trace for the bar chart. 
    var barData = [
        {
            // y: yticks.otu_ids,
            y: yticks,
            x: sampleValue.slice(0,10).reverse(),
            // y: otuID.slice(0,10),  
            text: otuLabel.slice(0,10).reverse(),
            type: "bar",
            orientation: "h",
            width: 0.8
        }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      paper_bgcolor: "rgb(231, 171, 147)",
      plot_bgcolor: "rgb(231, 171, 147)"
      //   xaxis: { title: "insert text"},
      // yaxis: { ticktext = otuID.slice(0,10)}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // deliverable2 step 1. Create the trace for the bubble chart.
    // https://plotly.com/javascript/bubble-charts/#hover-text-on-bubble-charts

    var bubbleData = [
      {
        x: otuID,   
        y: sampleValue,
        text: otuLabel,
        mode: 'markers',
        marker: {
        color: otuID,
        colorscale: 'RdBu',
        size: sampleValue
        }
      }
    ];

    // 2. deliverable2 step Create the layout for the bubble chart.
    var bubbleLayout = {
      title: '<b>Bacteria Cultures Per Sample</b>',
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: {title: "OTU ID" },
      paper_bgcolor: "rgb(231, 171, 147)",
      plot_bgcolor: "rgb(231, 171, 147)"
    };

    // 3. deliverable2 step Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 4. deliverable 3 Create the trace for the gauge chart.
    // reference: https://plotly.com/javascript/gauge-charts/
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1]},
		    value: wfreq,
		    title: { text: ('<b>Belly Button Washing Frequency</b> <br> Scrubs per Week' )},
		    type: "indicator",
		    mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] 
                  // markers: [{ value: [0, 2, 4 ,6, 8, 10] }],
                  // customTicks: [0, 2, 4, 6, 8, 10]
                 },
          // customTicks: [0, 2, 4, 6, 8, 10],
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 490
          }
        }
      }
     
    ];
    
    // 5. deliverable 3Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, 
      height: 450, 
      margin: { t: 0, b: 0 },
      paper_bgcolor: "rgb(231, 171, 147)" 
     
    };

    // 6. deliverable 3 Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

