Vue.component('Landing',{

template: `
  <div>
  
  <h1>{{title}}</h1>
  
  <h3>Deaths toll: {{toll}}</h3>
  
  <chart title="Confirmed" 
  	v-bind:dataset="this.dataset.confirmed" 
  	v-bind:labels="this.labels" htmlid="can-confirmed">
  </chart>
  
  <chart title="New Confirme" 
  v-bind:dataset="this.dataset.nc" 
  v-bind:labels="this.labels" htmlid="can-nc">
  </chart>
  
  
  <chart title="Total Deaths" 
  v-bind:dataset="this.dataset.deaths" 
  v-bind:labels="this.labels" htmlid="can-deaths">
  </chart>
  
  <chart title="New Deaths" 
  	v-bind:dataset="this.dataset.nd" 
  	v-bind:labels="this.labels" htmlid="can-nd">
  </chart>
  
  
  </div>  
`,

data: function(){
	return {
		title: "loading ...",
		url : "https://pomber.github.io/covid19/timeseries.json",
		maxN: 25,
		toll:0, 
		labels:[],
		dataset:{},
		countries: [
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
		
	}
},

methods: {


	prepareData: function(d){
	    var dataset = {deaths:[], confirmed:[],recovered:[],nd:[],nc:[]}
		var labels = []
		var toll = 0
		for(let k in d.data) toll+= d.data[k][d.data[k].length-1].deaths;
		this.toll = toll
		this.labels = labels
		this.dataset = dataset
	
		
		this.countries.map(x=>{
			for(let k in dataset) {
				dataset[k].push({label:x.name, data:[],fill:false, borderColor:x.color});
			}
			var arr = d.data[x.name] 
			var arr2 = arr.slice(arr.length-this.maxN);
			var y2 = arr[arr.length-this.maxN-1]
	
			arr2.map(y=>{
				for(let k in {deaths:1, confirmed:1, recovered:1} )dataset[k][dataset[k].length-1].data.push(y[k])
				dataset.nd[dataset.nd.length-1].data.push(parseFloat(y.deaths)-parseFloat(y2.deaths))
				dataset.nc[dataset.nc.length-1].data.push(parseFloat(y.confirmed)-parseFloat(y2.confirmed))
				y2 = y
				if(this.countries[0].name == x.name)labels.push(y.date)
			})
		})
	}
},

mounted:function(){
    var _this = this
	axios.get(this.url).then(function(d){
		_this.title = 'Covid19'
	
		_this.prepareData(d)
	})
}

})