function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then(function(data) {
    console.log("new data", data);
    var metadat = d3.select("#sample-metadata");
    metadat.html("");
    Object.entries(data).forEach(([key, value]) => {
      var metaline = metadat.append("p");
      metaline.text(`${key}: ${value}`);
      });
    buildGauge(data.WFREQ);
    });
}

function buildCharts(sample) {
  
  d3.json(`/samples/${sample}`).then(function(data) {

    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;
    var piechart = [{
      values: sample_vals.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      type: 'pie'
    }];

    var layout = {
      title: "Pie Chart"
    };

    Plotly.newPlot("pie", piechart, layout);
    


    
    var bubb_size = [];
    for (i=0; i<data.sample_values.length; i++) {
      var val = data.sample_values[i];
      val = val / 1;
      bubb_size.push(val);
    }
    

    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      hovertext: data.otu_labels,
      mode: 'markers',
      marker: {
        size: bubb_size,
        color: data.otu_ids,
        colorscale: "Earth",
        line: {
          width: 1,
          color: 'black',
          opacity: 0.8
        }
      }
    };

    var data_trace = [trace1];

    var layout = {
      title: "Bubble Chart",
      showlegend: false
    };

    Plotly.newPlot("bubble", data_trace, layout);
    console.log("Built Bubble Chart");
 });
}

function init() {
  var selector = d3.select("#selDataset");

  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    console.log("First Sample Is:", firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();