Vue.component('Landing',{

template: `
  <div>
  
  <h1>{{title}} (last {{maxN}} days)</h1>
  
  <h3>Deaths toll: {{toll}}</h3>


 <chart title="Deaths in Total" 
    v-bind:dataset="this.globaltoll" 
    v-bind:labels="this.labels" htmlid="can-globaltoll">
 </chart>
  
  
<br> 
<br> 

 <div v-for="(x,i) in all_countries">
 <input type="checkbox" :id="x.name" v-model="x.checked" @change="click(i)">
 <label :for="x.name" > {{x.name}} </label>
 </div>
 
 
  <chart title="Confirmed" 
  	v-bind:dataset="this.dataset.confirmed" 
  	v-bind:labels="this.labels" htmlid="can-confirmed">
  </chart>
  
  <chart title="New Confirmed" 
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
		maxN: 90,
		toll:0, 
		labels:[],
		dataset:{},
        countries:[
			{name:"Poland",
				color:"#3e95cd"},
		],
		all_countries: [
	  	  {name:"Poland",
				color:"#3e95cd", checked:true},
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

    click: function(index){
    	this.prepareData(this.rawdata)
    },
	
	prepareData: function(d){
	    this.rawdata = d
	    var dataset = {deaths:[], confirmed:[],recovered:[],nd:[],nc:[]}
		var labels = []
		var toll = 0
		for(let k in d.data) toll+= d.data[k][d.data[k].length-1].deaths;
		this.toll = toll
		this.labels = labels
		this.dataset = dataset
	
		this.countries = [];
		this.all_countries.map(x=>{
			if(x.checked)this.countries.push(x)
		})
		
		this.globaltoll = [{label:"Cumulative",data:[],fill:false,borderColor:"red"}]
		
		for(let i = 1; i <= this.maxN; i++){
		    let loctoll = 0;
			for(let k in d.data) loctoll += d.data[k][d.data[k].length-i].deaths;
			this.globaltoll[0].data.push(loctoll);
		}
		this.globaltoll[0].data.reverse()
		
		this.globaltoll.push({label:"New",data:[],fill:false,borderColor:"black"})
		this.globaltoll[1].data.push(null)
		for(let i = 1; i < this.globaltoll[0].data.length; i++){
		    let v = this.globaltoll[0].data[i] - this.globaltoll[0].data[i-1];
			this.globaltoll[1].data.push(v)
		}
		
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