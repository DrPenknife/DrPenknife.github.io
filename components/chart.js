
Vue.component("chart", {
	template:'<div><canvas v-bind:id="this.htmlid">loading...</canvas></div>',
	
	watch:{
		dataset:function(){
		    var _this = this;
		    			
			new Chart(document.getElementById(_this.htmlid), {
				type: 'line',
				data: {
					labels: _this.labels,
					datasets: _this.dataset
				},
				options: {
					animation:false,
					title: {
						display: true,
						text: _this.title
					}
				}
			});
		}
		
	},
	
	props:["htmlid","labels","title","dataset"],
	
	mounted:function(){
	},
	
	updated:function(){alert('1')}
	
})