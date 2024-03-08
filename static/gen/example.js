document.addEventListener('DOMContentLoaded',function(){const endDate=new Date();const startDate=new Date();startDate.setDate(startDate.getDate()-14);flatpickr(document.getElementById('start'),{enableTime:true,dateFormat:"Y-m-d\\TH:i:S",defaultHour:0,altFormat:"Y-m-d\\TH:i:S",allowInput:true,time_24hr:true,defaultDate:startDate,});flatpickr(document.getElementById('end'),{enableTime:true,dateFormat:"Y-m-d\\TH:i:S",defaultHour:0,altFormat:"Y-m-d\\TH:i:S",allowInput:true,time_24hr:true,defaultDate:endDate,});var baseUrl=isOvsa?'/flarelist':'';function renderTable(data){let tableBody='';data.forEach((item)=>{let row='<tr>';['_id'].forEach((key)=>{row+='<td>'+(item[key]||'')+'</td>';});row+='<td><a href="#" class="flare-id-link" data-flare-id="'+item['flare_id']+'">'+item['flare_id']+'</a></td>';['start','peak','end','GOES_class','link_dspec','link_dspec_data','link_movie','link_fits'].forEach((key)=>{row+='<td>'+(item[key]||'')+'</td>';});row+='</tr>';tableBody+=row;});$('#flare-list').show();$('#flare-list > tbody').html(tableBody);attachFlareIdClickEvent()
}
function attachFlareIdClickEvent(){$('.flare-id-link').on('click',function(e){e.preventDefault();var flareId=$(this).data('flare-id');fetchAndDisplayFlareData(flareId);});}
function fetchAndDisplayFlareData(flareId){$.ajax({url:baseUrl+`/fetch-spectral-data/${flareId}`,method:'GET',success:function(response){var plotData=JSON.parse(response.plot_data_ID);var config={modeBarButtonsToAdd:[{name:'Toggle Log-Y Scale',icon:Plotly.Icons.pencil,click:function(gd){var currentType=gd.layout.yaxis.type;var newType=currentType==='log'?'linear':'log';Plotly.relayout(gd,'yaxis.type',newType);}}],displaylogo:false,responsive:true};Plotly.newPlot('plot-container',plotData.data,plotData.layout,config);document.getElementById('plot-container').scrollIntoView({behavior:'smooth',block:'start'});},error:function(xhr,status,error){console.error("Failed to fetch data for Flare ID:",flareId,status,error);}});}
function fetchData(start,end){$.ajax({url:baseUrl+'/api/flare/query',type:"POST",data:{'start':start,'end':end},dataType:"json",success:function(response){if(response.error){console.error(response.error);}else{renderTable(response.result);attachFlareIdClickEvent()}},error:function(xhr,status,error){console.error("Error occurred: "+error);showError("An error occurred while processing your request.");}});}
$('#query-btn').on('click',function(e){e.preventDefault();let start=$('#start').val();let end=$('#end').val();fetchData(start,end);});(function autoFetchData(){const startPicker=document.querySelector("#start")._flatpickr;const endPicker=document.querySelector("#end")._flatpickr;const start=startPicker.selectedDates[0]?startPicker.selectedDates[0].toISOString().split('T')[0]:null;const end=endPicker.selectedDates[0]?endPicker.selectedDates[0].toISOString().split('T')[0]:null;if(start&&end){fetchData(start,end);}else{console.error("Start or end date is missing.");}})();});