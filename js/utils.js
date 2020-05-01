function prepchart(htmlid,data, labels, title){
new Chart(document.getElementById(htmlid), {
  type: 'line',
  data: {
    labels: labels,
    datasets: data
  },
  options: {
    animation:false,
    title: {
      display: true,
      text: title
    }
  }
});
}

const countries = [
{name:"Poland",
 color:"#3e95cd"},
{name:"Germany",
 color:"#8e5ea2"},
{name:"Italy",
 color:"#3cba9f"},
{name:"Spain",
 color:"#e8c3b9"},
{name:"France",
 color:"#c45850"},
{name:"US",
 color:"#d46810"},
{name:"United Kingdom",
 color:"#143850"},
]

var url = "https://pomber.github.io/covid19/timeseries.json"
const maxN = 25

axios.get(url).then(function(d){
    var dataset = {deaths:[], confirmed:[],recovered:[],nd:[],nc:[]}
    var labels = []
    var toll = 0;
    for(let k in d.data) toll+= d.data[k][d.data[k].length-1].deaths ;
    document.getElementById("toll").innerHTML = "Death Toll: "+toll;
    countries.map(x=>{
       for(let k in dataset) dataset[k].push({label:x.name, data:[],fill:false, borderColor:x.color});
       var arr = d.data[x.name] 
       var arr2 = arr.slice(arr.length-maxN);
       var y2 = arr[arr.length-maxN-1]
       
       arr2.map(y=>{
         for(let k in {deaths:1, confirmed:1, recovered:1} )dataset[k][dataset[k].length-1].data.push(y[k])
         dataset.nd[dataset.nd.length-1].data.push(parseFloat(y.deaths)-parseFloat(y2.deaths))
        dataset.nc[dataset.nc.length-1].data.push(parseFloat(y.confirmed)-parseFloat(y2.confirmed))
         y2 = y
         if(countries[0].name == x.name)labels.push(y.date)
       })
    })
    prepchart("chart1",dataset.deaths,labels,"Deaths")
    prepchart("chart2",dataset.confirmed,labels,"Confirmed")
    prepchart("chart3",dataset.recovered,labels,"Recovered")
    prepchart("chart4",dataset.nd,labels,"New Deaths")
    prepchart("chart5",dataset.nc,labels,"New Confirmed")
})