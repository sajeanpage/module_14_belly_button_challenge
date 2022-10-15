    const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

    var test_subjects;    
    var demographics; 
    var samples;

    // --------------------------------------------------------------------------------
    d3.json(url).then(function(data) {
        // save data parts to variables
        test_subjects = data.names.sort(function(a, b){return a - b});        
        demographics = data.metadata;
        samples = data.samples;
    
        load_dropdown();
    });

    // --------------------------------------------------------------------------------
    function load_dropdown() 
    {
        // grab target dropdown and add options from data
        dropdown = d3.select('#selTestSubjects')

        for(var i=0; i < test_subjects.length; i++)
          dropdown.append('option').text(test_subjects[i]) 
         
        // initial subject
        dropdown_changed(test_subjects[0])
    }

   // --------------------------------------------------------------------------------
   function dropdown_changed(seleted_value) 
    {
        load_demographic(seleted_value);
        load_bar_graph(seleted_value);
        load_guage(seleted_value);
        load_bubble_chart(seleted_value);
    }

   // --------------------------------------------------------------------------------
   function load_demographic(test_subject) 
    {
        // filter to selected demographic and display
        var demo_item = demographics.filter(
            (entry)=> {return entry.id == test_subject;})[0]

        demographic = d3.select("#sample-metadata");
        demographic.html('');
        demographic.append('p').text(`id: ${demo_item.id}`);
        demographic.append('p').text(`ethnicity: ${demo_item.ethnicity}`);
        demographic.append('p').text(`gender: ${demo_item.gender}`);
        demographic.append('p').text(`age: ${demo_item.age}`);
        demographic.append('p').text(`location: ${demo_item.location}`);
        demographic.append('p').text(`bbtype: ${demo_item.bbtype}`);
        demographic.append('p').text(`wfreq: ${demo_item.wfreq}`);      
    }

    // --------------------------------------------------------------------------------
    function load_bar_graph(test_subject) 
        {  
         // filter to selected subject and display
         var subject = samples.filter(
            (entry)=> {return entry.id == test_subject;})[0]

            // set layout
            var layout = 
                {
                    autosize: false, width: 500,
                    yaxis: {autorange: 'reversed'}
                };

            // set data
            var data = [
                {
                    type: 'bar', orientation: 'h',
                    text: subject.otu_labels.slice(0, 10),
                    x: subject.sample_values.slice(0, 10),
                    y: subject.otu_ids.slice(0, 10).map((i) => `OTU ${i}  `),
                    marker: {
                        color: subject.otu_ids,
                        colorscale: 'Jet'}
                }];
              
              Plotly.newPlot('bar', data, layout);
        }

    // --------------------------------------------------------------------------------
    function load_bubble_chart(test_subject) 
        { 
         // filter to selected subject and display
         var subject = samples.filter(
            (entry)=> {return entry.id == test_subject;})[0]

            var trace1 = 
                {
                    x: subject.otu_ids,
                    y: subject.sample_values,
                    text: subject.otu_labels,
                    mode: 'markers',
                    marker: {
                        color: subject.otu_ids,
                        colorscale: 'Jet',
                        size: subject.sample_values}
                };
              
              var data = [trace1];
              
              var layout = {
                autosize: true,
                height: 600,
                xaxis: { title: {text: 'OTU ID'}},
              };
              
              Plotly.newPlot('bubble', data, layout);        
        }

    // --------------------------------------------------------------------------------
    function load_guage(test_subject) 
    {  
        var demo_item;
        var wfreq;
        var guage_ref;
        
        // filter to selected test_subject and show guage
        demo_item = demographics.filter((entry)=> {return entry.id == test_subject;})[0];
        wfreq = demo_item.wfreq === null ? 0 : demo_item.wfreq;

        guage_ref = 'images/scrubs_x.png'.replace('x', Math.round(wfreq));
        guage = d3.select("#gauge").attr('src', guage_ref);
    }

