let url = "./samples.json";

// Fetch the JSON data
d3.json(url).then(function(data) {
    console.log(data);
    
    // Test Subject ID No.
    let selection = d3.select("#selDataset");
    data.names.forEach(
        entry => selection.append("option").attr("value", entry).text(entry)
    );
    let id = selection.node().value;
    console.log(id); //

    // Horizontal Bar Chart
    let filtered_sample = [];
    data.samples.map(
        entry => {
            if (entry.id === id) {
                for (let i = 0; i < entry.otu_ids.length; i++) {
                    filtered_sample.push({id: entry.id, otu_ids: entry.otu_ids[i], otu_labels: entry.otu_labels[i], sample_values: entry.sample_values[i]});
                }
            }
        }
    );
    console.log(filtered_sample); //
    // Sorting by sample_values
    let filtered = filtered_sample.sort(
    (a, b) => (b.sample_values - a.sample_values)
    );
    console.log(filtered);
    // Slicing top 10
    let sliced = filtered.slice(0,10);
    console.log(sliced) //
    // Plot Horizontal Bar
    let trace = {
        type: 'bar',
        x: sliced.map(entry => entry.sample_values),
        y: sliced.map(entry => `OTU ${entry.otu_ids}`),
        text: sliced.map(entry => entry.otu_labels),
        orientation: 'h'
    }
    let data_bar = [trace];
    let layout_bar = {
        title: 'Top 10 - Sample Values by OTU IDs',
        xaxis: {
            title: 'Sample Values',
        },
        yaxis: {
            autorange:'reversed'
        },
    }
    Plotly.newPlot('bar', data_bar, layout_bar);

    // Bubble Chart
    var trace_bubble = {
        x: filtered_sample.map(entry => entry.otu_ids),
        y: filtered_sample.map(entry => entry.sample_values),
        mode: 'markers',
        marker: {
            color: filtered_sample.map(entry => entry.otu_ids),
            size: filtered_sample.map(entry => entry.sample_values),
        },
        text: filtered_sample.map(entry => entry.otu_labels),
    };
    var data_bubble = [trace_bubble];
    var layout_bubble = {
    title: 'Sample Values by OTU IDs',
    showlegend: false,
    xaxis: {
        title: 'OTU ID',
    },
    };
    Plotly.newPlot('bubble', data_bubble, layout_bubble);

    // Demographic Info
    let filtered_metadata = '';
    data.metadata.map(
        entry => {
            if (entry.id === parseInt(id)) {
                filtered_metadata = entry;
            }
        }
    );
    console.log(Object.keys(filtered_metadata).length); //
    let demographic = d3.select("#sample-metadata");
    for (let i = 0; i < Object.keys(filtered_metadata).length; i++) {
        demographic.append('p').text(`${Object.keys(filtered_metadata)[i]}: ${Object.values(filtered_metadata)[i]} `);
    };
 


    // On Change ---------XXXXXXXXXXXXXXXXXXXXXXXXXX------------------
    function update() {
        id = selection.node().value;
        console.log(id);

        // Horizontal Bar Chart
        filtered_sample = [];
        data.samples.map(
            entry => {
                if (entry.id === id) {
                    for (let i = 0; i < entry.otu_ids.length; i++) {
                        filtered_sample.push({id: entry.id, otu_ids: entry.otu_ids[i], otu_labels: entry.otu_labels[i], sample_values: entry.sample_values[i]});
                    }
                }
            }
        );
        console.log(filtered_sample); //
        // Sorting by sample_values
        filtered = filtered_sample.sort(
        (a, b) => (b.sample_values - a.sample_values)
        );
        console.log(filtered);
        // Slicing top 10
        sliced = filtered.slice(0,10);
        console.log(sliced) //
        // Restyling Horizontal Bar

        Plotly.restyle("bar", "x", [sliced.map(entry => entry.sample_values)]);
        Plotly.restyle("bar", "y", [sliced.map(entry => `OTU ${entry.otu_ids}`)]);

        // Restyling Bubble Chart
        Plotly.restyle("bubble", "x", [filtered_sample.map(entry => entry.otu_ids)]);
        Plotly.restyle("bubble", "y", [filtered_sample.map(entry => entry.sample_values)]);

        // Demographic Info
        // clear old paragraphs
        demographic.selectAll("p").remove()
        filtered_metadata = '';
        data.metadata.map(
            entry => {
                if (entry.id === parseInt(id)) {
                    filtered_metadata = entry;
                }
            }
        );
        console.log(Object.keys(filtered_metadata).length); //
        demographic = d3.select("#sample-metadata");
        for (let i = 0; i < Object.keys(filtered_metadata).length; i++) {
            demographic.append('p').text(`${Object.keys(filtered_metadata)[i]}: ${Object.values(filtered_metadata)[i]} `);
        };

    };
    
    d3.select("#selDataset").on("change", update);

});
