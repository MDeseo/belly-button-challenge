// Fetch JSON data from URL and console log it

let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let selector = d3.select("#selDataset");

d3.json(url).then(function(data) {
    console.log("data")
    console.log(data);

    names = data.names
    console.log("names");
    console.log(names);

    names.forEach((name) => {
        selector
          .append("option")
          .text(name)
          .property("value", name);
      });

    buildMetadata(names[0]);

    buildCharts(names[0]);

});

function buildMetadata(name) {
    d3.json(url).then(function(data) {
        metadata = data.metadata
        console.log("metadata");
        console.log(metadata);

        resultArray = metadata.filter(sampleObj => sampleObj.id == name);
        console.log("resultArray");
        console.log(resultArray);

        result = resultArray[0];

        let PANEL = d3.select("#sample-metadata");
        
        PANEL.html("");

        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
          });
      
    })
}

function buildCharts(name) {
    d3.json(url).then(function(data) {
        samples = data.samples
        console.log("samples");
        console.log(samples);

        resultArray = samples.filter(sampleObj => sampleObj.id == name);
        console.log("resultArray");
        console.log(resultArray);

        result = resultArray[0];

        otu_ids = result.otu_ids;
        otu_labels = result.otu_labels;
        sample_values = result.sample_values;

        // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
        // Use sample_values as the values for the bar chart.
        // Use otu_ids as the labels for the bar chart.
        // Use otu_labels as the hovertext for the chart.
        
        barData = [
            {
              y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
              x: sample_values.slice(0, 10).reverse(),
              text: otu_labels.slice(0, 10).reverse(),
              type: "bar",
              orientation: "h",
            }
          ];

          barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
          };
      
          Plotly.newPlot("bar", barData, barLayout);

          //   Create a bubble chart that displays each sample.
            
          bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
          };

          //   Use otu_ids for the x values.
          //   Use sample_values for the y values.
          //   Use sample_values for the marker size.
          //   Use otu_ids for the marker colors.
          //   Use otu_labels for the text values

          bubbleData = [
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
      
    });
}

// Update all the plots when a new sample is selected.

function optionChanged(sampleID) {
    buildCharts(sampleID);
    buildMetadata(sampleID);
  }
